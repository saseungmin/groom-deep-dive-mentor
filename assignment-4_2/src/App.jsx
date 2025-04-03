import React from "react";
import "./App.css";
import Feed from "./components/Feed";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Stories from "./components/stories";

function App() {
	return (
		<div className="instagram-app">
			<Header />
			<main className="main-container">
				<div className="content">
					<Stories />
					<Feed />
				</div>
				<Sidebar />
			</main>
		</div>
	);
}

export default App;
