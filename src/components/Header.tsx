import React from "react";
import "../styles/Header.css"; // Import the CSS for the header

// Define the functional component
const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar">
        <img src={"/logo.png"} className="logo-img"></img>
        <div className="logo">magyardle</div>
      </nav>
    </header>
  );
};

export default Header;
