import { useState } from "react";
import Graph from "../dataStrucAlgs/Graph";
import Node from "../dataStrucAlgs/GraphNode";

export const useGraph = () => {
  const [adj, setAdj] = useState<number[][]>([[]]);
  const [loadingAdjacencies, setLoadingAdjacencies] = useState(false);

  const handleAdjacencyComputed = (adjMatrix: number[][]) => {
    adjMatrix[4].push(...[2, 18, 8, 28, 9]);
    adjMatrix[2].push(4);
    adjMatrix[8].push(4);
    adjMatrix[18].push(4);
    adjMatrix[28].push(4);
    adjMatrix[9].push(4);
    setAdj(adjMatrix);
    setLoadingAdjacencies(false);
  };

  const fillGraph = (regionList: string[], adj: number[][]) => {
    let regionGraph = new Graph();
    let num = 0;
    let regionMap = new Map<number, Node>();

    regionList.forEach((region) => {
      const newNode = regionGraph.addNode(region);
      regionMap.set(num, newNode);
      num++;
    });

    for (let i = 1; i < adj.length; i++) {
      for (let j = 0; j < adj[i].length; j++) {
        regionGraph.addEdge(regionList[i], regionList[adj[i][j]], 1);
      }
    }
    console.log(regionGraph);
    console.log(regionMap);

    return { regionGraph, regionMap };
  };

  const isConnected = (
    node: number,
    connectedChoices: number[],
    adj: number[][]
  ) => {
    for (let otherNode of connectedChoices) {
      if (adj[node].includes(otherNode)) {
        return true;
      }
    }
    return false;
  };

  return {
    adj,
    loadingAdjacencies,
    handleAdjacencyComputed,
    fillGraph,
    isConnected,
  };
};
