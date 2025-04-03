// 인스타그램 JSON Server API를 사용하는 통합 파일
// JSON Server API 클라이언트 가져오기
import instagramAPI from "./api-client.js";

// DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 로딩 상태 표시 (실제 구현에서 로딩 인디케이터 추가)
    console.log("데이터를 불러오는 중...");

    // API를 통해 데이터 가져오기
    await loadUserProfile();
    await loadSuggestedUsers();
    await loadStories();
    await loadFeed();

    // 이벤트 리스너 등록
    setupEventListeners();

    console.log("모든 데이터 로드 완료!");
  } catch (error) {
    console.error("데이터 로드 중 오류 발생:", error);
  }
});

// 사용자 프로필 로드
async function loadUserProfile() {
  try {
    const userProfile = await instagramAPI.getUserProfile("myusername");

    // 프로필 정보 업데이트
    const profileUsername = document.querySelector(".profile-username");
    const profileName = document.querySelector(".profile-name");
    const profileAvatar = document.querySelector(".user-avatar");

    if (profileUsername) {
      profileUsername.textContent = userProfile.username;
    }

    if (profileName) {
      profileName.textContent = userProfile.full_name;
    }

    if (profileAvatar) {
      profileAvatar.src = userProfile.profile_picture;
    }

    console.log("프로필 로드 완료");
  } catch (error) {
    console.error("프로필 로드 중 오류 발생:", error);
  }
}

// 추천 사용자 로드
async function loadSuggestedUsers() {
  try {
    const suggestedUsers = await instagramAPI.getSuggestedUsers();
    const suggestionsContainer = document.querySelector(".sidebar");

    // 추천 사용자 컨테이너가 없으면 종료
    if (!suggestionsContainer) {
      return;
    }

    // 기존 추천 사용자 요소 제거 (새로운 데이터로 교체)
    const existingSuggestions =
      suggestionsContainer.querySelectorAll(".suggestion");

    existingSuggestions.forEach((suggestion) => {
      suggestion.remove();
    });

    const footer = suggestionsContainer.querySelector(".footer");

    // 각 추천 사용자 추가
    suggestedUsers.forEach((user) => {
      const suggestionElement = document.createElement("div");
      suggestionElement.className = "suggestion";
      suggestionElement.innerHTML = `
                <img src="${user.profile_picture}" alt="${user.username}" class="suggestion-avatar">
                <div class="suggestion-info">
                    <div class="suggestion-username">${user.username}</div>
                    <div class="suggestion-text">${user.reason}</div>
                </div>
                <div class="follow-button">팔로우</div>
            `;

      suggestionsContainer.insertBefore(suggestionElement, footer);
    });

    // 팔로우 버튼 이벤트 리스너 다시 추가
    setupFollowButtons();

    console.log("추천 사용자 로드 완료");
  } catch (error) {
    console.error("추천 사용자 로드 중 오류 발생:", error);
  }
}

// 스토리 로드
async function loadStories() {
  try {
    const stories = await instagramAPI.getStories();
    const storiesContainer = document.querySelector(".stories");

    // 스토리 컨테이너가 없으면 종료
    if (!storiesContainer) {
      return;
    }

    // 기존 스토리 제거
    storiesContainer.innerHTML = "";

    // 스토리 추가
    stories.forEach((story) => {
      const storyElement = document.createElement("div");
      storyElement.className = "story";
      storyElement.setAttribute("data-story-id", story.id);
      storyElement.innerHTML = `
                <img src="${story.user.profile_picture}" alt="${story.user.username}" class="story-avatar">
                <div class="story-username">${story.user.username}</div>
            `;

      storiesContainer.appendChild(storyElement);
    });

    // 스토리 클릭 이벤트 리스너 다시 추가
    setupStoryListeners();

    console.log("스토리 로드 완료");
  } catch (error) {
    console.error("스토리 로드 중 오류 발생:", error);
  }
}

// 피드 로드
async function loadFeed() {
  try {
    const feed = await instagramAPI.getFeed();
    const contentContainer = document.querySelector(".content");

    // 스토리 섹션 찾기
    const storiesSection = contentContainer.querySelector(".stories");

    // 기존 포스트 제거
    const existingPosts = contentContainer.querySelectorAll(".post");
    existingPosts.forEach((post) => post.remove());

    // 각 포스트 추가
    feed.forEach((post) => {
      // 시간 형식 변환
      const postDate = new Date(Number.parseInt(post.created_time) * 1000);
      const timeAgo = getTimeAgo(postDate);

      // 포스트 요소 생성
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.setAttribute("data-post-id", post.id);

      // 포스트 HTML 생성
      postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-user">
                        <img src="${post.user.profile_picture}" alt="${
        post.user.username
      }" class="post-user-avatar">
                        <div class="post-user-username">${
                          post.user.username
                        }</div>
                    </div>
                    <div class="post-more">⋯</div>
                </div>
                <img src="${
                  post.images.standard_resolution.url
                }" alt="포스트 이미지" class="post-image">
                <div class="post-actions">
                    <div class="post-action-icons">
                        <div class="post-action-icon post-like-button">❤️</div>
                        <div class="post-action-icon">💬</div>
                        <div class="post-action-icon">✈️</div>
                    </div>
                    <div class="post-action-icon post-bookmark-button">🔖</div>
                </div>
                <div class="post-likes">좋아요 ${post.likes.count}개</div>
                <div class="post-caption">
                    <span class="post-caption-username">${
                      post.user.username
                    }</span> ${post.caption.text}
                </div>
                <div class="post-comments">댓글 ${
                  post.comments.count
                }개 모두 보기</div>
                <div class="post-time">${timeAgo}</div>
                
                <!-- 댓글 목록 (기본적으로 숨겨짐) -->
                <div class="comments-container" style="display: none;">
                    ${post.comments.data
                      .map(
                        (comment) => `
                        <div class="comment">
                            <span class="comment-username">${comment.user.username}</span>
                            <span class="comment-text">${comment.text}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                
                <div class="post-add-comment">
                    <input type="text" placeholder="댓글 달기..." class="comment-input">
                    <div class="comment-button">게시</div>
                </div>
            `;

      // 스토리 섹션 다음에 포스트 추가
      if (storiesSection?.nextSibling) {
        contentContainer.insertBefore(postElement, storiesSection.nextSibling);
      } else {
        contentContainer.appendChild(postElement);
      }
    });

    console.log("피드 로드 완료");
  } catch (error) {
    console.error("피드 로드 중 오류 발생:", error);
  }
}

// 시간 형식 변환 (n분 전, n시간 전 등)
function getTimeAgo(date) {
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

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
}

// 모든 이벤트 리스너 설정
function setupEventListeners() {
  setupLikeButtons();
  setupCommentButtons();
  setupBookmarkButtons();
  setupCommentViewToggles();
  setupFollowButtons();
  setupStoryListeners();
}

// 좋아요 버튼 이벤트 리스너
function setupLikeButtons() {
  const likeButtons = document.querySelectorAll(".post-like-button");

  likeButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const postElement = this.closest(".post");
      const postId = postElement.getAttribute("data-post-id");
      const isLiked = this.classList.contains("liked");

      // UI 즉시 업데이트 (UX 향상)
      if (isLiked) {
        this.classList.remove("liked");
        this.style.color = "";
      } else {
        this.classList.add("liked");
        this.style.color = "#ed4956";
      }

      try {
        // API 호출로 좋아요 상태 업데이트
        const response = await instagramAPI.toggleLike(postId, !isLiked);

        if (response.success) {
          // 좋아요 카운트 업데이트
          const likesElement = postElement.querySelector(".post-likes");
          likesElement.textContent = `좋아요 ${response.likes}개`;

          return;
        }

        console.error("좋아요 업데이트 실패:", response.error);
      } catch (error) {
        console.error("좋아요 처리 중 오류 발생:", error);
        // 오류 발생 시 UI 원상복구
        if (isLiked) {
          this.classList.add("liked");
          this.style.color = "#ed4956";

          return;
        }
        this.classList.remove("liked");
        this.style.color = "";
      }
    });
  });
}

// 댓글 버튼 이벤트 리스너
function setupCommentButtons() {
  const commentButtons = document.querySelectorAll(".comment-button");

  commentButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const postElement = this.closest(".post");
      const postId = postElement.getAttribute("data-post-id");
      const commentInput = postElement.querySelector(".comment-input");
      const commentText = commentInput.value.trim();

      if (!commentText) {
        return;
      }

      try {
        // API 호출로 댓글 추가
        const response = await instagramAPI.addComment(postId, commentText);

        if (response.success) {
          // 입력 필드 초기화
          commentInput.value = "";

          // 댓글 컨테이너 가져오기
          const commentsContainer = postElement.querySelector(
            ".comments-container"
          );

          // 새 댓글 요소 생성
          const newComment = document.createElement("div");
          newComment.className = "comment";
          newComment.innerHTML = `
                        <span class="comment-username">${response.comment.user.username}</span>
                        <span class="comment-text">${response.comment.text}</span>
                    `;

          // 댓글 컨테이너에 새 댓글 추가
          commentsContainer.appendChild(newComment);

          // 댓글 카운트 업데이트
          const commentsElement = postElement.querySelector(".post-comments");

          // 댓글 컨테이너가 표시 중인지 확인
          if (commentsElement.textContent.includes("모두 보기")) {
            commentsElement.textContent = `댓글 ${response.comments_count}개 모두 보기`;
            commentsElement.setAttribute(
              "data-original-text",
              commentsElement.textContent
            );
          }

          // 댓글 컨테이너가 숨겨져 있으면 표시
          if (commentsContainer.style.display === "none") {
            commentsContainer.style.display = "block";
            commentsElement.textContent = "댓글 숨기기";
          }

          return;
        }

        console.error("댓글 추가 실패:", response.error);
      } catch (error) {
        console.error("댓글 추가 중 오류 발생:", error);
      }
    });
  });

  // Enter 키로 댓글 제출
  const commentInputs = document.querySelectorAll(".comment-input");

  commentInputs.forEach((input) => {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const postElement = this.closest(".post");
        const commentButton = postElement.querySelector(".comment-button");
        commentButton.click();
      }
    });
  });
}

// 북마크 버튼 이벤트 리스너
function setupBookmarkButtons() {
  const bookmarkButtons = document.querySelectorAll(".post-bookmark-button");

  bookmarkButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // 북마크 상태 토글 (API 호출 없이 간단하게 구현)
      if (this.classList.contains("bookmarked")) {
        this.classList.remove("bookmarked");
        this.style.fontWeight = "normal";
        return;
      }

      this.classList.add("bookmarked");
      this.style.fontWeight = "bold";
    });
  });
}

// 댓글 보기/숨기기 토글
function setupCommentViewToggles() {
  const commentLinks = document.querySelectorAll(".post-comments");

  commentLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const postElement = this.closest(".post");
      const commentsContainer = postElement.querySelector(
        ".comments-container"
      );

      // 댓글 컨테이너 표시 상태 토글
      if (
        commentsContainer.style.display === "none" ||
        commentsContainer.style.display === ""
      ) {
        commentsContainer.style.display = "block";
        // 텍스트 변경 - "댓글 숨기기"로 변경
        this.textContent = "댓글 숨기기";
        return;
      }

      commentsContainer.style.display = "none";
      // 텍스트 복원 - "댓글 n개 모두 보기"로 변경
      const originalText = this.getAttribute("data-original-text");

      if (originalText) {
        this.textContent = originalText;
      } else {
        // 원본 텍스트가 저장되어 있지 않으면 댓글 수를 가져와서 재구성
        const commentsContainer = postElement.querySelector(
          ".comments-container"
        );
        const commentCount =
          commentsContainer.querySelectorAll(".comment").length;
        this.textContent = `댓글 ${commentCount}개 모두 보기`;
      }
    });

    // 원본 텍스트 저장 (처음 로드될 때)
    link.setAttribute("data-original-text", link.textContent);
  });
}

// 팔로우 버튼 이벤트 리스너
function setupFollowButtons() {
  const followButtons = document.querySelectorAll(".follow-button");

  followButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const suggestionElement = this.closest(".suggestion");
      const username = suggestionElement.querySelector(
        ".suggestion-username"
      ).textContent;
      const isFollowing = this.textContent === "팔로잉";

      // UI 즉시 업데이트
      if (isFollowing) {
        this.textContent = "팔로우";
        this.style.color = "#0095f6";
      } else {
        this.textContent = "팔로잉";
        this.style.color = "#262626";
      }

      try {
        // API 호출
        await instagramAPI.toggleFollow(username, !isFollowing);

        // 성공 메시지 (실제 구현에서는 토스트 메시지 등으로 구현)
        console.log(
          `${username}님을 ${isFollowing ? "팔로우 취소" : "팔로우"}했습니다.`
        );
      } catch (error) {
        console.error("팔로우 처리 중 오류 발생:", error);

        // 오류 발생 시 UI 원상복구
        if (isFollowing) {
          this.textContent = "팔로잉";
          this.style.color = "#262626";

          return;
        }
        this.textContent = "팔로우";
        this.style.color = "#0095f6";
      }
    });
  });
}

// 스토리 이벤트 리스너
function setupStoryListeners() {
  const stories = document.querySelectorAll(".story");

  stories.forEach((story) => {
    story.addEventListener("click", function () {
      const storyId = this.getAttribute("data-story-id");
      const username = this.querySelector(".story-username").textContent;

      // 스토리 뷰어 열기 (간단한 알림으로 대체)
      alert(`${username}님의 스토리를 봅니다. ID: ${storyId}`);

      // 실제 구현에서는 모달이나 전체화면 뷰어로 스토리 표시
      console.log(
        `스토리 ID(${storyId})로 API에서 데이터를 가져와 표시합니다.`
      );
    });
  });
}

// 앱 초기화 실행
console.log("인스타그램 JSON Server API 통합 초기화 중...");
