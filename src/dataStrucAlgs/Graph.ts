import Node from "./GraphNode.ts";

export default class Graph {
  nodes: Map<string, Node>;

  constructor() {
    this.nodes = new Map();
  }

  // Adds a node to the graph
  addNode(name: string): Node {
    const node = new Node(name);
    this.nodes.set(name, node);
    return node;
  }

  // Finds a node by its name
  getNode(name: string): Node | undefined {
    return this.nodes.get(name);
  }

  // Connects two nodes in the graph with a weight
  addEdge(from: string, to: string, weight: number): void {
    const fromNode = this.getNode(from);
    const toNode = this.getNode(to);
    if (fromNode && toNode) {
      fromNode.addEdge(toNode, weight);
    }
  }

  // Get all the nodes in the graph
  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }
}
