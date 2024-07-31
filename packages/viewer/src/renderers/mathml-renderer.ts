import { Properties } from "../properties";
import { createImage, mathml2accessible, showImage } from "../services";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml";

/**
 * Data obtained when rendering image. Data needed to set the formula image parameters.
 */
interface ImageData {
  content: string;
  baseline: string;
  height: string;
  width: string;
  alt?: string;
}

let properties: Properties;

const mathmlRenderer = (viewerProperties: Properties) => {
  properties = viewerProperties;

  /**
   *
   * @param element
   * @returns
   */
  const render = async (mathmlElement: MathMLElement): Promise<void> => {
    if (properties.viewer !== "image" && properties.viewer !== "mathml") {
      return;
    }

    const mathml = mathmlElement.outerHTML;

    try {
      let image: ImageData;

      // Transform mml to img.
      if (properties.wirispluginperformance === "true") {
        image = await showImage(
          mathml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );
      } else {
        image = await createImage(
          mathml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );
      }

      // Set img properties.
      const imageElement: HTMLImageElement = await buildImageElement(image, mathml);
      // Replace the MathML for the generated formula image.
      mathmlElement.parentNode?.replaceChild(imageElement, mathmlElement);
    } catch {
      Promise.reject(new Error(`Cannot render ${mathmlElement.outerHTML}: invalid MathML format.`));
    }
  };

  const buildImageElement = async (data: ImageData, mathml: string): Promise<HTMLImageElement> => {
    const image = document.createElement("img");

    // Set image src. Encode the result svg.
    image.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(data.content)}`;

    // Set other image properties.
    image.setAttribute(properties.wiriseditormathmlattribute, mathml);
    image.setAttribute("class", "Wirisformula");
    image.setAttribute("role", "math");

    // If the render returns dimensions properties, set them to the image.
    if (Number(data.height) > 0) {
      const height = Number(data.height);
      const width = Number(data.width);
      const baseline = Number(data.baseline);

      image.style.verticalAlign = `-${height - baseline}px`;
      image.height = height;
      image.width = width;
    }

    // set alternative text
    try {
      if (!data.alt) {
        const { text } = await mathml2accessible(
          mathml,
          properties.lang,
          properties.editorServicesRoot,
          properties.editorServicesExtension,
        );

        data.alt = text;
      }

      image.alt = data.alt ?? "";
    } catch {
      image.alt = "Alternative text not available";
    }

    return image;
  };

  const findSafeMathMLs = (root: HTMLElement): Node[] => {
    const nodeIterator: NodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, (node) =>
      /«math(.*?)«\/math»/.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    );
    const safeNodes: Node[] = [];

    let currentNode: Node | null;
    while ((currentNode = nodeIterator.nextNode())) {
      safeNodes.push(currentNode);
    }

    return safeNodes;
  };

  const parser = new DOMParser();

  const convertSafeMathML = (nodes: Node[]) => {
    const replacedMathMLs: MathMLElement[] = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;

        if (!parent) {
          return; // This should never happen
        }

        const tempDoc = parser.parseFromString(MathML.safeXmlDecode(node.textContent), "text/html");

        const mathMLElement: MathMLElement | null = tempDoc.querySelector("math");

        if (!mathMLElement) {
          return;
        }

        parent.replaceChild(mathMLElement, node);

        replacedMathMLs.push(mathMLElement);
      }
    });

    return replacedMathMLs;
  };

  return {
    render,
    findSafeMathMLs,
    convertSafeMathML,
  };
};

export default mathmlRenderer;
