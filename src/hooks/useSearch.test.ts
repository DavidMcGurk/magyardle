import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import useSearch from "./useSearch";
import Trie from "../dataStrucAlgs/Trie";
import Node from "../dataStrucAlgs/GraphNode";

// Helper to create a trie from a list of words
function makeTrie(words: string[]): Trie {
  const trie = new Trie();
  for (const word of words) {
    trie.insert(word);
  }
  return trie;
}

// Default test setup
const setup = (
  overrides: Partial<{
    start: Node;
    finish: Node;
    guesses: string[];
    regionList: string[];
    adj: number[][];
    connectedChoices: number[];
    disconnectedChoices: number[];
  }> = {}
) => {
  const start = overrides.start ?? new Node("Pest");
  const finish = overrides.finish ?? new Node("Buda");
  const guesses = overrides.guesses ?? [];
  const regionList = overrides.regionList ?? [
    "",
    "Pest",
    "Buda",
    "Obuda",
    "Cegled",
  ];
  const adj = overrides.adj ?? [[], [2], [1], [1, 4], [3]];
  const connectedChoices = overrides.connectedChoices ?? [1];
  const disconnectedChoices = overrides.disconnectedChoices ?? [];

  const setRecentGuess = vi.fn();
  const setConnectedChoices = vi.fn();
  const setDisconnectedChoices = vi.fn();
  const setReadyToEvaluate = vi.fn();
  const setSearchResults = vi.fn();

  const trie = makeTrie(regionList);

  const { result } = renderHook(() =>
    useSearch(
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
    )
  );

  return {
    result,
    setRecentGuess,
    setConnectedChoices,
    setDisconnectedChoices,
    setReadyToEvaluate,
    setSearchResults,
  };
};

describe("useSearch", () => {
  beforeEach(() => {
    vi.stubGlobal("alert", vi.fn());
  });

  describe("handleInputChange", () => {
    it("updates the input value", () => {
      const { result } = renderHook(() =>
        useSearch(
          new Node("Pest"),
          new Node("Buda"),
          [],
          vi.fn(),
          ["", "Pest", "Buda"],
          [[], [2], [1]],
          [1],
          vi.fn(),
          [],
          vi.fn(),
          vi.fn(),
          makeTrie(["", "Pest", "Buda"]),
          vi.fn()
        )
      );

      act(() => {
        result.current.handleInputChange("P");
      });

      expect(result.current.inputValue).toBe("P");
    });
  });

  describe("handleGuessClick", () => {
    it("alerts when guessing the start region", () => {
      const { result } = setup({ start: new Node("Pest") });

      act(() => {
        result.current.handleInputChange("Pest");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(window.alert).toHaveBeenCalledWith(
        "You can't guess the start region!"
      );
    });

    it("alerts when guessing the finish region", () => {
      const { result } = setup({
        start: new Node("Pest"),
        finish: new Node("Buda"),
      });

      act(() => {
        result.current.handleInputChange("Buda");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(window.alert).toHaveBeenCalledWith(
        "You can't guess the target region!"
      );
    });

    it("alerts when guessing an already-guessed region", () => {
      const { result } = setup({
        start: new Node("Pest"),
        finish: new Node("Buda"),
        guesses: ["Obuda"],
      });

      act(() => {
        result.current.handleInputChange("Obuda");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(window.alert).toHaveBeenCalledWith(
        "You have already guessed Obuda"
      );
    });

    it("alerts when guessing an invalid region", () => {
      const { result } = setup();

      act(() => {
        result.current.handleInputChange("NonExistent");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(window.alert).toHaveBeenCalledWith(
        "NonExistent is not a valid input"
      );
    });

    it("adds a connected guess to connectedChoices and sets readyToEvaluate to -1", () => {
      const {
        result,
        setRecentGuess,
        setConnectedChoices,
        setReadyToEvaluate,
      } = setup({
        start: new Node("Pest"),
        finish: new Node("Buda"),
        regionList: ["", "Pest", "Buda", "Obuda"],
        adj: [[], [3], [], [1]], // Node 3 (Obuda) is adjacent to node 1 (Pest)
        connectedChoices: [1],
      });

      act(() => {
        result.current.handleInputChange("Obuda");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(setRecentGuess).toHaveBeenCalledWith("Obuda");
      expect(setConnectedChoices).toHaveBeenCalledWith([1, 3]);
      expect(setReadyToEvaluate).toHaveBeenCalledWith(-1);
    });

    it("adds a disconnected guess to disconnectedChoices and sets readyToEvaluate to the node index", () => {
      const {
        result,
        setRecentGuess,
        setDisconnectedChoices,
        setReadyToEvaluate,
      } = setup({
        start: new Node("Pest"),
        finish: new Node("Buda"),
        regionList: ["", "Pest", "Buda", "Obuda", "Cegled"],
        adj: [[], [3], [], [1], []], // Node 4 (Cegled) is NOT adjacent to node 1 (Pest)
        connectedChoices: [1],
      });

      act(() => {
        result.current.handleInputChange("Cegled");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(setRecentGuess).toHaveBeenCalledWith("Cegled");
      expect(setDisconnectedChoices).toHaveBeenCalledWith([4]);
      expect(setReadyToEvaluate).toHaveBeenCalledWith(4);
    });

    it("clears the input after a valid guess", () => {
      const { result } = setup({
        start: new Node("Pest"),
        finish: new Node("Buda"),
        regionList: ["", "Pest", "Buda", "Obuda"],
        adj: [[], [3], [], [1]],
        connectedChoices: [1],
      });

      act(() => {
        result.current.handleInputChange("Obuda");
      });
      act(() => {
        result.current.handleGuessClick();
      });

      expect(result.current.inputValue).toBe("");
    });
  });

  describe("handleEnterPress", () => {
    it("triggers guess on Enter key when input is not empty", () => {
      const { result } = setup();

      act(() => {
        result.current.handleInputChange("Pest");
      });

      const event = { key: "Enter" } as React.KeyboardEvent;

      act(() => {
        result.current.handleEnterPress(event);
      });

      expect(window.alert).toHaveBeenCalledWith(
        "You can't guess the start region!"
      );
    });

    it("does not trigger guess on Enter when input is empty", () => {
      const { result } = setup();

      const event = { key: "Enter" } as React.KeyboardEvent;

      act(() => {
        result.current.handleEnterPress(event);
      });

      expect(window.alert).not.toHaveBeenCalled();
    });

    it("does not trigger guess on non-Enter keys", () => {
      const { result } = setup();

      act(() => {
        result.current.handleInputChange("Pest");
      });

      const event = { key: "Escape" } as React.KeyboardEvent;

      act(() => {
        result.current.handleEnterPress(event);
      });

      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  describe("handleSelectSuggestion", () => {
    it("sets the input value to the selected suggestion", () => {
      const setSearchResults = vi.fn();
      const { result } = renderHook(() =>
        useSearch(
          new Node("Pest"),
          new Node("Buda"),
          [],
          vi.fn(),
          ["", "Pest", "Buda"],
          [[], [2], [1]],
          [1],
          vi.fn(),
          [],
          vi.fn(),
          vi.fn(),
          makeTrie(["", "Pest", "Buda"]),
          setSearchResults
        )
      );

      act(() => {
        result.current.handleSelectSuggestion("Pest");
      });

      expect(result.current.inputValue).toBe("Pest");
    });
  });
});
