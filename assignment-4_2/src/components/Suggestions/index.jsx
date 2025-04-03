import React from "react";
import "./index.css";

function Suggestions({ suggestions, isLoading, onToggleFollow }) {
	const handleFollowClick = (username, isCurrentlyFollowing) => {
		onToggleFollow(username, !isCurrentlyFollowing);
	};

	if (isLoading) {
		return (
			<div className="suggestions-section">
				<div className="suggestions-header">
					<div className="suggestions-title">회원님을 위한 추천</div>
					<div className="see-all">모두 보기</div>
				</div>

				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="suggestion loading">
						<div className="loading-avatar" />
						<div className="suggestion-info">
							<div className="loading-username" />
							<div className="loading-text" />
						</div>
						<div className="loading-button" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="suggestions-section">
			<div className="suggestions-header">
				<div className="suggestions-title">회원님을 위한 추천</div>
				<div className="see-all">모두 보기</div>
			</div>

			{suggestions.map((user) => (
				<div key={user.id} className="suggestion">
					<img
						src={user.profile_picture}
						alt={user.username}
						className="suggestion-avatar"
					/>
					<div className="suggestion-info">
						<div className="suggestion-username">{user.username}</div>
						<div className="suggestion-text">{user.reason}</div>
					</div>
					<button
						type="button"
						className={`follow-button ${user.isFollowing ? "following" : ""}`}
						onClick={() => handleFollowClick(user.username, user.isFollowing)}
					>
						{user.isFollowing ? "팔로잉" : "팔로우"}
					</button>
				</div>
			))}
		</div>
	);
}

export default Suggestions;
