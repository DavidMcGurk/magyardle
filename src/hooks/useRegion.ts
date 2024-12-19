import { useState, useCallback, useEffect } from "react";
import Trie from "../dataStrucAlgs/Trie";
import Graph from "../dataStrucAlgs/Graph";
import Node from "../dataStrucAlgs/GraphNode";

export const useRegion = (
  setTrie: (trie: Trie) => void,
  fillGraph: (
    regionList: string[],
    adj: number[][]
  ) => { regionGraph: Graph; regionMap: Map<number, Node> },
  floydWarshall: (graph: Graph) => Map<Node, Map<Node, number>>,
  adj: number[][]
) => {
  const [regionList, setRegionList] = useState<string[]>([]);
  const [regionMap, setRegionMap] = useState<Map<number, Node>>(new Map());
  const [minDistances, setMinDistances] = useState<
    Map<Node, Map<Node, number>>
  >(new Map());

  const handleRegionList = useCallback((arr: string[]) => {
    if (arr.length > 0 && arr[0] !== "") {
      arr.unshift("");
    }
    setRegionList(arr);
    console.log(arr);
    addWordsToTrie(arr);
  }, []);

  const addWordsToTrie = (arr: string[]) => {
    const filledTrie = new Trie();
    for (let region of arr) {
      filledTrie.insert(region);
    }
    setTrie(filledTrie);
  };

  useEffect(() => {
    if (adj.length > 0 && regionList.length > 0) {
      const { regionGraph, regionMap } = fillGraph(regionList, adj);
      setRegionMap(regionMap);
      const dist = floydWarshall(regionGraph);
      setMinDistances(dist);
    }
  }, [adj, regionList]);

  return { regionList, handleRegionList, regionMap, minDistances };
};
