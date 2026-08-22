import React, { useEffect } from "react";
import "../styles/GuessList.css";
import { t, type Language } from "../i18n";
import type { GuessQuality } from "../dataStrucAlgs/GameEngine";

interface GuessListProps {
  guesses: string[];
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>;
  recentGuess: string;
  guessQuality: GuessQuality;
  setGuessQuality: React.Dispatch<React.SetStateAction<GuessQuality>>;
  language: Language;
}

const GuessList: React.FC<GuessListProps> = ({
  guesses,
  setGuesses,
  recentGuess,
  guessQuality,
  setGuessQuality,
  language,
}) => {
  // useEffect that runs when recentGuess changes
  useEffect(() => {
    if (recentGuess !== "" && guessQuality !== -1) {
      const valueIndicator =
        guessQuality === 0
          ? " ✅"
          : guessQuality === 1
            ? " 🟩"
            : guessQuality === 2
              ? " 🟧"
              : " 🟥";

      const newGuesses = [...guesses];
      newGuesses.push(recentGuess + valueIndicator);
      setGuesses(newGuesses);

      setGuessQuality(-1);
    }
  }, [recentGuess, setGuesses, guessQuality]);

  return (
    <div>
      {/* Only display the list if there are items in guesses */}
      {guesses.length > 0 && (
        <div className="guessList">
          <h4>{t(language, "guessesHeader")}</h4>
          <ul>
            {guesses.map((guess, index) => (
              <li key={index}>
                {index + 1}. {guess}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuessList;
