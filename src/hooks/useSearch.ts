import { useState, useEffect } from "react";
import Node from "../dataStrucAlgs/GraphNode";
import Trie from "../dataStrucAlgs/Trie";
import { useGraph } from "./useGraph";

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
  setSearchResults: (results: string[]) => void
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
      alert("You can't guess the start region!");
    } else if (finish.name === inputValue) {
      alert("You can't guess the target region!");
    } else if (guesses.includes(inputValue)) {
      alert(`You have already guessed ${inputValue}`);
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
      alert(`${inputValue} is not a valid input`);
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
