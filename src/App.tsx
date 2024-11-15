import { useState } from "react";
import "./styles/App.css";
import MapChart from "./components/MapChart";
import Header from "./components/Header";
import InputBar from "./components/InputBar";
import Trie from "./dataStrucAlgs/Trie";
import AdjacencyMatrix from "./dataStrucAlgs/findAdjacencies";
import floydWarshall from "./dataStrucAlgs/floydWarshall";
import GuessList from "./components/GuessList";
import useSearch from "./hooks/useSearch";
import { useRegion } from "./hooks/useRegion";
import { useGraph } from "./hooks/useGraph";
import { useGame } from "./hooks/useGame";

const App = () => {
  const [trie, setTrie] = useState(new Trie());
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [recentGuess, setRecentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);

  const { adj, loadingAdjacencies, handleAdjacencyComputed, fillGraph } =
    useGraph();

  const { regionList, handleRegionList, regionMap, minDistances } = useRegion(
    setTrie,
    fillGraph,
    floydWarshall,
    adj
  );

  const {
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
  } = useGame(minDistances, adj, regionList, regionMap);

  const {
    inputValue,
    handleInputChange,
    handleGuessClick,
    handleEnterPress,
    handleSelectSuggestion,
  } = useSearch(
    start,
    finish,
    guesses,
    setRecentGuess,
    regionList,
    adj,
    connectedChoices,
    setConnectedChoices,
    disconnectedChoices,
    setDisconnectedChoices,
    setReadyToEvaluate,
    trie,
    setSearchResults
  );

  // constants to align search box
  const maxHeight = 800;
  const itemHeight = 150;
  const boxHeight = Math.min(searchResults.length * itemHeight, maxHeight);

  return (
    <div onKeyDown={handleEnterPress}>
      <Header />
      <main>
        <AdjacencyMatrix onAdjacencyComputed={handleAdjacencyComputed} />

        {loadingAdjacencies ? (
          <h1 className="route-title">Loading...</h1>
        ) : (
          <div>
            <pre style={{ color: "#282828" }}>
              {JSON.stringify(adj, null, 2)}
            </pre>
            <h1 className="route-title">
              {requiredSteps > 1 ? (
                <>
                  Today I'd like to go from{" "}
                  <span className="start-text">{start.name}</span> to{" "}
                  <span className="finish-text">{finish.name}</span>
                </>
              ) : (
                <>You win!</>
              )}
            </h1>
          </div>
        )}

        <div className="map-container">
          <MapChart
            passRegions={handleRegionList}
            start={start.name}
            finish={finish.name}
            connectedChoices={connectedChoices.map((node) => regionList[node])}
            disconnectedChoices={disconnectedChoices.map(
              (node) => regionList[node]
            )}
          />
        </div>

        <InputBar
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onButtonClick={handleGuessClick}
        />
        <div
          className="suggestions-box"
          style={{
            height: `${boxHeight}px`,
            width: `${searchResults.length > 0 ? 2100 : 0}px`,
            transform: `translatex(-1050px) translateY(${-3930 - boxHeight}px)`,
          }}
        >
          {searchResults.length > 0 && (
            <ul className="suggestions-list">
              {searchResults.map((item, index) => (
                <li
                  key={index}
                  className="suggestion"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <GuessList
          guesses={guesses}
          setGuesses={setGuesses}
          recentGuess={recentGuess}
          guessQuality={guessQuality}
          setGuessQuality={setGuessQuality}
        />
      </main>
    </div>
  );
};

export default App;
