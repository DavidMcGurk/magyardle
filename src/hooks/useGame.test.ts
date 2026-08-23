import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGame } from "./useGame";
import Graph from "../dataStrucAlgs/Graph";
import type Node from "../dataStrucAlgs/GraphNode";
import floydWarshall from "../dataStrucAlgs/floydWarshall";

// Build a simple graph: A-B-C-D-E (linear)
// regions: ["", "A", "B", "C", "D", "E"]
// adj: 1:[2], 2:[1,3], 3:[2,4], 4:[3,5], 5:[4]
const regions = ["", "A", "B", "C", "D", "E"];
const adj = [[], [2], [1, 3], [2, 4], [3, 5], [4]];

interface GameHookProps {
  distances: Map<Node, Map<Node, number>>;
  adjacency: number[][];
  regions: string[];
  map: Map<number, Node>;
}

function buildGraph() {
  const graph = new Graph();
  const regionMap = new Map<number, Node>();
  regions.forEach((r, i) => {
    const node = graph.addNode(r);
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

describe("useGame", () => {
  beforeEach(() => {
    vi.stubGlobal("alert", vi.fn());
  });

  describe("initial state (before game initialization)", () => {
    it("initializes with empty start and finish when no graph data", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.start.name).toBe("");
      expect(result.current.finish.name).toBe("");
    });

    it("initializes with empty connected and disconnected choices when no graph data", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.connectedChoices).toEqual([]);
      expect(result.current.disconnectedChoices).toEqual([]);
    });

    it("initializes showHint as false", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.showHint).toBe(false);
    });

    it("initializes hint as null", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.hint).toBe(null);
    });

    it("initializes requiredSteps as -1 when no graph data", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.requiredSteps).toBe(-1);
    });

    it("initializes guessQuality as -1", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { result } = renderHook(() =>
        useGame(emptyDistances, [[]], [], emptyMap)
      );
      expect(result.current.guessQuality).toBe(-1);
    });
  });

  describe("game initialization", () => {
    it("initializes after graph data loads asynchronously", () => {
      const emptyMap = new Map<number, Node>();
      const emptyDistances = new Map<Node, Map<Node, number>>();
      const { regionMap, minDistances } = buildGraph();
      const { result, rerender } = renderHook(
        ({ distances, adjacency, regions, map }: GameHookProps) =>
          useGame(distances, adjacency, regions, map),
        {
          initialProps: {
            distances: emptyDistances,
            adjacency: [[]],
            regions: [],
            map: emptyMap,
          } as GameHookProps,
        }
      );

      rerender({
        distances: minDistances,
        adjacency: adj,
        regions,
        map: regionMap,
      });

      expect(result.current.start.name).not.toBe("");
      expect(result.current.finish.name).not.toBe("");
      expect(result.current.requiredSteps).toBeGreaterThan(3);
    });

    it("sets start, finish, and requiredSteps when graph data is available", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );

      // After the effect runs, start and finish should be set
      expect(result.current.start.name).not.toBe("");
      expect(result.current.finish.name).not.toBe("");
      expect(result.current.start.name).not.toBe(result.current.finish.name);
      expect(result.current.requiredSteps).toBeGreaterThan(3);
    });

    it("initializes connectedChoices with the start node", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      expect(result.current.connectedChoices.length).toBe(1);
    });
  });

  describe("showHint toggle", () => {
    it("toggles showHint from false to true", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      act(() => {
        result.current.setShowHint(true);
      });
      expect(result.current.showHint).toBe(true);
    });

    it("toggles showHint back to false", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      act(() => {
        result.current.setShowHint(true);
      });
      act(() => {
        result.current.setShowHint(false);
      });
      expect(result.current.showHint).toBe(false);
    });
  });

  describe("hint computation", () => {
    it("computes hint when connectedChoices is populated", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );

      // After game init, connectedChoices has the start node.
      // The hint effect should compute an optimal next guess.
      expect(result.current.hint).not.toBeNull();
    });

    it("hint is a valid region name", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      expect(result.current.hint).not.toBeNull();
      expect(regions).toContain(result.current.hint);
    });

    it("hint is not the start or finish region", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      expect(result.current.hint).not.toBe(result.current.start.name);
      expect(result.current.hint).not.toBe(result.current.finish.name);
    });
  });

  describe("guessQuality", () => {
    it("can be set to a new value", () => {
      const { regionMap, minDistances } = buildGraph();
      const { result } = renderHook(() =>
        useGame(minDistances, adj, regions, regionMap)
      );
      act(() => {
        result.current.setGuessQuality(2);
      });
      expect(result.current.guessQuality).toBe(2);
    });
  });
});
