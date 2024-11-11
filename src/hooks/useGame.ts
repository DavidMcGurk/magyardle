import { useState, useEffect } from "react";
import Node from "../dataStrucAlgs/GraphNode";
import { useGraph } from "./useGraph";

export const useGame = (
  minDistances: Map<Node, Map<Node, number>>,
  adj: number[][],
  regionList: string[],
  regionMap: Map<number, Node>
) => {
  const { isConnected } = useGraph();
  const [start, setStart] = useState<Node>(new Node(""));
  const [finish, setFinish] = useState<Node>(new Node(""));
  const [connectedChoices, setConnectedChoices] = useState<number[]>([]);
  const [disconnectedChoices, setDisconnectedChoices] = useState<number[]>([]);
  const [requiredSteps, setRequiredSteps] = useState<number>(-1);
  const [updatingComplete, setUpdatingComplete] = useState<boolean>(false);
  const [readyToEvaluate, setReadyToEvaluate] = useState<number>(0);
  const [guessQuality, setGuessQuality] = useState<number>(-1);

  const calculateNewShortestRoute = (
    connectedChoices: number[],
    regionMap: Map<number, Node>,
    minDistances: Map<Node, Map<Node, number>>,
    finish: Node
  ) => {
    let shortestRoute = Infinity;
    for (let node of connectedChoices) {
      let nodeNode = regionMap.get(node)!;
      shortestRoute = Math.min(
        shortestRoute,
        minDistances.get(nodeNode)!.get(finish)!
      );
    }
    return shortestRoute;
  };

  const calculateDetour = (
    node: number,
    connectedChoices: number[],
    regionMap: Map<number, Node>,
    minDistances: Map<Node, Map<Node, number>>,
    finish: Node,
    requiredSteps: number
  ) => {
    let minStepsToNode = Infinity;

    for (let otherNode of connectedChoices) {
      const first = regionMap.get(node)!;
      const second = regionMap.get(otherNode)!;
      minStepsToNode = Math.min(
        minStepsToNode,
        minDistances.get(first)!.get(second)!
      );
    }

    const nodeNode = regionMap.get(node)!;
    const distanceNodeToFinish = minDistances.get(finish)!.get(nodeNode)!;
    const pathViaNode = minStepsToNode + distanceNodeToFinish;
    return pathViaNode - requiredSteps;
  };

  useEffect(() => {
    if (minDistances.size > 0 && adj.length > 0) {
      let condition = false;
      let startIndex = -1;
      let finishIndex = -1;

      while (!condition) {
        startIndex = Math.floor(Math.random() * regionList.length);
        finishIndex = Math.floor(Math.random() * regionList.length);
        if (startIndex <= 0 || startIndex == finishIndex || finishIndex <= 0) {
          continue;
        }

        const startNode = regionMap.get(startIndex)!;
        const finishNode = regionMap.get(finishIndex)!;
        let steps = minDistances.get(startNode)!.get(finishNode)!;

        if (steps > 3) {
          condition = true;

          setStart(startNode);
          setFinish(finishNode);

          setConnectedChoices([startIndex]);
          setRequiredSteps(steps);
          console.log("steps = ", steps);
        }
      }
    }
  }, [adj, minDistances, regionMap]);

  useEffect(() => {
    const intersection = connectedChoices.filter((node) =>
      disconnectedChoices.includes(node)
    );

    if (!intersection.length) {
      let flag = false;
      for (let currentlyDisconnected of disconnectedChoices) {
        if (isConnected(currentlyDisconnected, connectedChoices, adj)) {
          flag = true;
          const choices = connectedChoices;
          choices.push(currentlyDisconnected);
          setConnectedChoices(choices);

          const disChoices = [...disconnectedChoices].filter(
            (item) => item !== currentlyDisconnected
          );
          setDisconnectedChoices(disChoices);
        }
      }
      if (
        !flag &&
        (connectedChoices.length > 1 || disconnectedChoices.length > 0)
      ) {
        setUpdatingComplete(true);
      }
    }
  }, [connectedChoices, disconnectedChoices]);

  useEffect(() => {
    if (readyToEvaluate > -2 && updatingComplete) {
      if (readyToEvaluate == -1) {
        const value = calculateNewShortestRoute(
          connectedChoices,
          regionMap,
          minDistances,
          finish
        );
        const dist = value - requiredSteps;
        console.log("New shortest =", value, dist);
        dist <= -1 ? setGuessQuality(0) : setGuessQuality(2);
        setRequiredSteps(value);
      } else {
        const detour = calculateDetour(
          readyToEvaluate,
          connectedChoices,
          regionMap,
          minDistances,
          finish,
          requiredSteps
        );
        console.log("detour is", detour);
        detour == 0
          ? setGuessQuality(1)
          : detour == 1
          ? setGuessQuality(2)
          : setGuessQuality(3);
      }
      setReadyToEvaluate(-2);
    }
  }, [readyToEvaluate, updatingComplete]);

  return {
    start,
    finish,
    connectedChoices,
    setConnectedChoices,
    disconnectedChoices,
    setDisconnectedChoices,
    setReadyToEvaluate,
    requiredSteps,
    guessQuality,
    setGuessQuality,
  };
};
