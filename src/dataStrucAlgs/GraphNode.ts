export class Node {
  name: string;
  edges: Map<Node, number>;

  constructor(name: string) {
    this.name = name;
    this.edges = new Map(); // Edges are stored as a map of Node -> Weight
  }

  // Connects this node to another node with a given weight
  addEdge(target: Node, weight: number): void {
    this.edges.set(target, weight);
  }
}
