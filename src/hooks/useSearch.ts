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
  language: Language,
  setShowHint: (show: boolean) => void
) => {
  const { isConnected } = useGraph();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

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
      setShowHint(false);
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

  const handleEnterPress = (
    event: React.KeyboardEvent,
    searchResults: string[] = []
  ) => {
    if (event.key === "ArrowDown" && searchResults.length > 0) {
      event.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === "ArrowUp" && searchResults.length > 0) {
      event.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (event.key === "Enter") {
      if (
        selectedSuggestionIndex >= 0 &&
        selectedSuggestionIndex < searchResults.length
      ) {
        handleSelectSuggestion(searchResults[selectedSuggestionIndex]);
      } else if (inputValue !== "") {
        handleGuessClick();
      }
    }
  };

  const handleSearch = () => {
    const results = trie.search(searchTerm);
    setSearchResults(results);
  };

  const handleSelectSuggestion = (value: string) => {
    setInputValue(value);
    setSearchResults([]);
    setSelectedSuggestionIndex(-1);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
    setSelectedSuggestionIndex(-1);
  }, [searchTerm]);

  return {
    inputValue,
    handleEnterPress,
    handleGuessClick,
    handleInputChange,
    handleSelectSuggestion,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
  };
};

export default useSearch;
