// YouTube API 키 (실제 사용시 본인의 API 키로 교체하세요)
const API_KEY = "AIzaSyBe1D5tkECOZ4rArKgwAciRnPoPRW9FpZc";

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  // YouTube API 로드
  loadYouTubeAPI();

  // 사이드바 아이템 클릭 이벤트 설정
  setupSidebarEvents();

  // 검색 기능 구현
  setupSearchFunctionality();

  // 초기 인기 비디오 로드
  fetchPopularVideos();
}

// YouTube API 스크립트 로드 함수
function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 사이드바 이벤트 설정
function setupSidebarEvents() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  if (!sidebarItems.length) return;

  // biome-ignore lint/complexity/noForEach: <explanation>
  sidebarItems.forEach((item) => {
    const button = item.querySelector("button");

    if (button) {
      button.addEventListener("click", () => handleSidebarItemClick(item));
      return;
    }

    item.addEventListener("click", () => handleSidebarItemClick(item));
  });
}

// 사이드바 아이템 클릭 처리
function handleSidebarItemClick(item) {
  if (!item) {
    return;
  }

  const sidebarItems = document.querySelectorAll(".sidebar-item");
  // biome-ignore lint/complexity/noForEach: <explanation>
  sidebarItems.forEach((i) => i.classList.remove("active"));
  // 클릭된 아이템에 active 클래스 추가
  item.classList.add("active");

  // span 요소를 직접 찾아서 텍스트 콘텐츠 가져오기
  // 두 번째 span이 카테고리 이름을 포함함
  const categorySpans = item.querySelectorAll("span");
  if (!categorySpans || categorySpans.length < 2) {
    return;
  }

  const category = categorySpans[1].textContent;

  // 카테고리에 따라 비디오 로드
  switch (category) {
    case "홈":
      fetchPopularVideos();
      break;
    case "인기":
      fetchTrendingVideos();
      break;
    case "음악":
      fetchMusicVideos();
      break;
    case "게임":
      fetchGamingVideos();
      break;
    default:
      fetchPopularVideos();
      break;
  }
}

// 검색 기능 설정
function setupSearchFunctionality() {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-container input");

  if (!searchButton || !searchInput) {
    return;
  }

  // 검색 버튼 클릭 이벤트
  searchButton.addEventListener("click", () => handleSearch(searchInput));

  // 엔터키 검색 지원
  searchInput.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    handleSearch(searchInput);
  });
}

// 검색 처리
function handleSearch(searchInput) {
  const query = searchInput.value.trim();
  if (!query) {
    return;
  }

  searchVideos(query);
}

// API 요청 기본 함수
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
}

// 인기 비디오 가져오기
async function fetchPopularVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&key=${API_KEY}`;
  const data = await fetchFromAPI(url);

  if (!data || !data.items) {
    displayDummyVideos();
    return;
  }

  displayVideos(data.items);
}

// 트렌딩 비디오 가져오기
async function fetchTrendingVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&videoCategoryId=1&key=${API_KEY}`;
  const data = await fetchFromAPI(url);

  if (!data || !data.items) {
    displayDummyVideos();
    return;
  }

  displayVideos(data.items);
}

// 음악 비디오 가져오기
async function fetchMusicVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&videoCategoryId=10&key=${API_KEY}`;
  const data = await fetchFromAPI(url);

  if (!data || !data.items) {
    displayDummyVideos();
    return;
  }

  displayVideos(data.items);
}

// 게임 비디오 가져오기
async function fetchGamingVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&videoCategoryId=20&key=${API_KEY}`;
  const data = await fetchFromAPI(url);

  if (!data || !data.items) {
    displayDummyVideos();
    return;
  }

  displayVideos(data.items);
}

// 검색 기능
async function searchVideos(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=${API_KEY}`;
  const data = await fetchFromAPI(url);

  if (!data || !data.items) {
    displayDummyVideos();
    return;
  }

  // 검색 결과는 다른 형식이므로 변환
  const items = data.items.map((item) => ({
    id: item.id.videoId,
    snippet: item.snippet,
    statistics: { viewCount: "N/A" }, // 검색 API는 통계를 제공하지 않음
  }));

  displayVideos(items);
}

// 비디오 표시 함수
function displayVideos(videos) {
  if (!videos || !videos.length) {
    displayDummyVideos();
    return;
  }

  const contentContainer = document.querySelector(".content");
  if (!contentContainer) {
    return;
  }

  contentContainer.innerHTML = ""; // 기존 콘텐츠 비우기

  // biome-ignore lint/complexity/noForEach: <explanation>
  videos.forEach((video) => createVideoCard(video, contentContainer));
}

// 비디오 카드 생성
function createVideoCard(video, container) {
  if (!video || !video.snippet || !container) {
    return;
  }

  // 비디오 ID가 다른 위치에 있을 수 있음
  const videoId = video.id.videoId || video.id;
  const title = video.snippet.title;
  const channelTitle = video.snippet.channelTitle;
  const channelId = video.snippet.channelId;

  // thumbnails가 없을 경우 대비
  const thumbnailUrl = video.snippet.thumbnails?.high?.url || "";
  const viewCount = video.statistics?.viewCount
    ? formatViewCount(video.statistics.viewCount)
    : "N/A";
  const publishedAt = formatPublishedDate(video.snippet.publishedAt);

  // 채널 썸네일 URL (있는 경우)
  const channelThumbnailUrl = "";

  const videoCard = document.createElement("article");
  videoCard.className = "video-card";

  // 기본 비디오 카드 구조 생성
  videoCard.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${videoId}" class="video-link" target="_blank">
            <div class="thumbnail" style="background-image: url('${thumbnailUrl}'); background-size: cover; background-position: center;" aria-label="${title} 썸네일"></div>
            <div class="video-info">
                <div class="channel-avatar" aria-hidden="true" data-channel-id="${channelId}">
                    ${channelTitle.charAt(0)}
                </div>
                <div class="video-details">
                    <h3 class="video-title">${title}</h3>
                    <p class="channel-name">${channelTitle}</p>
                    <p class="video-stats">조회수 ${viewCount} • ${publishedAt}</p>
                </div>
            </div>
        </a>
    `;

  container.appendChild(videoCard);

  // 채널 정보를 가져오는 함수 호출
  if (channelId) {
    fetchChannelThumbnail(channelId, videoCard);
  }
}

// 더미 비디오 표시 (API 호출 실패 또는 개발 중일 때 사용)
function displayDummyVideos() {
  const contentContainer = document.querySelector(".content");
  if (!contentContainer) {
    return;
  }

  contentContainer.innerHTML = ""; // 기존 콘텐츠 비우기

  const dummyData = getDummyVideoData();

  for (let i = 0; i < 8; i++) {
    const data = dummyData[i % dummyData.length];
    createDummyVideoCard(data, i, contentContainer);
  }
}

// 더미 비디오 데이터 반환
function getDummyVideoData() {
  return [
    {
      title: "HTML/CSS로 만드는 유튜브 클론 프로젝트",
      channel: "코딩채널",
      views: "1.2만회",
      date: "2일 전",
    },
    {
      title: "웹 개발자가 되는 방법, 프론트엔드 개발자 로드맵",
      channel: "웹개발학원",
      views: "8.5만회",
      date: "1주 전",
    },
    {
      title: "JavaScript 기초부터 심화까지 완벽 정리",
      channel: "자바스크립트 마스터",
      views: "20만회",
      date: "3주 전",
    },
    {
      title: "DOM 조작 마스터하기: 웹 인터랙션 구현",
      channel: "개발자 TV",
      views: "5.7만회",
      date: "2주 전",
    },
    {
      title: "반응형 웹 디자인의 모든 것, 모바일 최적화 기법",
      channel: "반응형 웹 스튜디오",
      views: "15만회",
      date: "1개월 전",
    },
    {
      title: "CSS 레이아웃 테크닉: Flexbox와 Grid 완벽 가이드",
      channel: "CSS 마법사",
      views: "9.3만회",
      date: "3주 전",
    },
    {
      title: "UI/UX 디자인 원칙: 사용자 중심 인터페이스 설계",
      channel: "UX 디자인랩",
      views: "7.8만회",
      date: "2개월 전",
    },
    {
      title: "프론트엔드 개발자 포트폴리오 만들기: 실전 팁",
      channel: "포트폴리오 전문가",
      views: "12만회",
      date: "1개월 전",
    },
  ];
}

// 더미 비디오 카드 생성
function createDummyVideoCard(data, index, container) {
  if (!data || !container) {
    return;
  }

  const videoCard = document.createElement("article");
  videoCard.className = "video-card";
  videoCard.innerHTML = `
        <a href="#" class="video-link">
            <div class="thumbnail" aria-label="${data.title} 썸네일">썸네일 ${
    index + 1
  }</div>
            <div class="video-info">
                <div class="channel-avatar" aria-hidden="true" data-channel="${
                  data.channel
                }">${data.channel.charAt(0)}</div>
                <div class="video-details">
                    <h3 class="video-title">${data.title}</h3>
                    <p class="channel-name">${data.channel}</p>
                    <p class="video-stats">조회수 ${data.views} • ${
    data.date
  }</p>
                </div>
            </div>
        </a>
    `;

  // 비디오 카드 클릭 이벤트
  const link = videoCard.querySelector(".video-link");

  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      alert("비디오 재생 페이지로 이동합니다. (API 키 없이 실행 중)");
    });
  }

  // 더미 채널 썸네일 설정
  const avatarElement = videoCard.querySelector(".channel-avatar");

  if (avatarElement) {
    setDummyChannelThumbnail(avatarElement, data.channel);
  }

  container.appendChild(videoCard);
}

// 조회수 포맷팅 함수 (1000 -> 1천, 1000000 -> 100만)
function formatViewCount(viewCount) {
  if (!viewCount) return "0회";

  const count = Number.parseInt(viewCount);

  if (count >= 10000000) {
    return `${Math.floor(count / 10000000)}천만회`;
  }

  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}백만회`;
  }

  if (count >= 10000) {
    return `${Math.floor(count / 10000)}만회`;
  }

  if (count >= 1000) {
    return `${Math.floor(count / 1000)}천회`;
  }

  return `${count}회`;
}

// 날짜 포맷팅 함수 (현재 기준으로 상대적인 시간)
function formatPublishedDate(publishedAt) {
  if (!publishedAt) return "알 수 없음";

  const published = new Date(publishedAt);
  const now = new Date();
  const diffMs = now - published;

  if (Number.isNaN(diffMs)) {
    return "알 수 없음";
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) {
    return `${diffYear}년 전`;
  }

  if (diffMonth > 0) {
    return `${diffMonth}개월 전`;
  }

  if (diffDay > 0) {
    return `${diffDay}일 전`;
  }

  if (diffHour > 0) {
    return `${diffHour}시간 전`;
  }

  if (diffMin > 0) {
    return `${diffMin}분 전`;
  }

  return "방금 전";
}

// 채널 썸네일 가져오기
async function fetchChannelThumbnail(channelId, videoCardElement) {
  if (!channelId || !videoCardElement) return;

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data?.items && data.items.length > 0) {
      const channelThumbnailUrl =
        data.items[0].snippet?.thumbnails?.default?.url;

      if (channelThumbnailUrl) {
        // 채널 아바타 요소 찾기
        const avatarElement = videoCardElement.querySelector(
          `.channel-avatar[data-channel-id="${channelId}"]`
        );
        if (avatarElement) {
          // 배경 이미지로 썸네일 설정
          avatarElement.style.backgroundImage = `url('${channelThumbnailUrl}')`;
          avatarElement.style.backgroundSize = "cover";
          avatarElement.style.backgroundPosition = "center";
          avatarElement.textContent = ""; // 텍스트 지우기
        }
      }
    }
  } catch (error) {
    console.error("채널 썸네일 가져오기 오류:", error);
    // 오류 발생 시 기본 아바타 유지
  }
}

// 더미 비디오에 대한 채널 썸네일 처리 (기본 더미 이미지 URL 사용)
function setDummyChannelThumbnail(element, channelName) {
  if (!element) return;

  // 랜덤 색상 생성 (채널 이름 기반)
  const getColorCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return `#${"00000".substring(0, 6 - c.length)}${c}`;
  };

  const colorCode = getColorCode(channelName);

  // 배경색 설정
  element.style.backgroundColor = colorCode;
  element.textContent = channelName.charAt(0).toUpperCase();
}
