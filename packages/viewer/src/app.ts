import { Properties } from "./properties";
import { renderLatex } from "./latex";
import { renderMathML } from "./mathml";
import { bypassEncapsulation } from "./retro";
import packageInformation from "../../../node_modules/@wiris/mathtype-viewer/package.json";
import mathmlRenderer from "./renderers/mathml-renderer";

declare global {
  interface Window {
    viewer: {
      properties: Properties;
      isLoaded: boolean;
      version: string;
    };
  }
}

/**
 * Initial function called when loading the script.
 */
async function main(): Promise<void> {
  const properties: Properties = await Properties.getInstance();

  // Expose the globals to the browser
  if (!window.viewer) {
    window.viewer = {
      properties,
      isLoaded: false,
      version: packageInformation.version,
    };
  } else {
    window.viewer.properties = properties;
    window.viewer.isLoaded = false;
    window.viewer.version = packageInformation.version;
  }

  const document = window.document;

  /**
   * Parse the DOM looking for LaTeX and <math> elements.
   * Replaces them with the corresponding rendered images within the given element.
   * @param {Document} document - The DOM document in which to search for the rendering root.
   * @param {MutationObserver} observer - Mutation observer to activate or reactivate every time the rendering root changes.
   */
  properties.render = async () => {
    const element: HTMLElement | null = document.querySelector(properties.element);
    if (element) {
      await renderLatex(properties, element);
      await renderMathML(properties, element);
    }
  };

  // Expose the old Viewer API as a global
  bypassEncapsulation(properties, window);

  // Dispatch an event notifying that the viewer has been loaded
  document.dispatchEvent(new Event("viewerLoaded"));

  // =====================================================================================================================
  // OBSERVERS IMPLEMENTATION
  // =====================================================================================================================

  const { render, findSafeMathMLs, convertSafeMathML } = mathmlRenderer(properties);

  const { findNodesContainingLatex, convertLatexToMml} = latex(properties);

  // TODO
  const renderMath = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        render(entry.target as MathMLElement);
        observer.unobserve(entry.target);
      }
    });
  };

  const mathObserver = new IntersectionObserver(renderMath, {
    rootMargin: "250px",
  });

  const nodesContainingLatex = findNodesContainingLatex();

  nodesContainingLatex.forEach((n) => console.log(n));

  const convertedLatex = convertLatexToMml(nodesContainingLatex);

  const mathMLElements = document.querySelectorAll("math");

  const safeMathMLs = findSafeMathMLs(window.document.documentElement);

  const convertedSafeMathMLs: MathMLElement[] = convertSafeMathML(safeMathMLs);

  [...mathMLElements, ...convertedSafeMathMLs, ...(await convertedLatex)].forEach((m) => mathObserver.observe(m));
}

// This should be the only code executed outside of a function
// and the only code containing browser globals (e.g. window)
main();
