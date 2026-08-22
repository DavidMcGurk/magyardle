import "../styles/Header.css";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Language } from "../i18n";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header = ({ language, setLanguage }: HeaderProps) => {
  return (
    <header>
      <nav className="navbar">
        <img src={"/logo.png"} className="logo-img"></img>
        <div className="logo">magyardle</div>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </nav>
    </header>
  );
};

export default Header;
