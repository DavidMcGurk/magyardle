import React from "react";
import "../styles/InputBar.css";
import { t, type Language } from "../i18n";

interface InputBarProps {
  inputValue: string;
  onInputChange: (text: string) => void;
  onButtonClick: () => void;
  language: Language;
}

const InputBar: React.FC<InputBarProps> = ({
  inputValue,
  onInputChange,
  onButtonClick,
  language,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handleClick = () => {
    onButtonClick();
  };

  return (
    <div className="input-bar-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t(language, "inputPlaceholder")}
        className="text-input"
      />
      <button className="submit-button" onClick={handleClick}>
        {t(language, "guessButton")}
      </button>
    </div>
  );
};

export default InputBar;
