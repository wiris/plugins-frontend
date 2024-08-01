import { Properties } from "../properties";
import { latexToMathml } from "../services";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml";

let properties: Properties;

interface LatexPosition {
  start: number;
  end: number;
}

const latex = (viewerProperties: Properties) => {
  properties = viewerProperties;

  const convertLatexIntoMathML = async (element: HTMLElement): Promise<MathMLElement[]> => {
    const latexNodes = findNodesContainingLatex(element);
    const mmls: MathMLElement[] = [];

    for (const latexNode of latexNodes) {
      const foundmmls = await findLatexAndReplaceIntoMathML(latexNode);
      mmls.push(...foundmmls)
    }
    return mmls;
  }

  const findNodesContainingLatex = (element: HTMLElement): Node[] => {

    if (!element) {
      return [];
    }

    // return latexNodes;
    const nodeIterator: NodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, (node) =>
      /(\$\$)(.*)(\$\$)/.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    );
    const latexNodes: Node[] = [];

    let currentNode: Node | null;
    while ((currentNode = nodeIterator.nextNode())) {
      latexNodes.push(currentNode);
    }

    return latexNodes;
  };

  /**
  * Replace LaTeX instances with MathML inside a given node.
  * @param {Node} node - Text node in which to search and replace LaTeX instances.
  */

  const findLatexAndReplaceIntoMathML = async (node: Node): Promise<MathMLElement[]> => {
    const mmls: MathMLElement[] = [];
    const textContent: string = node.textContent ?? "";
    let pos: number = 0;

    while (pos < textContent.length) {
      const nextLatexPosition = getNextLatexPos(pos, textContent);
      console.log(JSON.stringify(nextLatexPosition));

      if (nextLatexPosition) {
        // Get left non LaTeX text.
        const leftText: string = textContent.substring(pos, nextLatexPosition.start);
        const leftTextNode = document.createTextNode(leftText);
        // Create a node with left text.
        node.parentNode?.insertBefore(leftTextNode, node);
        node.nodeValue = node.nodeValue?.substring(pos, nextLatexPosition.start) ?? "";

        // Get LaTeX text.
        const latex = textContent.substring(nextLatexPosition.start + "$$".length, nextLatexPosition.end);
        // Convert LaTeX to mathml.
        const response = await latexToMathml(latex, properties.editorServicesRoot, properties.editorServicesExtension);
        // Insert mathml node.
        const fragment = document.createRange().createContextualFragment(response.text);

        fragment.childNodes.forEach(node => {
          if(node instanceof MathMLElement) {
            mmls.push(node);
          }
        });

        node.parentNode?.insertBefore(fragment, node);
        node.nodeValue = node.nodeValue.substring(nextLatexPosition.start, nextLatexPosition.end);

        pos = nextLatexPosition.end + "$$".length;
      }
      else {
        // No more LaTeX node found.
        const text = textContent.substring(pos);
        const textNode = document.createTextNode(text);
        node.parentNode?.insertBefore(textNode, node);
        node.nodeValue = "";
        pos = textContent.length;
      }
    }

    return mmls;
  }

  /**
  * Returns an object {start, end} with the start and end latex position.
  * @param {number} pos - Current position inside the text.
  * @param {string} text - Text where the next latex it will be searched.
  * @
  */
  const getNextLatexPos = (pos: number, text: string): LatexPosition | null => {
    const firstLatexTags = text.indexOf("$$", pos);
    const secondLatexTags = firstLatexTags == -1 ? -1 : text.indexOf("$$", firstLatexTags + "$$".length);
    return firstLatexTags != -1 && secondLatexTags != -1 ? { start: firstLatexTags, end: secondLatexTags } : null;
  }

  return {
    convertLatexIntoMathML
  };
};

export default latex;
