import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGraph } from "./useGraph";

describe("useGraph", () => {
  describe("initial state", () => {
    it("initializes with an empty adjacency matrix", () => {
      const { result } = renderHook(() => useGraph());
      expect(result.current.adj).toEqual([[]]);
    });

    it("initializes with loadingAdjacencies as false", () => {
      const { result } = renderHook(() => useGraph());
      expect(result.current.loadingAdjacencies).toBe(false);
    });
  });

  describe("handleAdjacencyComputed", () => {
    it("sets the adjacency matrix and loading to false", () => {
      const { result } = renderHook(() => useGraph());
      // Need at least 29 entries since handleAdjacencyComputed modifies index 4, 9, 28
      const mockAdj: number[][] = [];
      for (let i = 0; i <= 30; i++) {
        mockAdj.push(i === 0 ? [] : [i + 1]);
      }

      act(() => {
        result.current.handleAdjacencyComputed(mockAdj);
      });

      expect(result.current.adj).toEqual(mockAdj);
      expect(result.current.loadingAdjacencies).toBe(false);
    });

    it("adds manual adjacency for node 4 (Budapest workaround)", () => {
      const { result } = renderHook(() => useGraph());
      // Create an adjacency matrix with enough entries
      const mockAdj: number[][] = [];
      for (let i = 0; i <= 30; i++) {
        mockAdj.push([]);
      }

      act(() => {
        result.current.handleAdjacencyComputed(mockAdj);
      });

      // Node 4 should have [2, 18, 8, 28, 9] added
      expect(result.current.adj[4]).toContain(2);
      expect(result.current.adj[4]).toContain(18);
      expect(result.current.adj[4]).toContain(8);
      expect(result.current.adj[4]).toContain(28);
      expect(result.current.adj[4]).toContain(9);

      // Reverse edges should also be added
      expect(result.current.adj[2]).toContain(4);
      expect(result.current.adj[8]).toContain(4);
      expect(result.current.adj[18]).toContain(4);
      expect(result.current.adj[28]).toContain(4);
      expect(result.current.adj[9]).toContain(4);
    });
  });

  describe("fillGraph", () => {
    it("creates a graph with nodes for each region", () => {
      const { result } = renderHook(() => useGraph());
      const regionList = ["", "Pest", "Buda", "Obuda"];
      const adj = [[], [2], [1], [1]];

      let graphResult;
      act(() => {
        graphResult = result.current.fillGraph(regionList, adj);
      });

      expect(graphResult!.regionGraph.getAllNodes()).toHaveLength(4);
      expect(graphResult!.regionGraph.getNode("Pest")).toBeDefined();
      expect(graphResult!.regionGraph.getNode("Buda")).toBeDefined();
      expect(graphResult!.regionGraph.getNode("Obuda")).toBeDefined();
    });

    it("creates edges based on the adjacency matrix", () => {
      const { result } = renderHook(() => useGraph());
      const regionList = ["", "Pest", "Buda"];
      const adj = [[], [2], [1]];

      let graphResult;
      act(() => {
        graphResult = result.current.fillGraph(regionList, adj);
      });

      const pestNode = graphResult!.regionGraph.getNode("Pest")!;
      const budaNode = graphResult!.regionGraph.getNode("Buda")!;

      expect(pestNode.getWeightTo(budaNode)).toBe(1);
      expect(budaNode.getWeightTo(pestNode)).toBe(1);
    });

    it("creates a regionMap mapping indices to nodes", () => {
      const { result } = renderHook(() => useGraph());
      const regionList = ["", "Pest", "Buda"];
      const adj = [[], [2], [1]];

      let graphResult;
      act(() => {
        graphResult = result.current.fillGraph(regionList, adj);
      });

      expect(graphResult!.regionMap.get(0)!.name).toBe("");
      expect(graphResult!.regionMap.get(1)!.name).toBe("Pest");
      expect(graphResult!.regionMap.get(2)!.name).toBe("Buda");
    });

    it("handles empty adjacency matrix", () => {
      const { result } = renderHook(() => useGraph());
      const regionList = ["", "Pest"];
      const adj = [[], []];

      let graphResult;
      act(() => {
        graphResult = result.current.fillGraph(regionList, adj);
      });

      expect(graphResult!.regionGraph.getAllNodes()).toHaveLength(2);
      expect(graphResult!.regionGraph.getNode("Pest")!.edgeCount).toBe(0);
    });
  });

  describe("isConnected", () => {
    it("returns true when the node is adjacent to any connected choice", () => {
      const { result } = renderHook(() => useGraph());
      const adj = [[], [2, 3], [1, 3], [1, 2]];

      expect(result.current.isConnected(1, [2], adj)).toBe(true);
      expect(result.current.isConnected(1, [3], adj)).toBe(true);
    });

    it("returns false when the node is not adjacent to any connected choice", () => {
      const { result } = renderHook(() => useGraph());
      const adj = [[], [2, 3], [1, 3], [1, 2]];

      expect(result.current.isConnected(2, [3], adj)).toBe(true); // 2 is adjacent to 3
      // Node 1 is adjacent to 2 and 3, but not to 4
      expect(result.current.isConnected(1, [4], adj)).toBe(false);
    });

    it("returns false for empty connected choices", () => {
      const { result } = renderHook(() => useGraph());
      const adj = [[], [2], [1]];

      expect(result.current.isConnected(1, [], adj)).toBe(false);
    });

    it("returns true when node is adjacent to multiple connected choices", () => {
      const { result } = renderHook(() => useGraph());
      const adj = [[], [2, 3], [1], [1]];

      expect(result.current.isConnected(1, [2, 3], adj)).toBe(true);
    });
  });
});
