import React from "react";
import Post from "../post";
import "./index.css";

function Feed({ posts, isLoading, onToggleLike, onAddComment }) {
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

	return (
		<div className="feed">
			{posts.map((post) => (
				<Post
					key={post.id}
					post={post}
					onToggleLike={onToggleLike}
					onAddComment={onAddComment}
				/>
			))}
		</div>
	);
}

export default Feed;
