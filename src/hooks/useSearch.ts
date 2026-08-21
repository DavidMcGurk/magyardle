import { useState, useEffect } from "react";
import type Node from "../dataStrucAlgs/GraphNode";
import type Trie from "../dataStrucAlgs/Trie";
import { useGraph } from "./useGraph";
import { t, type Language } from "../i18n";

const useSearch = (
  start: Node,
  finish: Node,
  guesses: string[],
  setRecentGuess: (guess: string) => void,
  regionList: string[],
  adj: number[][],
  connectedChoices: number[],
  setConnectedChoices: (choices: number[]) => void,
  disconnectedChoices: number[],
  setDisconnectedChoices: (choices: number[]) => void,
  setReadyToEvaluate: (value: number) => void,
  trie: Trie,
  setSearchResults: (results: string[]) => void,
  language: Language
) => {
  const { isConnected } = useGraph();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchTerm(value);
  };

  const handleGuessClick = () => {
    if (start.name === inputValue) {
      alert(t(language, "alertStartRegion"));
    } else if (finish.name === inputValue) {
      alert(t(language, "alertTargetRegion"));
    } else if (guesses.includes(inputValue)) {
      alert(t(language, "alertAlreadyGuessed", inputValue));
    } else if (regionList.includes(inputValue)) {
      const node = regionList.indexOf(inputValue);
      const connected = isConnected(node, connectedChoices, adj);
      setRecentGuess(inputValue);
      if (connected) {
        const choices = [...connectedChoices];
        choices.push(node);
        setConnectedChoices(choices);
        setReadyToEvaluate(-1);
      } else {
        const choices = [...disconnectedChoices];
        choices.push(node);
        setDisconnectedChoices(choices);
        setReadyToEvaluate(node);
      }
      setInputValue("");
    } else {
      alert(t(language, "alertInvalidInput", inputValue));
    }
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue !== "") {
      handleGuessClick();
    }
  };

  const handleSearch = () => {
    const results = trie.search(searchTerm);
    setSearchResults(results);
  };

  const handleSelectSuggestion = (value: string) => {
    setInputValue(value);
    setSearchResults([]);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return {
    inputValue,
    handleEnterPress,
    handleGuessClick,
    handleInputChange,
    handleSelectSuggestion,
  };
};

export default useSearch;
