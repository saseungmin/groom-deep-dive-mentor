import React from "react";
import Footer from "../Footer";
import Suggestions from "../Suggestions";
import UserProfile from "../UserProfile";
import "./index.css";

function Sidebar({ profile, suggestions, isLoading, onToggleFollow }) {
	return (
		<div className="sidebar">
			<UserProfile profile={profile} isLoading={isLoading.profile} />
			<Suggestions
				suggestions={suggestions}
				isLoading={isLoading.suggestions}
				onToggleFollow={onToggleFollow}
			/>
			<Footer />
		</div>
	);
}

export default Sidebar;
