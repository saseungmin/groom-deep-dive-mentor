import React from "react";
import "./index.css";

function Header() {
	return (
		<nav className="navbar">
			<div className="navbar-container">
				<a href="/" className="logo">
					Instagram
				</a>
				<div className="nav-icons">
					<div className="nav-icon">🏠</div>
					<div className="nav-icon">✉️</div>
					<div className="nav-icon">🧭</div>
					<div className="nav-icon">❤️</div>
					<div className="nav-icon">👤</div>
				</div>
			</div>
		</nav>
	);
}

export default Header;
