import React, { useState } from "react";
import "./index.css";

function Post({ post: initialPost }) {
	const [post, setPost] = useState(initialPost);
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const handleBookmarkClick = () => {
		setIsBookmarked(!isBookmarked);
	};

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	const handleLikeClick = async () => {
		const previousIsLiked = isLiked;
		const previousLikesCount = post.likes.count;

		// 낙관적 UI 업데이트
		setIsLiked(!isLiked);
		setPost((prev) => ({
			...prev,
			likes: {
				count: isLiked ? prev.likes.count - 1 : prev.likes.count + 1,
			},
		}));

		try {
			const response = await instagramAPI.toggleLike(post.id, !previousIsLiked);
			if (!response.success) {
				// 실패 시 UI 복원
				setIsLiked(previousIsLiked);
				setPost((prev) => ({
					...prev,
					likes: { count: previousLikesCount },
				}));
			}
		} catch (error) {
			console.error("좋아요 처리 오류:", error);
			// 오류 시 UI 복원
			setIsLiked(previousIsLiked);
			setPost((prev) => ({
				...prev,
				likes: { count: previousLikesCount },
			}));
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!commentText.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const response = await instagramAPI.addComment(post.id, commentText);
			if (response.success) {
				// 댓글 추가 성공
				setPost((prev) => ({
					...prev,
					comments: {
						count: response.comments_count,
						data: [...prev.comments.data, response.comment],
					},
				}));
				setCommentText("");
				setShowComments(true);
			}
		} catch (error) {
			console.error("댓글 추가 오류:", error);
		} finally {
			setIsSubmitting(false);
		}
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
