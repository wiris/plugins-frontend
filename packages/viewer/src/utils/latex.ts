import { Properties } from "../properties";

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

  return {
    findNodesContainingLatex,
  };
};

export default latex;
