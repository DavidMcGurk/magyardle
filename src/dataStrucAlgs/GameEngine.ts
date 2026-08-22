import type Node from "./GraphNode";
import findOptimalNext from "./findOptimalNext";

export type GuessQuality = -1 | 0 | 1 | 2 | 3;

export interface GameState {
  start: Node;
  finish: Node;
  connectedChoices: number[];
  disconnectedChoices: number[];
  requiredSteps: number;
  guessQuality: GuessQuality;
  hint: string | null;
}

export interface GameEngineConfig {
  minDistances: Map<Node, Map<Node, number>>;
  adj: number[][];
  regionList: string[];
  regionMap: Map<number, Node>;
}

export default class GameEngine {
  private minDistances: Map<Node, Map<Node, number>>;
  private adj: number[][];
  private regionList: string[];
  private regionMap: Map<number, Node>;

  constructor(config: GameEngineConfig) {
    this.minDistances = config.minDistances;
    this.adj = config.adj;
    this.regionList = config.regionList;
    this.regionMap = config.regionMap;
  }

  isReady(): boolean {
    return this.minDistances.size > 0 && this.adj.length > 0;
  }

  initializeGame(): {
    start: Node;
    finish: Node;
    startIndex: number;
    requiredSteps: number;
  } {
    let condition = false;
    let startIndex = -1;
    let finishIndex = -1;

    while (!condition) {
      startIndex = Math.floor(Math.random() * this.regionList.length);
      finishIndex = Math.floor(Math.random() * this.regionList.length);
      if (startIndex <= 0 || startIndex === finishIndex || finishIndex <= 0) {
        continue;
      }

      const startNode = this.regionMap.get(startIndex)!;
      const finishNode = this.regionMap.get(finishIndex)!;
      const steps = this.minDistances.get(startNode)!.get(finishNode)!;

      if (steps > 3) {
        condition = true;
        return {
          start: startNode,
          finish: finishNode,
          startIndex,
          requiredSteps: steps,
        };
      }
    }

    // Unreachable due to loop, but TypeScript needs it
    throw new Error("Failed to initialize game");
  }

  isConnectedToGraph(node: number, connectedChoices: number[]): boolean {
    for (const otherNode of connectedChoices) {
      if (this.adj[node].includes(otherNode)) {
        return true;
      }
    }
    return false;
  }

  computeHintForFinish(
    connectedChoices: number[],
    disconnectedChoices: number[],
    finish: Node
  ): string | null {
    if (
      this.minDistances.size === 0 ||
      this.adj.length === 0 ||
      connectedChoices.length === 0
    ) {
      return null;
    }
    return findOptimalNext(
      connectedChoices,
      disconnectedChoices,
      this.adj,
      this.regionList,
      this.regionMap,
      this.minDistances,
      finish
    );
  }

  calculateNewShortestRoute(connectedChoices: number[], finish: Node): number {
    let shortestRoute = Infinity;
    for (const node of connectedChoices) {
      const nodeNode = this.regionMap.get(node)!;
      shortestRoute = Math.min(
        shortestRoute,
        this.minDistances.get(nodeNode)!.get(finish)!
      );
    }
    return shortestRoute;
  }

  calculateDetour(
    node: number,
    connectedChoices: number[],
    finish: Node,
    requiredSteps: number
  ): number {
    let minStepsToNode = Infinity;

    for (const otherNode of connectedChoices) {
      const first = this.regionMap.get(node)!;
      const second = this.regionMap.get(otherNode)!;
      minStepsToNode = Math.min(
        minStepsToNode,
        this.minDistances.get(first)!.get(second)!
      );
    }

    const nodeNode = this.regionMap.get(node)!;
    const distanceNodeToFinish = this.minDistances.get(finish)!.get(nodeNode)!;
    const pathViaNode = minStepsToNode + distanceNodeToFinish;
    return pathViaNode - requiredSteps;
  }

  evaluateConnectedGuess(
    connectedChoices: number[],
    finish: Node,
    requiredSteps: number
  ): { quality: GuessQuality; newRequiredSteps: number } {
    const value = this.calculateNewShortestRoute(connectedChoices, finish);
    const dist = value - requiredSteps;
    const quality: GuessQuality = dist <= -1 ? 0 : 2;
    return { quality, newRequiredSteps: value };
  }

  evaluateDisconnectedGuess(
    node: number,
    connectedChoices: number[],
    finish: Node,
    requiredSteps: number
  ): GuessQuality {
    const detour = this.calculateDetour(
      node,
      connectedChoices,
      finish,
      requiredSteps
    );
    if (detour === 0) return 1;
    if (detour === 1) return 2;
    return 3;
  }

  findReconnectedNodes(
    connectedChoices: number[],
    disconnectedChoices: number[]
  ): {
    newlyConnected: number[];
    remainingDisconnected: number[];
    hasReconnections: boolean;
  } {
    const intersection = connectedChoices.filter((node) =>
      disconnectedChoices.includes(node)
    );

    if (intersection.length > 0) {
      return {
        newlyConnected: [],
        remainingDisconnected: disconnectedChoices,
        hasReconnections: false,
      };
    }

    const newlyConnected: number[] = [];
    const remainingDisconnected: number[] = [];

    for (const node of disconnectedChoices) {
      if (this.isConnectedToGraph(node, connectedChoices)) {
        newlyConnected.push(node);
      } else {
        remainingDisconnected.push(node);
      }
    }

    return {
      newlyConnected,
      remainingDisconnected,
      hasReconnections: newlyConnected.length > 0,
    };
  }
}
