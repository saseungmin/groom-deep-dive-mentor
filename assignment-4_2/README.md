# React 인스타그램 목업 설정 가이드

## 파일 구조

```
assignment-4_2/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── index.js
│   ├── App.js
│   ├── App.css
│   ├── api/
│   │   └── instagram-api.js
│   └── components/
│       ├── Header/
│       ├── Stories/
│       ├── Feed/
│       ├── Post/
│       ├── Sidebar/
│       ├── UserProfile/
│       ├── Suggestions/
│       ├── Footer/
│       └── [각 컴포넌트 CSS 파일들]
└── public/
```

## 설치 및 실행

### 요구 사항
- 실행 중인 JSON Server API (포트 3000)

### 설치

1. 프로젝트 디렉토리로 이동합니다:
```bash
cd assignment-4_2
```

2. 의존성을 설치합니다:
```bash
npm install

or

yarn install
```

### 실행

1. React 애플리케이션 실행:
```bash
npm start

or

yarn start
```

이 명령은 Vite 개발 서버를 시작하고 브라우저에서 `http://localhost:3001`을 자동으로 엽니다.

2. JSON Server API가 `http://localhost:3000`에서 실행 중인지 확인합니다:
```bash
npm server

or

yarn server
```

## 컴포넌트 구조

- **App**: 최상위 컴포넌트, 전체 애플리케이션 상태 관리
- **Header**: 상단 네비게이션 바
- **Stories**: 스토리 섹션
- **Feed**: 포스트 목록 컨테이너
- **Post**: 개별 포스트 컴포넌트
- **Sidebar**: 우측 사이드바 컨테이너
- **UserProfile**: 사용자 프로필 섹션
- **Suggestions**: 추천 사용자 섹션
- **Footer**: 하단 링크 및 저작권 정보

## API 통합

`src/api/instagram-api.js` 파일은 DRY 원칙을 적용하여 JSON Server API와 통신하는 클라이언트를 구현하고 있습니다. 각 API 엔드포인트에 대한 메서드를 제공합니다:

- `getFeed()`: 피드 데이터 가져오기
- `getStories()`: 스토리 데이터 가져오기 
- `getUserProfile(username)`: 사용자 프로필 정보 가져오기
- `getSuggestedUsers()`: 추천 사용자 가져오기
- `toggleLike(postId, isLiked)`: 좋아요 토글
- `addComment(postId, commentText)`: 댓글 추가
- `toggleFollow(username, isFollowing)`: 팔로우 토글

## 커스터마이징

- **색상 및 테마**: CSS 파일을 수정하여 테마를 변경할 수 있습니다.
- **레이아웃**: 컴포넌트 구조를 수정하여 레이아웃을 변경할 수 있습니다.
- **기능 추가**: 필요한 컴포넌트와 API 메서드를 추가하여 새로운 기능을 구현할 수 있습니다.

## 참고 사항

- 실제 인스타그램 API를 사용하려면 Meta 개발자 계정이 필요합니다.
- 프로덕션 환경에서는 보안 조치와 서버 측 인증이 필요합니다.
