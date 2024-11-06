import React, { useEffect } from "react";
import "../styles/GuessList.css";

// Define the type for the props
interface GuessListProps {
  guesses: string[];
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>;
  recentGuess: string;
  guessQuality: number;
  setGuessQuality: React.Dispatch<React.SetStateAction<number>>;
}

const GuessList: React.FC<GuessListProps> = ({
  guesses,
  setGuesses,
  recentGuess,
  guessQuality,
  setGuessQuality,
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

      let newGuesses = [...guesses];
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
          <h4>Guesses:</h4>
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
