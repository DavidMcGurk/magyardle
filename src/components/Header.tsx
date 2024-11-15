import "../styles/Header.css";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  language: "hungarian" | "english";
  setLanguage: (lang: "hungarian" | "english") => void;
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
