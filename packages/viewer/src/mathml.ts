import { Properties } from "./properties";
import { showImage, createImage, mathml2accessible } from "./services";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml";

/**
 * Data obtained when rendering image. Data needed to set the formula image parameters.
 */
interface FormulaData {
  content: string;
  baseline: string;
  height: string;
  width: string;
  alt?: string;
}

/**
 * Look for safe MathML «math» formulas.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
function findSafeMathMLTextNodes(root: HTMLElement): Node[] {
  const nodeIterator: NodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, (node) =>
    /«math([\s\S]*?)«\/math»/g.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  );
  const safeNodes: Node[] = [];

  let currentNode: Node | null;
  while ((currentNode = nodeIterator.nextNode())) {
    safeNodes.push(currentNode);
  }

  return safeNodes;
}

/**
 * Parse the DOM looking for «math» formulas and replace them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
function decodeSafeMathML(root: any, ignored_mathml_containers: string | null) {
  const safeNodes = findSafeMathMLTextNodes(root);
  const blackListedNodes = root.querySelectorAll(ignored_mathml_containers) ?? [];

  for (const safeNode of safeNodes) {
    if (blackListedNodes.length > 0 && isNodeBlacklisted(safeNode, blackListedNodes)) {
      console.log("Node is blacklisted");
      continue;
    }

    const mathml = MathML.safeXmlDecode(safeNode.textContent ?? "");
    // Insert mathml node.
    const fragment = document.createRange().createContextualFragment(mathml);

    safeNode.parentNode?.insertBefore(fragment, safeNode);
    safeNode.parentNode?.removeChild(safeNode);
  }
}

/**
 * Checks if a node or any of its ancestors are in the blacklist.
 *
 * @param node - The node to check.
 * @param blackListedNodes - The list of blacklisted nodes.
 * @returns True if the node or any of its ancestors are blacklisted, false otherwise.
 */
function isNodeBlacklisted(node: Node, blackListedNodes: NodeListOf<Element>): boolean {
  return Array.from(blackListedNodes).some((blackListedNode) => blackListedNode.contains(node));
}

/**
 * Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
 * @param {Properties} properties - Properties of the viewer.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
export async function renderMathML(properties: Properties, root: HTMLElement): Promise<void> {
  if (properties.viewer !== "image" && properties.viewer !== "mathml") {
    return;
  }

  decodeSafeMathML(root, properties.ignored_containers);

  for (const mathElement of [...root.getElementsByTagName("math")]) {
    const mml = serializeHtmlToXml(mathElement.outerHTML);
    try {
      let imgSource;

      // Transform mml to img.
      if (properties.wirispluginperformance === "true") {
        imgSource = await showImage(
          mml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );
      } else {
        imgSource = await createImage(
          mml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );
      }

      // Set img properties.
      const img = await setImageProperties(properties, imgSource, mml);
      // Replace the MathML for the generated formula image.
      mathElement.parentNode?.replaceChild(img, mathElement);
    } catch {
      console.error(`Cannot render ${mml}: invalid MathML format.`);
      continue;
    }
  }
}

/**
 * Returns an image formula containing all MathType properties.
 * @param {Properties} properties - Properties of the viewer.
 * @param {FormulaData} data - Object containing image values.
 * @param {string} mml - The MathML of the formula image being created.
 * @returns {Promise<HTMLImageElement>} - Formula image.
 */
async function setImageProperties(properties: Properties, data: FormulaData, mml: string): Promise<HTMLImageElement> {
  // Create imag element.
  let img = document.createElement("img");

  // Set image src. Encode the result svg.
  img.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(data.content)}`;

  // Set other image properties.
  img.setAttribute(properties.wiriseditormathmlattribute, mml);
  img.setAttribute("class", "Wirisformula");
  img.setAttribute("role", "math");

  // If the render returns dimensions properties, set them to the image.
  if (+data.height > 0) {
    img.style.verticalAlign = "-" + (+data.height - +data.baseline) + "px";
    img.height = +data.height;
    img.width = +data.width;
  }

  // Set the alt text whenever there's a translation for the characters and MathML on the mml.
  if (!corruptMathML.some((corruptMathML) => mml.includes(corruptMathML))) {
    try {
      if (!data.alt) {
        const { text } = await mathml2accessible(
          mml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );
        data.alt = text;
      }
      img.alt = data.alt ?? "";
    } catch {
      img.alt = "Alternative text not available";
    }
  }

  return img;
}

/**
 * ! --------------- IMPORTANT CONTEXT --------------- !
 *
 * 1. **Attribute Context**: When the HTML parser encounters entities within attribute values, it automatically decodes them. So, `&lt;` becomes `<` in your `open` attribute.
 * 2. **Text Context**: However, within text nodes (the content between tags), entities are preserved to prevent potential issues with HTML syntax. For example, if `<` were not encoded as `&lt;` in a text node, it could be mistaken for the start of a new tag.
 *
 * So, when you call `outerHTML`, it generates a string representation of the element's opening tag (including attributes), content, and closing tag. The attributes have their entities decoded, but the text nodes keep their entities encoded.
 * This is standard behavior for HTML parsers and is not specific to any particular browser or JavaScript environment.
 */

/**
 * Serializes text representing an HTML document to text representing an XML document (encoding/decoding Html Entities when needed).
 * @param {string} text - the string encoded as HTML
 * @returns the same string encoded as XML
 */
export function serializeHtmlToXml(text: string): string {
  const serializer = new XMLSerializer();
  text = serializer.serializeToString(document.createRange().createContextualFragment(text));
  return text;
}

// Set of mathml and characters which don't have an accessible text associated
// and can not be translated or transformed to LaTeX.
const corruptMathML = [
  "⟦",
  "&#10214;",
  "⟧",
  "&#10215;",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
];
