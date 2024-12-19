import "../styles/Header.css";

interface LanguageSwitcherProps {
  language: "hungarian" | "english";
  setLanguage: (lang: "hungarian" | "english") => void;
}

const LanguageSwitcher = ({ language, setLanguage }: LanguageSwitcherProps) => {
  const handleLanguageChange = (lang: "hungarian" | "english") => {
    setLanguage(lang);
  };

  return (
    <div
      className="language-switcher"
      style={{ display: "flex", justifyContent: "pace-between" }}
    >
      <button
        className={`hu-button ${
          language === "hungarian" ? "button-active" : ""
        }`}
        onClick={() => handleLanguageChange("hungarian")}
      >
        HU
      </button>
      <button
        className={`en-button ${language === "english" ? "button-active" : ""}`}
        onClick={() => handleLanguageChange("english")}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
