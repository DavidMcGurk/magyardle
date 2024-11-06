import React from "react";
import "../styles/InputBar.css"; // Import CSS for styling

interface InputBarProps {
  inputValue: string;
  onInputChange: (text: string) => void;
  onButtonClick: () => void;
}

const InputBar: React.FC<InputBarProps> = ({
  inputValue,
  onInputChange,
  onButtonClick,
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
        placeholder="Enter a city, region..."
        className="text-input"
      />
      <button className="submit-button" onClick={handleClick}>
        Guess
      </button>
    </div>
  );
};

export default InputBar;
