import React from "react";
import "./index.css";

function Stories({ stories, isLoading }) {
	if (isLoading) {
		return (
			<div className="stories">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="story loading">
						<div className="loading-circle" />
						<div className="loading-text" />
					</div>
				))}
			</div>
		);
	}

	const handleStoryClick = (storyId, username) => {
		alert(`${username}님의 스토리를 봅니다.`);
	};

	return (
		<div className="stories">
			{stories.map((story) => (
				<button
					type="button"
					key={story.id}
					className="story"
					onClick={() => handleStoryClick(story.id, story.user.username)}
				>
					<img
						src={story.user.profile_picture}
						alt={story.user.username}
						className="story-avatar"
					/>
					<div className="story-username">{story.user.username}</div>
				</button>
			))}
		</div>
	);
}

export default Stories;
