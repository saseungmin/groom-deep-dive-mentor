import React, { useState } from "react";
import "./index.css";

function Post({ post, onToggleLike, onAddComment }) {
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");

	// 시간 형식 변환
	const getTimeAgo = (timestamp) => {
		const now = new Date();
		const postDate = new Date(timestamp * 1000);
		const diffSeconds = Math.floor((now - postDate) / 1000);

		if (diffSeconds < 60) {
			return "방금 전";
		}
		if (diffSeconds < 3600) {
			const minutes = Math.floor(diffSeconds / 60);
			return `${minutes}분 전`;
		}
		if (diffSeconds < 86400) {
			const hours = Math.floor(diffSeconds / 3600);
			return `${hours}시간 전`;
		}

		const days = Math.floor(diffSeconds / 86400);
		return `${days}일 전`;
	};

	const handleLikeClick = () => {
		setIsLiked(!isLiked);
		onToggleLike(post.id, !isLiked);
	};

	const handleBookmarkClick = () => {
		setIsBookmarked(!isBookmarked);
	};

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (commentText.trim()) {
			onAddComment(post.id, commentText);
			setCommentText("");
			setShowComments(true);
		}
	};

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	return (
		<div className="post">
			<div className="post-header">
				<div className="post-user">
					<img
						src={post.user.profile_picture}
						alt={post.user.username}
						className="post-user-avatar"
					/>
					<div className="post-user-username">{post.user.username}</div>
				</div>
				<div className="post-more">⋯</div>
			</div>

			<img
				src={post.images.standard_resolution.url}
				alt="포스트 이미지"
				className="post-image"
			/>

			<div className="post-actions">
				<div className="post-action-icons">
					<button
						type="button"
						className={`post-action-icon ${isLiked ? "liked" : ""}`}
						onClick={handleLikeClick}
					>
						{isLiked ? "❤️" : "🖤"}
					</button>
					<div className="post-action-icon">💬</div>
					<div className="post-action-icon">✈️</div>
				</div>
				<button
					type="button"
					className={`post-action-icon ${isBookmarked ? "bookmarked" : ""}`}
					onClick={handleBookmarkClick}
				>
					{isBookmarked ? "🔖" : "🎉"}
				</button>
			</div>

			<div className="post-likes">좋아요 {post.likes.count}개</div>

			<div className="post-caption">
				<span className="post-caption-username">{post.user.username}</span>{" "}
				{post.caption.text}
			</div>

			<button
				type="button"
				className="post-comments-toggle"
				onClick={toggleComments}
			>
				{showComments
					? "댓글 숨기기"
					: `댓글 ${post.comments.count}개 모두 보기`}
			</button>

			<div className="post-time">{getTimeAgo(post.created_time)}</div>

			{showComments && (
				<div className="comments-container">
					{post.comments.data.map((comment) => (
						<div key={comment.id} className="comment">
							<span className="comment-username">{comment.user.username}</span>
							<span className="comment-text">{comment.text}</span>
						</div>
					))}
				</div>
			)}

			<form className="post-add-comment" onSubmit={handleCommentSubmit}>
				<input
					type="text"
					placeholder="댓글 달기..."
					className="comment-input"
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
				<button
					type="submit"
					className="comment-button"
					disabled={!commentText.trim()}
				>
					게시
				</button>
			</form>
		</div>
	);
}

export default Post;
