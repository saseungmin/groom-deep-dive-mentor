import React from "react";
import "./index.css";

function UserProfile({ profile, isLoading }) {
	if (isLoading) {
		return (
			<div className="user-profile loading">
				<div className="loading-avatar" />
				<div className="profile-info">
					<div className="loading-username" />
					<div className="loading-name" />
				</div>
			</div>
		);
	}

	if (!profile) {
		return null;
	}

	return (
		<div className="user-profile">
			<img
				src={profile.profile_picture}
				alt={profile.username}
				className="user-avatar"
			/>
			<div className="profile-info">
				<div className="profile-username">{profile.username}</div>
				<div className="profile-name">{profile.full_name}</div>
			</div>
		</div>
	);
}

export default UserProfile;
