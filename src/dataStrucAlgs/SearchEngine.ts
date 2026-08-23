import type Node from "./GraphNode";
import type { Language } from "../i18n";
import { t } from "../i18n";
import { isNodeConnected } from "../hooks/useGraph";

export type GuessResult =
  | { valid: true; nodeIndex: number; connected: boolean }
  | { valid: false; alert: string };

export default class SearchEngine {
  private start: Node;
  private finish: Node;
  private guesses: string[];
  private regionList: string[];
  private adj: number[][];

  constructor(
    start: Node,
    finish: Node,
    guesses: string[],
    regionList: string[],
    adj: number[][]
  ) {
    this.start = start;
    this.finish = finish;
    this.guesses = guesses;
    this.regionList = regionList;
    this.adj = adj;
  }

  validateGuess(input: string, language: Language): GuessResult {
    if (this.start.name === input) {
      return { valid: false, alert: t(language, "alertStartRegion") };
    }
    if (this.finish.name === input) {
      return { valid: false, alert: t(language, "alertTargetRegion") };
    }
    if (this.hasAlreadyGuessed(input)) {
      return { valid: false, alert: t(language, "alertAlreadyGuessed", input) };
    }
    if (this.regionList.includes(input)) {
      const nodeIndex = this.regionList.indexOf(input);
      const connected = isNodeConnected(nodeIndex, [], this.adj);
      return { valid: true, nodeIndex, connected };
    }
    return { valid: false, alert: t(language, "alertInvalidInput", input) };
  }

  validateGuessWithConnections(
    input: string,
    language: Language,
    connectedChoices: number[]
  ): GuessResult {
    if (this.start.name === input) {
      return { valid: false, alert: t(language, "alertStartRegion") };
    }
    if (this.finish.name === input) {
      return { valid: false, alert: t(language, "alertTargetRegion") };
    }
    if (this.hasAlreadyGuessed(input)) {
      return { valid: false, alert: t(language, "alertAlreadyGuessed", input) };
    }
    if (this.regionList.includes(input)) {
      const nodeIndex = this.regionList.indexOf(input);
      const connected = isNodeConnected(nodeIndex, connectedChoices, this.adj);
      return { valid: true, nodeIndex, connected };
    }
    return { valid: false, alert: t(language, "alertInvalidInput", input) };
  }

  private hasAlreadyGuessed(input: string): boolean {
    return this.guesses.some(
      (guess) => guess === input || guess.startsWith(`${input} `)
    );
  }
}
