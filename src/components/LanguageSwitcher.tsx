import "../styles/Header.css";
import type { Language } from "../i18n";

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher = ({ language, setLanguage }: LanguageSwitcherProps) => {
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        className={`en-button ${language === "english" ? "button-active" : ""}`}
        onClick={() => handleLanguageChange("english")}
      >
        EN
      </button>
      <button
        className={`hu-button ${
          language === "hungarian" ? "button-active" : ""
        }`}
        onClick={() => handleLanguageChange("hungarian")}
      >
        HU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
