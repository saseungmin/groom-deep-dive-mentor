// TodoApp.js - 메인 애플리케이션 클래스
import { TodoEventHandler } from "./TodoEventHandler.js";
import { TodoInputHandler } from "./TodoInputHandler.js";
import { TodoRenderer } from "./TodoRenderer.js";
import { TodoStorage } from "./TodoStorage.js";

export class TodoApp {
  constructor() {
    this.todos = [];
    this.todoContainer = document.getElementById("todoContainer");
    this.addTodoBtn = document.getElementById("addTodoBtn");

    // 서비스 초기화
    this.storage = new TodoStorage();
    this.renderer = new TodoRenderer(this.todoContainer);
    this.eventHandler = new TodoEventHandler(this);
    this.inputHandler = new TodoInputHandler(this);

    // 이벤트 리스너 등록
    this.addTodoBtn.addEventListener("click", () =>
      this.inputHandler.createNewTodoInput()
    );

    // 이벤트 위임을 통한 이벤트 처리
    this.todoContainer.addEventListener(
      "click",
      this.eventHandler.handleTodoContainerClick
    );
    this.todoContainer.addEventListener(
      "change",
      this.eventHandler.handleTodoContainerChange
    );

    // localStorage에서 데이터 로드
    this.loadTodos();

    // 초기 렌더링
    this.renderTodos();
  }

  // localStorage에서 todos 로드
  loadTodos() {
    this.todos = this.storage.loadFromLocalStorage();
  }

  // 새로운 todo 추가
  addTodo(text) {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    this.todos = [...this.todos, newTodo];
    this.storage.saveToLocalStorage(this.todos);
    this.renderTodos();
  }

  // todo 삭제
  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.storage.saveToLocalStorage(this.todos);
    this.renderTodos();
  }

  // todo 완료 상태 토글
  toggleComplete(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    this.storage.saveToLocalStorage(this.todos);
    this.renderTodos();
  }

  // todo 수정
  editTodo(id, newText) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    });

    this.storage.saveToLocalStorage(this.todos);
    this.renderTodos();
  }

  // todo 렌더링
  renderTodos() {
    this.renderer.renderTodos(this.todos);
  }
}
