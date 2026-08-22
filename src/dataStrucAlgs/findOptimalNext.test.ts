import { describe, it, expect } from "vitest";
import findOptimalNext from "./findOptimalNext";
import Graph from "./Graph";
import type Node from "./GraphNode";
import floydWarshall from "./floydWarshall";

// Helper: build a graph from a region list and adjacency list, returning
// everything findOptimalNext needs.
function setup(regions: string[], adj: number[][]) {
  const graph = new Graph();
  const regionMap = new Map<number, Node>();

  regions.forEach((region, i) => {
    const node = graph.addNode(region);
    regionMap.set(i, node);
  });

  for (let i = 1; i < adj.length; i++) {
    for (const j of adj[i]) {
      graph.addEdge(regions[i], regions[j], 1);
    }
  }

  const minDistances = floydWarshall(graph);
  return { regionMap, minDistances };
}

// A simple linear graph: 0="" (placeholder), 1=A, 2=B, 3=C, 4=D
// A-B-C-D  (adj: 1:[2], 2:[1,3], 3:[2,4], 4:[3])
const linearRegions = ["", "A", "B", "C", "D"];
const linearAdj = [[], [2], [1, 3], [2, 4], [3]];

describe("findOptimalNext", () => {
  it("returns the neighbour closest to finish", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(4)!;

    // Connected: [1] (A). Neighbours of A: B (index 2).
    // B is distance 2 from D. That's the only option.
    const result = findOptimalNext(
      [1],
      [],
      linearAdj,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("B");
  });

  it("picks the neighbour with the shortest distance to finish when multiple options exist", () => {
    // Star graph: center=1 (A), neighbours 2(B),3(C),4(D)
    // B is directly connected to D (finish), C is not
    // adj: 1:[2,3], 2:[1,4], 3:[1], 4:[2]
    const regions = ["", "A", "B", "C", "D"];
    const adj = [[], [2, 3], [1, 4], [1], [2]];
    const { regionMap, minDistances } = setup(regions, adj);
    const finish = regionMap.get(4)!;

    // Connected: [1] (A). Neighbours: B(2) and C(3).
    // B is distance 1 from D, C is distance 3 from D (C->A->B->D).
    // Should pick B.
    const result = findOptimalNext(
      [1],
      [],
      adj,
      regions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("B");
  });

  it("skips regions already in connectedChoices", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(4)!;

    // Connected: [1, 2] (A and B). Neighbours of A: B (already guessed).
    // Neighbours of B: A (already guessed), C.
    // Should pick C.
    const result = findOptimalNext(
      [1, 2],
      [],
      linearAdj,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("C");
  });

  it("skips regions in disconnectedChoices", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(4)!;

    // Connected: [1]. Neighbours of A: B.
    // But B is in disconnectedChoices, so it should be skipped.
    // No other neighbours -> null.
    const result = findOptimalNext(
      [1],
      [2],
      linearAdj,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBeNull();
  });

  it("returns null when connectedChoices is empty", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(4)!;

    const result = findOptimalNext(
      [],
      [],
      linearAdj,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBeNull();
  });

  it("breaks ties by lowest index", () => {
    // Two equidistant neighbours: 2(B) and 3(C), both distance 1 from finish(4)
    // adj: 1:[2,3], 2:[1,4], 3:[1,4], 4:[2,3]
    const regions = ["", "A", "B", "C", "D"];
    const adj = [[], [2, 3], [1, 4], [1, 4], [2, 3]];
    const { regionMap, minDistances } = setup(regions, adj);
    const finish = regionMap.get(4)!;

    // Connected: [1] (A). Neighbours: B(2) and C(3), both distance 1 from D.
    // Should pick B (lower index).
    const result = findOptimalNext(
      [1],
      [],
      adj,
      regions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("B");
  });

  it("skips index 0 (placeholder)", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(4)!;

    // If somehow index 0 is a neighbour, it should be skipped
    const adjWithZero = [[1], [0, 2], [1, 3], [2, 4], [3]];
    const result = findOptimalNext(
      [1],
      [],
      adjWithZero,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("B");
  });

  it("works when finish is a neighbour of connected set", () => {
    const { regionMap, minDistances } = setup(linearRegions, linearAdj);
    const finish = regionMap.get(3)!; // C

    // Connected: [2] (B). Neighbours: A(1) and C(3).
    // C is the finish (distance 0), A is distance 2 from C.
    // Should pick C.
    const result = findOptimalNext(
      [2],
      [],
      linearAdj,
      linearRegions,
      regionMap,
      minDistances,
      finish
    );
    expect(result).toBe("C");
  });
});
