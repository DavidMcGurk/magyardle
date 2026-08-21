import { describe, it, expect } from "vitest";
import Graph from "./Graph";
import floydWarshall from "./floydWarshall";

describe("floydWarshall", () => {
  it("returns 0 distance from a node to itself", () => {
    const graph = new Graph();
    graph.addNode("A");

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;

    expect(dist.get(nodeA)!.get(nodeA)!).toBe(0);
  });

  it("computes direct edge distances", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addEdge("A", "B", 5);

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeB = graph.getNode("B")!;

    expect(dist.get(nodeA)!.get(nodeB)!).toBe(5);
  });

  it("returns INF for unreachable nodes", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    // No edge between A and B

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeB = graph.getNode("B")!;

    expect(dist.get(nodeA)!.get(nodeB)!).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("computes shortest path through intermediate nodes", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    // A -> B -> C is shorter than A -> C
    graph.addEdge("A", "B", 1);
    graph.addEdge("B", "C", 1);
    graph.addEdge("A", "C", 10);

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeC = graph.getNode("C")!;

    expect(dist.get(nodeA)!.get(nodeC)!).toBe(2);
  });

  it("computes shortest paths in a complex graph", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addNode("D");
    graph.addEdge("A", "B", 1);
    graph.addEdge("B", "C", 2);
    graph.addEdge("C", "D", 1);
    graph.addEdge("A", "D", 10);

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeD = graph.getNode("D")!;

    // Shortest path A -> B -> C -> D = 4
    expect(dist.get(nodeA)!.get(nodeD)!).toBe(4);
  });

  it("handles a graph with a single node", () => {
    const graph = new Graph();
    graph.addNode("A");

    const dist = floydWarshall(graph);
    expect(dist.size).toBe(1);
  });

  it("handles an empty graph", () => {
    const graph = new Graph();
    const dist = floydWarshall(graph);
    expect(dist.size).toBe(0);
  });

  it("computes all-pairs shortest paths correctly", () => {
    // Triangle graph: A <-> B <-> C <-> A (bidirectional)
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addEdge("A", "B", 1);
    graph.addEdge("B", "A", 1);
    graph.addEdge("B", "C", 1);
    graph.addEdge("C", "B", 1);
    graph.addEdge("A", "C", 1);
    graph.addEdge("C", "A", 1);

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeB = graph.getNode("B")!;
    const nodeC = graph.getNode("C")!;

    expect(dist.get(nodeA)!.get(nodeA)!).toBe(0);
    expect(dist.get(nodeA)!.get(nodeB)!).toBe(1);
    expect(dist.get(nodeA)!.get(nodeC)!).toBe(1);
    expect(dist.get(nodeB)!.get(nodeA)!).toBe(1);
    expect(dist.get(nodeB)!.get(nodeC)!).toBe(1);
    expect(dist.get(nodeC)!.get(nodeA)!).toBe(1);
    expect(dist.get(nodeC)!.get(nodeB)!).toBe(1);
  });

  it("handles weighted edges correctly (prefers lower weight path)", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    // Direct path A -> C costs 100
    // Indirect path A -> B -> C costs 2 + 3 = 5
    graph.addEdge("A", "C", 100);
    graph.addEdge("A", "B", 2);
    graph.addEdge("B", "C", 3);

    const dist = floydWarshall(graph);
    const nodeA = graph.getNode("A")!;
    const nodeC = graph.getNode("C")!;

    expect(dist.get(nodeA)!.get(nodeC)!).toBe(5);
  });
});
