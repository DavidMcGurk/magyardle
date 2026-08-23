import { useState, useCallback } from "react";
import Graph from "../dataStrucAlgs/Graph";
import type Node from "../dataStrucAlgs/GraphNode";

// Budapest adjacency workaround: node 4 needs manual connections
const BUDAPEST_NODE = 4;
const BUDAPEST_NEIGHBORS = [2, 18, 8, 28, 9];

function applyBudapestWorkaround(adj: number[][]): void {
  adj[BUDAPEST_NODE].push(...BUDAPEST_NEIGHBORS);
  for (const neighbor of BUDAPEST_NEIGHBORS) {
    adj[neighbor].push(BUDAPEST_NODE);
  }
}

export function buildRegionGraph(
  regionList: string[],
  adj: number[][]
): { regionGraph: Graph; regionMap: Map<number, Node> } {
  const regionGraph = new Graph();
  const regionMap = new Map<number, Node>();

  regionList.forEach((region, index) => {
    const node = regionGraph.addNode(region);
    regionMap.set(index, node);
  });

  for (let i = 1; i < adj.length; i++) {
    for (let j = 0; j < adj[i].length; j++) {
      regionGraph.addEdge(regionList[i], regionList[adj[i][j]], 1);
    }
  }

  return { regionGraph, regionMap };
}

export function isNodeConnected(
  node: number,
  connectedChoices: number[],
  adj: number[][]
): boolean {
  for (const otherNode of connectedChoices) {
    if (adj[node].includes(otherNode)) {
      return true;
    }
  }
  return false;
}

export const useGraph = () => {
  const [adj, setAdj] = useState<number[][]>([[]]);
  const [loadingAdjacencies, setLoadingAdjacencies] = useState(false);

  const handleAdjacencyComputed = useCallback((adjMatrix: number[][]) => {
    applyBudapestWorkaround(adjMatrix);
    setAdj(adjMatrix);
    setLoadingAdjacencies(false);
  }, []);

  const fillGraph = useCallback(
    (regionList: string[], adj: number[][]) =>
      buildRegionGraph(regionList, adj),
    []
  );

  const isConnected = useCallback(
    (node: number, connectedChoices: number[], adj: number[][]) =>
      isNodeConnected(node, connectedChoices, adj),
    []
  );

  return {
    adj,
    loadingAdjacencies,
    handleAdjacencyComputed,
    fillGraph,
    isConnected,
  };
};
