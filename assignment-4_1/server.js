const jsonServer = require("json-server");
const cors = require("cors");
const path = require("node:path");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "./", // 현재 디렉토리의 정적 파일 제공
});

// CORS 설정
server.use(cors());
server.options("*", cors());

// 기본 미들웨어 사용 (로깅, 정적 파일 서빙 등)
server.use(middlewares);

// 요청 본문 파싱
server.use(jsonServer.bodyParser);

// 사용자 정의 라우트
server.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/posts") {
    req.body.created_time = Math.floor(Date.now() / 1000);
  }
  next();
});

// 커스텀 엔드포인트: 피드 데이터
server.get("/api/feed", (req, res) => {
  const db = router.db.getState();
  const posts = db.posts;
  const users = db.users;
  const comments = db.comments;

  const feedPosts = posts.map((post) => {
    const user = users.find((u) => u.id === post.user_id);
    const postComments = comments
      .filter((c) => c.post_id === post.id)
      .map((comment) => {
        const commentUser = users.find((u) => u.id === comment.user_id);
        return {
          id: comment.id,
          user: {
            username: commentUser.username,
          },
          text: comment.text,
          created_time: comment.created_time,
        };
      });

    return {
      id: post.id,
      user: {
        username: user.username,
        profile_picture: user.profile_picture,
      },
      images: {
        standard_resolution: {
          url: post.image_url,
          width: 614,
          height: 614,
        },
      },
      likes: {
        count: post.likes_count,
      },
      caption: {
        text: post.caption,
        created_time: post.created_time,
      },
      comments: {
        count: postComments.length,
        data: postComments,
      },
      created_time: post.created_time,
      location: {
        name: post.location,
      },
    };
  });

  res.jsonp(feedPosts);
});

// 기타 API 엔드포인트 (이전과 동일)
server.get("/api/stories", (req, res) => {
  const db = router.db.getState();
  const stories = db.stories;
  const users = db.users;

  const userStories = stories.map((story) => {
    const user = users.find((u) => u.id === story.user_id);

    return {
      id: story.id,
      user: {
        username: user.username,
        profile_picture: user.profile_picture,
      },
      created_time: story.created_time,
      media_type: story.media_type,
      media_url: story.media_url,
    };
  });

  res.jsonp(userStories);
});

server.get("/api/users/:username", (req, res) => {
  const db = router.db.getState();
  const users = db.users;
  const username = req.params.username;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).jsonp({ error: "User not found" });
  }

  res.jsonp(user);
});

server.get("/api/suggested_users", (req, res) => {
  const db = router.db.getState();
  const suggestedUsers = db.suggested_users;

  res.jsonp(suggestedUsers);
});

server.post("/api/toggle_like", (req, res) => {
  const db = router.db.getState();
  const { post_id, user_id, is_liked } = req.body;

  if (!post_id || !user_id) {
    return res.status(400).jsonp({ error: "post_id and user_id are required" });
  }

  const post = db.posts.find((p) => p.id === Number.parseInt(post_id));

  if (!post) {
    return res.status(404).jsonp({ error: "Post not found" });
  }

  const existingLike = db.likes.find(
    (like) =>
      like.post_id === Number.parseInt(post_id) &&
      like.user_id === Number.parseInt(user_id)
  );

  if (is_liked && !existingLike) {
    // 좋아요 추가
    const newLike = {
      id: db.likes.length + 1,
      post_id: Number.parseInt(post_id),
      user_id: Number.parseInt(user_id),
    };

    db.likes.push(newLike);
    post.likes_count += 1;

    // db.json 파일 업데이트
    router.db.setState(db);

    return res.jsonp({
      success: true,
      likes: post.likes_count,
    });
  }

  if (!is_liked && existingLike) {
    // 좋아요 제거
    const likeIndex = db.likes.findIndex(
      (like) =>
        like.post_id === Number.parseInt(post_id) &&
        like.user_id === Number.parseInt(user_id)
    );

    db.likes.splice(likeIndex, 1);
    post.likes_count -= 1;

    // db.json 파일 업데이트
    router.db.setState(db);

    return res.jsonp({
      success: true,
      likes: post.likes_count,
    });
  }

  // 이미 요청된 상태와 동일한 경우
  return res.jsonp({
    success: true,
    likes: post.likes_count,
  });
});

server.post("/api/add_comment", (req, res) => {
  const db = router.db.getState();
  const { post_id, user_id, text } = req.body;

  if (!post_id || !user_id || !text) {
    return res
      .status(400)
      .jsonp({ error: "post_id, user_id, and text are required" });
  }

  const post = db.posts.find((p) => p.id === Number.parseInt(post_id));
  const user = db.users.find((u) => u.id === Number.parseInt(user_id));

  if (!post || !user) {
    return res.status(404).jsonp({ error: "Post or user not found" });
  }

  // 새 댓글 생성
  const newComment = {
    id: db.comments.length + 1,
    post_id: Number.parseInt(post_id),
    user_id: Number.parseInt(user_id),
    text: text,
    created_time: Math.floor(Date.now() / 1000),
  };

  // 댓글 추가
  db.comments.push(newComment);

  // db.json 파일 업데이트
  router.db.setState(db);

  // 응답 형식화
  const commentResponse = {
    id: newComment.id,
    user: {
      username: user.username,
    },
    text: newComment.text,
    created_time: newComment.created_time,
  };

  return res.jsonp({
    success: true,
    comment: commentResponse,
    comments_count: db.comments.filter(
      (c) => c.post_id === Number.parseInt(post_id)
    ).length,
  });
});

server.post("/api/toggle_follow", (req, res) => {
  const db = router.db.getState();
  const { follower_id, following_username, is_following } = req.body;

  if (!follower_id || !following_username) {
    return res
      .status(400)
      .jsonp({ error: "follower_id and following_username are required" });
  }

  const followingUser = db.users.find((u) => u.username === following_username);

  if (!followingUser) {
    return res.status(404).jsonp({ error: "User not found" });
  }

  const following_id = followingUser.id;

  const existingFollow = db.follows.find(
    (follow) =>
      follow.follower_id === Number.parseInt(follower_id) &&
      follow.following_id === following_id
  );

  if (is_following && !existingFollow) {
    // 팔로우 추가
    const newFollow = {
      id: db.follows.length + 1,
      follower_id: Number.parseInt(follower_id),
      following_id: following_id,
    };

    db.follows.push(newFollow);

    // db.json 파일 업데이트
    router.db.setState(db);

    return res.jsonp({
      success: true,
      status: "following",
    });
  }

  if (!is_following && existingFollow) {
    // 팔로우 제거
    const followIndex = db.follows.findIndex(
      (follow) =>
        follow.follower_id === Number.parseInt(follower_id) &&
        follow.following_id === following_id
    );

    db.follows.splice(followIndex, 1);

    // db.json 파일 업데이트
    router.db.setState(db);

    return res.jsonp({
      success: true,
      status: "not-following",
    });
  }

  // 이미 요청된 상태와 동일한 경우
  return res.jsonp({
    success: true,
    status: is_following ? "following" : "not-following",
  });
});

// HTML5 History API를 사용하는 SPA를 위한 폴백
// 모든 요청이 index.html로 리다이렉트되도록 함
server.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api/") &&
    !req.path.includes(".")
  ) {
    res.sendFile(path.join(__dirname, "index-with-json-server.html"));
  } else {
    next();
  }
});

// JSON Server 라우터 사용
server.use(router);

// 서버 시작
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server가 http://localhost:${PORT}에서 실행 중입니다`);
  console.log(
    `프론트엔드는 http://localhost:${PORT}/instagram-mockup.html에서 접근 가능합니다`
  );
  console.log("\n사용 가능한 API 엔드포인트:");
  console.log("  GET    /api/feed");
  console.log("  GET    /api/stories");
  console.log("  GET    /api/users/:username");
  console.log("  GET    /api/suggested_users");
  console.log("  POST   /api/toggle_like");
  console.log("  POST   /api/add_comment");
  console.log("  POST   /api/toggle_follow");
});
