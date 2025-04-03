import React, { useEffect, useState } from "react";
import instagramAPI from "../api/instagram-api";
import "./Stories.css";

function Stories() {
	const [stories, setStories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadStories = async () => {
			try {
				setIsLoading(true);
				const storiesData = await instagramAPI.getStories();
				setStories(storiesData);
			} catch (err) {
				console.error("스토리 로드 오류:", err);
				setError("스토리를 불러오는데 실패했습니다");
			} finally {
				setIsLoading(false);
			}
		};

		loadStories();
	}, []);

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

	if (error) {
		return <div className="stories-error">{error}</div>;
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
