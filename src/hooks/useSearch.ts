import { useState, useEffect, useRef } from "react";
import type Node from "../dataStrucAlgs/GraphNode";
import type Trie from "../dataStrucAlgs/Trie";
import SearchEngine from "../dataStrucAlgs/SearchEngine";
import type { Language } from "../i18n";

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
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const engineRef = useRef<SearchEngine | null>(null);
  engineRef.current = new SearchEngine(start, finish, guesses, regionList, adj);

  const resetSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setSearchResults([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchTerm(value);
    setErrorMessage(null);
  };

  const handleGuessClick = () => {
    const engine = engineRef.current!;
    const result = engine.validateGuessWithConnections(
      inputValue,
      language,
      connectedChoices
    );

    if (!result.valid) {
      setErrorMessage(result.alert);
      return;
    }

    setErrorMessage(null);
    setRecentGuess(inputValue);
    setShowHint(false);

    if (result.connected) {
      setConnectedChoices([...connectedChoices, result.nodeIndex]);
      setReadyToEvaluate(-1);
    } else {
      setDisconnectedChoices([...disconnectedChoices, result.nodeIndex]);
      setReadyToEvaluate(result.nodeIndex);
    }
    setInputValue("");
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

  const handleSelectSuggestion = (value: string) => {
    setInputValue(value);
    setSearchResults([]);
    setSelectedSuggestionIndex(-1);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = trie.search(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setSelectedSuggestionIndex(-1);
  }, [searchTerm, trie, setSearchResults]);

  return {
    inputValue,
    handleEnterPress,
    handleGuessClick,
    handleInputChange,
    handleSelectSuggestion,
    resetSearch,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    errorMessage,
  };
};

export default useSearch;
