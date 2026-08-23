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
import { t, type Language } from "./i18n";
import processName from "./dataStrucAlgs/declineRegions";

const App = () => {
  const [trie, setTrie] = useState(new Trie());
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [recentGuess, setRecentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>("english");

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
    showHint,
    setShowHint,
    hint,
    resetGame,
  } = useGame(minDistances, adj, regionList, regionMap);

  const {
    inputValue,
    handleInputChange,
    handleGuessClick,
    handleEnterPress,
    handleSelectSuggestion,
    resetSearch,
    selectedSuggestionIndex,
    errorMessage,
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
    setSearchResults,
    language,
    setShowHint
  );

  const routePrompt = (() => {
    if (language === "hungarian") {
      // Hungarian uses declension: "Ma szeretnék menni Pestről Budára"
      // (Today I'd like to go from Pest to Buda). The "from/to" relation is
      // expressed purely via case suffixes, so no separate "to" word is needed.
      const from = processName(start.name, false);
      const to = processName(finish.name, true);
      return `${t(language, "routePrompt")} ${from} ${to}`;
    }
    return `${t(language, "routePrompt")} ${start.name} ${t(language, "to")} ${finish.name}`;
  })();

  const handleRestart = () => {
    setRecentGuess("");
    setGuesses([]);
    setSearchResults([]);
    resetSearch();
    resetGame();
  };

  return (
    <div onKeyDown={(e) => handleEnterPress(e, searchResults)}>
      <Header language={language} setLanguage={setLanguage} />
      <main>
        <AdjacencyMatrix onAdjacencyComputed={handleAdjacencyComputed} />

        {loadingAdjacencies ? (
          <h1 className="route-title">{t(language, "loading")}</h1>
        ) : (
          <h1 className="route-title">
            {requiredSteps > 1 ? routePrompt : t(language, "youWin")}
          </h1>
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
          language={language}
        />
        {errorMessage && (
          <p className="input-error" role="alert">
            {errorMessage}
          </p>
        )}
        <div
          className="suggestions-box"
          style={{
            display: searchResults.length > 0 ? "block" : "none",
          }}
        >
          {searchResults.length > 0 && (
            <ul className="suggestions-list">
              {searchResults.map((item, index) => (
                <li
                  key={index}
                  className="suggestion"
                  style={
                    index === selectedSuggestionIndex
                      ? { backgroundColor: "#73685e" }
                      : undefined
                  }
                  onClick={() => handleSelectSuggestion(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hint-container">
          <button
            className="hint-button"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? t(language, "hintHide") : t(language, "hintButton")}
          </button>
          <button className="restart-button" onClick={handleRestart}>
            {t(language, "restartButton")}
          </button>
          {showHint && hint && (
            <span className="hint-text">
              {t(language, "hintText", hint.substring(0, 2))}
            </span>
          )}
        </div>

        {!errorMessage && (
          <GuessList
            guesses={guesses}
            setGuesses={setGuesses}
            recentGuess={recentGuess}
            guessQuality={guessQuality}
            setGuessQuality={setGuessQuality}
            language={language}
          />
        )}
      </main>
    </div>
  );
};

export default App;
