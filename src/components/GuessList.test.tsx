import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GuessList from "./GuessList";
import type { GuessQuality } from "../dataStrucAlgs/GameEngine";

const baseProps = {
  guesses: [] as string[],
  setGuesses: vi.fn() as React.Dispatch<React.SetStateAction<string[]>>,
  recentGuess: "",
  guessQuality: -1 as GuessQuality,
  setGuessQuality: vi.fn() as React.Dispatch<
    React.SetStateAction<GuessQuality>
  >,
  language: "english" as const,
};

describe("GuessList", () => {
  it("renders nothing when there are no guesses", () => {
    const { container } = render(<GuessList {...baseProps} />);
    expect(container.querySelector(".guessList")).toBeNull();
  });

  it("renders the guesses header when guesses exist", () => {
    render(<GuessList {...baseProps} guesses={["Pest ✅"]} />);
    expect(screen.getByText("Guesses:")).toBeInTheDocument();
  });

  it("renders the Hungarian header", () => {
    render(
      <GuessList {...baseProps} guesses={["Pest ✅"]} language="hungarian" />
    );
    expect(screen.getByText("Tippek:")).toBeInTheDocument();
  });

  it("renders each guess with its index number", () => {
    render(
      <GuessList {...baseProps} guesses={["Pest ✅", "Buda 🟩", "Cegled 🟧"]} />
    );
    expect(screen.getByText("1. Pest ✅")).toBeInTheDocument();
    expect(screen.getByText("2. Buda 🟩")).toBeInTheDocument();
    expect(screen.getByText("3. Cegled 🟧")).toBeInTheDocument();
  });

  it("appends a guess with the correct emoji for guessQuality 0 (optimal)", () => {
    const setGuesses = vi.fn();
    const setGuessQuality = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={[]}
        recentGuess="Pest"
        guessQuality={0}
        setGuesses={setGuesses}
        setGuessQuality={setGuessQuality}
      />
    );
    expect(setGuesses).toHaveBeenCalledWith(["Pest ✅"]);
    expect(setGuessQuality).toHaveBeenCalledWith(-1);
  });

  it("appends a guess with the correct emoji for guessQuality 1 (good)", () => {
    const setGuesses = vi.fn();
    const setGuessQuality = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={["Pest ✅"]}
        recentGuess="Buda"
        guessQuality={1}
        setGuesses={setGuesses}
        setGuessQuality={setGuessQuality}
      />
    );
    expect(setGuesses).toHaveBeenCalledWith(["Pest ✅", "Buda 🟩"]);
    expect(setGuessQuality).toHaveBeenCalledWith(-1);
  });

  it("appends a guess with the correct emoji for guessQuality 2 (ok)", () => {
    const setGuesses = vi.fn();
    const setGuessQuality = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={[]}
        recentGuess="Cegled"
        guessQuality={2}
        setGuesses={setGuesses}
        setGuessQuality={setGuessQuality}
      />
    );
    expect(setGuesses).toHaveBeenCalledWith(["Cegled 🟧"]);
  });

  it("appends a guess with the correct emoji for guessQuality 3 (bad)", () => {
    const setGuesses = vi.fn();
    const setGuessQuality = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={[]}
        recentGuess="Debrecen"
        guessQuality={3}
        setGuesses={setGuesses}
        setGuessQuality={setGuessQuality}
      />
    );
    expect(setGuesses).toHaveBeenCalledWith(["Debrecen 🟥"]);
  });

  it("does not append when recentGuess is empty", () => {
    const setGuesses = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={[]}
        recentGuess=""
        guessQuality={0}
        setGuesses={setGuesses}
      />
    );
    expect(setGuesses).not.toHaveBeenCalled();
  });

  it("does not append when guessQuality is -1", () => {
    const setGuesses = vi.fn();
    render(
      <GuessList
        {...baseProps}
        guesses={[]}
        recentGuess="Pest"
        guessQuality={-1}
        setGuesses={setGuesses}
      />
    );
    expect(setGuesses).not.toHaveBeenCalled();
  });
});
