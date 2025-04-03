import React, { useEffect, useState } from "react";
import instagramAPI from "../api/instagram-api";
import "./Feed.css";
import Post from "./Post";

function Feed() {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadFeed = async () => {
			try {
				setIsLoading(true);
				const feedData = await instagramAPI.getFeed();
				setPosts(feedData);
			} catch (err) {
				console.error("피드 로드 오류:", err);
				setError("피드를 불러오는데 실패했습니다");
			} finally {
				setIsLoading(false);
			}
		};

		loadFeed();
	}, []);

	if (isLoading) {
		return (
			<div className="feed">
				{[1, 2].map((i) => (
					<div key={i} className="post loading">
						<div className="loading-header" />
						<div className="loading-image" />
						<div className="loading-content" />
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return <div className="feed-error">{error}</div>;
	}

	return (
		<div className="feed">
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</div>
	);
}

export default Feed;
