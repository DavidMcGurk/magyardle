export default class Node {
  readonly name: string;
  private edges: Map<Node, number>;

  constructor(name: string) {
    this.name = name;
    this.edges = new Map();
  }

  addEdge(target: Node, weight: number): void {
    this.edges.set(target, weight);
  }

  getNeighbors(): Node[] {
    return Array.from(this.edges.keys());
  }

  getWeightTo(neighbor: Node): number | undefined {
    return this.edges.get(neighbor);
  }

  get edgeCount(): number {
    return this.edges.size;
  }

  getEdges(): Map<Node, number> {
    return this.edges;
  }
}
