import { Properties } from "../properties";
import { latexToMathml } from "../services";

let properties: Properties;

const latex = (viewerProperties: Properties) => {
  properties = viewerProperties;

  const findNodesContainingLatex = (): Node[] => {
    const root: HTMLElement | null = document.querySelector(properties.element);

    if (!root) {
      return [];
    }

    const nodeIterator: NodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, (node) => {
      return /\${2}.*?\${2}/.test(node.nodeValue ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    });

    const latexNodes: Node[] = [];

    let currentNode: Node | null;

    while ((currentNode = nodeIterator.nextNode())) {
      latexNodes.push(currentNode);
    }

    return latexNodes;
  };

  const parser = new DOMParser();

  const convertLatexToMml = async (latexNodes: Node[]): Promise<MathMLElement[]> => {
    const mmls: MathMLElement[] = [];

    for (const latexNode of latexNodes) {
      const latexText = latexNode?.textContent;
      if (latexText) {
        console.log(latexText);
        const response = await latexToMathml(latexText, properties.editorServicesRoot, properties.editorServicesExtension);
        const parent = latexNode.parentNode;
        if (!parent) {
          return[]; // This should never happen
        }

        const tempDoc = parser.parseFromString(response.text, "text/html");

        const mathMLElement: MathMLElement | null = tempDoc.querySelector("math");

        if (!mathMLElement) {
          return[];
        }

        parent.replaceChild(mathMLElement, latexNode);

        mmls.push(mathMLElement);
      }
    }

    return mmls;
  };

  return {
    findNodesContainingLatex,
    convertLatexToMml
  };
};

export default latex;
