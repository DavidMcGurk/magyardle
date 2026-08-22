import Node from "./GraphNode";

export default class Graph {
  private nodes: Map<string, Node>;

  constructor() {
    this.nodes = new Map();
  }

  addNode(name: string): Node {
    const node = new Node(name);
    this.nodes.set(name, node);
    return node;
  }

  getNode(name: string): Node | undefined {
    return this.nodes.get(name);
  }

  addEdge(from: string, to: string, weight: number): void {
    const fromNode = this.getNode(from);
    const toNode = this.getNode(to);
    if (fromNode && toNode) {
      fromNode.addEdge(toNode, weight);
    }
  }

  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  get size(): number {
    return this.nodes.size;
  }
}
