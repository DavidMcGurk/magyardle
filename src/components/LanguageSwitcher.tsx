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
    <div style={{ display: "flex", justifyContent: "pace-between" }}>
      <button
        className={language === "hungarian" ? "hu-button-active" : "hu-button"}
        onClick={() => handleLanguageChange("hungarian")}
      >
        HU
      </button>
      <button
        className={language === "english" ? "en-button-active" : "en-button"}
        onClick={() => handleLanguageChange("english")}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
