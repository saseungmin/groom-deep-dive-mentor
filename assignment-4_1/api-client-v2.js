const API_BASE_URL = "http://localhost:3000";

class InstagramAPIClient {
  // 기본 API 요청 메서드 - 모든 API 호출의 공통 로직 처리
  async _apiRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorMessage = `API 요청 실패: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API 오류 (${endpoint}):`, error);
      throw error;
    }
  }

  // GET 요청 헬퍼 메서드
  async _get(endpoint) {
    return this._apiRequest(endpoint);
  }

  // POST 요청 헬퍼 메서드
  async _post(endpoint, data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this._apiRequest(endpoint, options);
  }

  // 현재 사용자 ID (실제 구현에서는 인증 시스템에서 가져옴)
  getCurrentUserId() {
    return 1; // 고정된 값 대신 실제 로그인 사용자 ID를 반환해야 함
  }

  // 피드 데이터 가져오기
  async getFeed() {
    return this._get("/api/feed");
  }

  // 스토리 데이터 가져오기
  async getStories() {
    return this._get("/api/stories");
  }

  // 사용자 프로필 가져오기
  async getUserProfile(username) {
    return this._get(`/api/users/${username}`);
  }

  // 추천 사용자 가져오기
  async getSuggestedUsers() {
    return this._get("/api/suggested_users");
  }

  // 좋아요 추가/제거 토글
  async toggleLike(postId, isLiked) {
    return this._post("/api/toggle_like", {
      post_id: postId,
      user_id: this.getCurrentUserId(),
      is_liked: isLiked,
    });
  }

  // 댓글 추가
  async addComment(postId, commentText) {
    return this._post("/api/add_comment", {
      post_id: postId,
      user_id: this.getCurrentUserId(),
      text: commentText,
    });
  }

  // 팔로우/언팔로우 토글
  async toggleFollow(username, isFollowing) {
    return this._post("/api/toggle_follow", {
      follower_id: this.getCurrentUserId(),
      following_username: username,
      is_following: isFollowing,
    });
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
const instagramAPI = new InstagramAPIClient();

export default instagramAPI;
