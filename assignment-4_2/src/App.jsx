import React, { useEffect, useState } from "react";
import "./App.css";
import instagramAPI from "./apis/instagram-api";
import Feed from "./components/Feed";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Stories from "./components/stories";

function App() {
	const [isLoading, setIsLoading] = useState({
		feed: true,
		stories: true,
		profile: true,
		suggestions: true,
	});
	const [feedData, setFeedData] = useState([]);
	const [storiesData, setStoriesData] = useState([]);
	const [profileData, setProfileData] = useState(null);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		// 데이터 로드 함수
		const loadData = async () => {
			try {
				// 피드 데이터 로드
				const feed = await instagramAPI.getFeed();
				setFeedData(feed);
				setIsLoading((prev) => ({ ...prev, feed: false }));

				// 스토리 데이터 로드
				const stories = await instagramAPI.getStories();
				setStoriesData(stories);
				setIsLoading((prev) => ({ ...prev, stories: false }));

				// 프로필 데이터 로드
				const profile = await instagramAPI.getUserProfile("myusername");
				setProfileData(profile);
				setIsLoading((prev) => ({ ...prev, profile: false }));

				// 추천 사용자 로드
				const suggestions = await instagramAPI.getSuggestedUsers();
				setSuggestedUsers(suggestions);
				setIsLoading((prev) => ({ ...prev, suggestions: false }));
			} catch (err) {
				console.error("데이터 로딩 오류:", err);
				setError(
					"데이터를 불러오는 중 오류가 발생했습니다. 새로고침을 시도해주세요.",
				);
			}
		};

		loadData();
	}, []);

	// 좋아요 토글 처리 함수
	const handleToggleLike = async (postId, isLiked) => {
		try {
			const response = await instagramAPI.toggleLike(postId, isLiked);
			if (response.success) {
				// 피드 데이터 업데이트
				setFeedData((prevFeed) =>
					prevFeed.map((post) =>
						post.id === postId
							? { ...post, likes: { ...post.likes, count: response.likes } }
							: post,
					),
				);
			}
		} catch (err) {
			console.error("좋아요 처리 오류:", err);
		}
	};

	// 댓글 추가 처리 함수
	const handleAddComment = async (postId, commentText) => {
		try {
			const response = await instagramAPI.addComment(postId, commentText);
			if (response.success) {
				// 피드 데이터 업데이트
				setFeedData((prevFeed) =>
					prevFeed.map((post) => {
						if (post.id === postId) {
							return {
								...post,
								comments: {
									count: response.comments_count,
									data: [...post.comments.data, response.comment],
								},
							};
						}
						return post;
					}),
				);
			}
		} catch (err) {
			console.error("댓글 추가 오류:", err);
		}
	};

	// 팔로우 토글 처리 함수
	const handleToggleFollow = async (username, isFollowing) => {
		try {
			const response = await instagramAPI.toggleFollow(username, isFollowing);
			if (response.success) {
				// 추천 사용자 목록 업데이트
				setSuggestedUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.username === username
							? { ...user, isFollowing: isFollowing }
							: user,
					),
				);
			}
		} catch (err) {
			console.error("팔로우 처리 오류:", err);
		}
	};

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="instagram-app">
			<Header />
			<main className="main-container">
				<div className="content">
					<Stories stories={storiesData} isLoading={isLoading.stories} />
					<Feed
						posts={feedData}
						isLoading={isLoading.feed}
						onToggleLike={handleToggleLike}
						onAddComment={handleAddComment}
					/>
				</div>
				<Sidebar
					profile={profileData}
					suggestions={suggestedUsers}
					isLoading={{
						profile: isLoading.profile,
						suggestions: isLoading.suggestions,
					}}
					onToggleFollow={handleToggleFollow}
				/>
			</main>
		</div>
	);
}

export default App;
