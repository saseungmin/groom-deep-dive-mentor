# 인스타그램 목업 JSON Server 설정 가이드

이 가이드는 인스타그램 목업을 위한 JSON Server 기반 가짜 API를 설정하는 방법을 설명합니다.

## 1. 필요한 파일

다음 파일들이 필요합니다:
- `db.json` - API 데이터베이스 역할을 하는 JSON 파일
- `server.js` - JSON Server 설정 및 커스텀 라우트 정의
- `package.json` - 프로젝트 의존성 정의
- `api-client.js` - 프론트엔드에서 API 호출을 위한 클라이언트

## 2. 설치 및 실행

### 설치

1. Node.js가 설치되어 있는지 확인합니다. (https://nodejs.org/에서 다운로드)
2. 프로젝트 폴더에 위 파일들을 저장합니다.
3. 터미널/명령 프롬프트를 열고 프로젝트 폴더로 이동합니다.
4. 다음 명령을 실행하여 필요한 패키지를 설치합니다:

```bash
npm install

or 

yarn install
```

### 실행

다음 명령으로 JSON Server를 실행합니다:

```bash
npm start

or

yarn start
```

서버가 실행되면 다음 메시지가 표시됩니다:
```
JSON Server가 http://localhost:3000에서 실행 중입니다
사용 가능한 엔드포인트:
  GET    /api/feed
  GET    /api/stories
  GET    /api/users/:username
  GET    /api/suggested_users
  POST   /api/toggle_like
  POST   /api/add_comment
  POST   /api/toggle_follow
```

## 3. API 엔드포인트

### 커스텀 엔드포인트 (인스타그램 형식)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/feed` | 피드 게시물 목록 |
| GET | `/api/stories` | 스토리 목록 |
| GET | `/api/users/:username` | 특정 사용자 프로필 |
| GET | `/api/suggested_users` | 추천 사용자 목록 |
| POST | `/api/toggle_like` | 좋아요 토글 |
| POST | `/api/add_comment` | 댓글 추가 |
| POST | `/api/toggle_follow` | 팔로우 상태 토글 |

### 기본 JSON Server 엔드포인트

기본 REST 엔드포인트도 사용 가능합니다:

- `GET /users` - 모든 사용자 목록
- `GET /users/:id` - 특정 ID의 사용자
- `GET /posts` - 모든 게시물 목록
- `GET /comments` - 모든 댓글 목록
- 그 외 표준 REST 작업 (POST, PUT, DELETE 등)

## 4. 프론트엔드 연동

제공된 `api-client.js` 파일을 사용하여 프론트엔드에서 API를 호출할 수 있습니다. 다음과 같이 사용합니다:

1. HTML 파일에 모듈 타입의 스크립트 태그 추가:

```html
<script type="module" src="your-script.js"></script>
```

2. 프론트엔드 자바스크립트 파일에서 API 클라이언트 가져오기:

```javascript
import instagramAPI from './api-client.js';

// API 호출 예시
async function loadFeed() {
  try {
    const feed = await instagramAPI.getFeed();
    console.log('피드 데이터:', feed);
    // 여기서 피드 데이터로 UI 업데이트
  } catch (error) {
    console.error('피드 로딩 오류:', error);
  }
}

loadFeed();
```

## 5. API 요청 예시

### 피드 가져오기
```javascript
const feed = await instagramAPI.getFeed();
```

### 스토리 가져오기
```javascript
const stories = await instagramAPI.getStories();
```

### 좋아요 토글
```javascript
// 좋아요 추가
const addLikeResponse = await instagramAPI.toggleLike(1, true);

// 좋아요 취소
const removeLikeResponse = await instagramAPI.toggleLike(1, false);
```

### 댓글 추가
```javascript
const commentResponse = await instagramAPI.addComment(1, '멋진 사진이네요!');
```

### 팔로우 토글
```javascript
// 팔로우
const followResponse = await instagramAPI.toggleFollow('travelgram', true);

// 언팔로우
const unfollowResponse = await instagramAPI.toggleFollow('travelgram', false);
```

## 6. 데이터 커스터마이징

`db.json` 파일을 직접 수정하여 API에서 제공하는 데이터를 변경할 수 있습니다. 파일을 수정한 후 서버를 재시작하면 변경사항이 적용됩니다.

## 7. 고급 사용법

### 데이터 필터링
JSON Server는 쿼리 파라미터를 통한 필터링을 지원합니다:

```
GET /posts?user_id=2
GET /comments?post_id=1
```

### 페이지네이션
결과를 페이지로 나누어 가져올 수 있습니다:

```
GET /posts?_page=1&_limit=10
```

### 정렬
결과를 정렬해서 가져올 수 있습니다:

```
GET /posts?_sort=created_time&_order=desc
```

## 8. 문제 해결

### 서버가 시작되지 않는 경우
- 포트 3000이 이미 사용 중인지 확인하세요.
- `server.js`의 PORT 변수를 수정하여 다른 포트를 사용할 수 있습니다.
- package.json과 파일위치를 잘 확인해주세요.

## 9. 보안 고려사항

실제 서비스에서는 다음을 고려해야 합니다:
- 사용자 인증 및 권한 부여 구현
- 입력 유효성 검사
- HTTPS 사용
- 보안 헤더 추가
