import { useState, useCallback, useEffect } from "react";
import "./styles/App.css";
import MapChart from "./components/MapChart";
import Header from "./components/Header";
import InputBar from "./components/InputBar";
import { Trie } from "./dataStrucAlgs/Trie";
import AdjacencyMatrix from "./components/findAdjacencies";
import { floydWarshall } from "./dataStrucAlgs/floydWarshall";
import { Graph } from "./dataStrucAlgs/Graph";
import { Node } from "./dataStrucAlgs/GraphNode";
import GuessList from "./components/GuessList";

const App = () => {
  const [regionList, setRegionList] = useState<string[]>([]);
  const [trie] = useState(new Trie());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [adj, setAdj] = useState<number[][]>([[]]);
  const [loadingAdjacencies, setLoadingAdjacencies] = useState(false);
  const [minDistances, setMinDistances] = useState<
    Map<Node, Map<Node, number>>
  >(new Map());
  const [regionMap, setRegionMap] = useState<Map<number, Node>>(new Map());
  const [start, setStart] = useState<Node>(new Node(""));
  const [finish, setFinish] = useState<Node>(new Node(""));
  const [connectedChoices, setConnectedChoices] = useState<number[]>([]);
  const [disconnectedChoices, setDisconnectedChoices] = useState<number[]>([]);
  const [requiredSteps, setRequiredSteps] = useState<number>(-1);
  const [updatingComplete, setUpdatingComplete] = useState<boolean>(false);
  const [readyToEvaluate, setReadyToEvaluate] = useState<number>(0);
  const [recentGuess, setRecentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessQuality, setGuessQuality] = useState<number>(-1);

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (adj.length > 0 && regionList.length > 0) {
      const graph = fillGraph();
      const dist = floydWarshall(graph);
      setMinDistances(dist);
    }
  }, [adj, regionList]);

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
        if (isConnected(currentlyDisconnected)) {
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
        const value = calculateNewShortestRoute();
        const dist = value - requiredSteps;
        console.log("New shortest =", value, dist);
        dist <= -1 ? setGuessQuality(0) : setGuessQuality(2);
        setRequiredSteps(value);
      } else {
        const detour = calculateDetour(readyToEvaluate);
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

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue !== "") {
      handleGuessClick();
    }
  };

  const handleRegionList = useCallback(
    (arr: string[]) => {
      if (arr.length > 0) {
        if (arr[0] !== "") {
          arr.unshift("");
        }
        setRegionList(arr);
        addWordsToTrie();
      }
    },
    [regionList, setRegionList]
  );

  const handleSearch = () => {
    const results = trie.search(searchTerm);
    setSearchResults(results);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchTerm(value);
  };

  const handleSelectSuggestion = (value: string) => {
    setInputValue(value);
    setSearchResults([]);
  };

  const handleGuessClick = () => {
    if (start.name === inputValue) {
      alert("You can't guess the start region!");
    } else if (finish.name === inputValue) {
      alert("You can't guess the target region!");
    } else if (guesses.includes(inputValue)) {
      alert(`You have already guessed ${inputValue}`);
    }

    if (regionList.includes(inputValue)) {
      const node = regionList.indexOf(inputValue);
      const connected = isConnected(node);
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
      setUpdatingComplete(false);
    } else {
      alert(`${inputValue} is not a valid input`);
    }
  };

  const isConnected = (node: number) => {
    for (let otherNode of connectedChoices) {
      if (adj[node].includes(otherNode)) {
        return true;
      }
    }
    return false;
  };

  const calculateNewShortestRoute = () => {
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

  const calculateDetour = (node: number) => {
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

  const handleAdjacencyComputed = (adjMatrix: number[][]) => {
    adjMatrix[4].push(...[2, 18, 8, 28, 9]);
    adjMatrix[2].push(4);
    adjMatrix[8].push(4);
    adjMatrix[18].push(4);
    adjMatrix[28].push(4);
    adjMatrix[9].push(4);
    setAdj(adjMatrix);
    setLoadingAdjacencies(false);
  };

  const addWordsToTrie = () => {
    for (let region of regionList) {
      trie.insert(region);
    }
  };

  const fillGraph = () => {
    const regionGraph = new Graph();
    let num = 0;
    const map = new Map();

    regionList.forEach((region) => {
      const newNode = regionGraph.addNode(region);
      map.set(num, newNode);
      num++;
    });

    setRegionMap(map);

    for (let i = 1; i < adj.length; i++) {
      for (let j = 0; j < adj[i].length; j++) {
        regionGraph.addEdge(regionList[i], regionList[adj[i][j]], 1);
      }
    }

    return regionGraph;
  };

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
            <pre>{JSON.stringify(adj, null, 2)}</pre>
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
