// API 클라이언트 - JSON Server에 연결
const API_BASE_URL = "http://localhost:3000";

class InstagramAPIClient {
  // 피드 데이터 가져오기
  async getFeed() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/feed`);

      if (!response.ok) {
        throw new Error("피드 데이터를 가져오는 데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("getFeed 에러:", error);
      throw error;
    }
  }

  // 스토리 데이터 가져오기
  async getStories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stories`);

      if (!response.ok) {
        throw new Error("스토리 데이터를 가져오는 데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("getStories 에러:", error);
      throw error;
    }
  }

  // 사용자 프로필 가져오기
  async getUserProfile(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}`);

      if (!response.ok) {
        throw new Error("사용자 프로필을 가져오는 데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("getUserProfile 에러:", error);
      throw error;
    }
  }

  // 추천 사용자 가져오기
  async getSuggestedUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/suggested_users`);

      if (!response.ok) {
        throw new Error("추천 사용자를 가져오는 데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("getSuggestedUsers 에러:", error);
      throw error;
    }
  }

  // 좋아요 추가/제거 토글
  async toggleLike(postId, isLiked) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/toggle_like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: 1, // 현재 로그인한 사용자 ID (실제 구현에서는 세션에서 가져와야 함)
          is_liked: isLiked,
        }),
      });

      if (!response.ok) {
        throw new Error("좋아요 상태 변경에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("toggleLike 에러:", error);
      throw error;
    }
  }

  // 댓글 추가
  async addComment(postId, commentText) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/add_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: 1, // 현재 로그인한 사용자 ID (실제 구현에서는 세션에서 가져와야 함)
          text: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error("댓글 추가에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("addComment 에러:", error);
      throw error;
    }
  }

  // 팔로우/언팔로우 토글
  async toggleFollow(username, isFollowing) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/toggle_follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          follower_id: 1, // 현재 로그인한 사용자 ID (실제 구현에서는 세션에서 가져와야 함)
          following_username: username,
          is_following: isFollowing,
        }),
      });

      if (!response.ok) {
        throw new Error("팔로우 상태 변경에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("toggleFollow 에러:", error);
      throw error;
    }
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
const instagramAPI = new InstagramAPIClient();

export default instagramAPI;
