import { useState, useEffect, useRef } from "react";
import Node from "../dataStrucAlgs/GraphNode";
import GameEngine, { type GuessQuality } from "../dataStrucAlgs/GameEngine";

export const useGame = (
  minDistances: Map<Node, Map<Node, number>>,
  adj: number[][],
  regionList: string[],
  regionMap: Map<number, Node>
) => {
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new GameEngine({
      minDistances,
      adj,
      regionList,
      regionMap,
    });
  }
  const engine = engineRef.current;

  const [start, setStart] = useState<Node>(new Node(""));
  const [finish, setFinish] = useState<Node>(new Node(""));
  const [connectedChoices, setConnectedChoices] = useState<number[]>([]);
  const [disconnectedChoices, setDisconnectedChoices] = useState<number[]>([]);
  const [requiredSteps, setRequiredSteps] = useState<number>(-1);
  const [updatingComplete, setUpdatingComplete] = useState<boolean>(false);
  const [readyToEvaluate, setReadyToEvaluate] = useState<number>(0);
  const [guessQuality, setGuessQuality] = useState<GuessQuality>(-1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hint, setHint] = useState<string | null>(null);

  // Compute hint when choices change
  useEffect(() => {
    if (
      minDistances.size > 0 &&
      adj.length > 0 &&
      connectedChoices.length > 0
    ) {
      const optimal = engine.computeHintForFinish(
        connectedChoices,
        disconnectedChoices,
        finish
      );
      setHint(optimal);
    }
  }, [
    connectedChoices,
    disconnectedChoices,
    adj,
    regionList,
    regionMap,
    minDistances,
    finish,
    engine,
  ]);

  // Initialize game when graph data is ready
  useEffect(() => {
    if (minDistances.size > 0 && adj.length > 0) {
      const { start, finish, startIndex, requiredSteps } =
        engine.initializeGame();
      setStart(start);
      setFinish(finish);
      setConnectedChoices([startIndex]);
      setRequiredSteps(requiredSteps);
    }
  }, [adj, minDistances, regionMap, engine]);

  // Reconnect disconnected nodes that become adjacent
  useEffect(() => {
    const { newlyConnected, remainingDisconnected, hasReconnections } =
      engine.findReconnectedNodes(connectedChoices, disconnectedChoices);

    if (hasReconnections) {
      setConnectedChoices([...connectedChoices, ...newlyConnected]);
      setDisconnectedChoices(remainingDisconnected);
    } else if (connectedChoices.length > 1 || disconnectedChoices.length > 0) {
      setUpdatingComplete(true);
    }
  }, [connectedChoices, disconnectedChoices, engine]);

  // Evaluate guess quality
  useEffect(() => {
    if (readyToEvaluate > -2 && updatingComplete) {
      if (readyToEvaluate === -1) {
        const { quality, newRequiredSteps } = engine.evaluateConnectedGuess(
          connectedChoices,
          finish,
          requiredSteps
        );
        setGuessQuality(quality);
        setRequiredSteps(newRequiredSteps);
      } else {
        const quality = engine.evaluateDisconnectedGuess(
          readyToEvaluate,
          connectedChoices,
          finish,
          requiredSteps
        );
        setGuessQuality(quality);
      }
      setReadyToEvaluate(-2);
    }
  }, [
    readyToEvaluate,
    updatingComplete,
    connectedChoices,
    finish,
    requiredSteps,
    engine,
  ]);

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
    showHint,
    setShowHint,
    hint,
  };
};
