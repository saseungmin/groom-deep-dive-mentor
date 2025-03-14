// TodoEventHandler.js - 이벤트 처리를 담당하는 클래스
export class TodoEventHandler {
  constructor(todoApp) {
    this.todoApp = todoApp;
  }

  // 이벤트 위임을 통한 클릭 이벤트 처리
  handleTodoContainerClick = (event) => {
    const target = event.target;

    // 수정 버튼 클릭
    if (target.classList.contains("edit-btn")) {
      const todoItem = target.closest(".todo-item");
      const todoId = todoItem.dataset.id;
      const todo = this.todoApp.todos.find((t) => t.id === todoId);

      if (todo) {
        this.startEditMode(todoItem, todo);
      }
    }
    // 삭제 버튼 클릭
    else if (target.classList.contains("delete-btn")) {
      const todoItem = target.closest(".todo-item");
      const todoId = todoItem.dataset.id;

      if (todoId) {
        this.todoApp.deleteTodo(todoId);
      }
    }
  };

  // 이벤트 위임을 통한 체인지 이벤트 처리
  handleTodoContainerChange = (event) => {
    const target = event.target;

    // 체크박스 변경
    if (target.classList.contains("checkbox")) {
      const todoItem = target.closest(".todo-item");
      const todoId = todoItem.dataset.id;

      if (todoId) {
        this.todoApp.toggleComplete(todoId);
      }
    }
  };

  // todo 수정 모드로 전환
  startEditMode(todoItemElement, todo) {
    const todoTextElement = todoItemElement.querySelector(".todo-text");
    const actionsElement = todoItemElement.querySelector(".actions");

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "todo-input";
    inputElement.value = todo.text;

    const recoverTodoText = () => {
      todoTextElement.style.display = "";
      actionsElement.style.display = "";
      inputElement.remove();
    };

    const handleEdit = () => {
      const value = inputElement.value.trim();

      if (value) {
        this.todoApp.editTodo(todo.id, value);
      }

      recoverTodoText();
    };

    inputElement.addEventListener("blur", recoverTodoText);

    // Enter 키 이벤트
    inputElement.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleEdit();
      }
    };

    // 기존 요소를 숨기고 입력창 표시
    todoTextElement.style.display = "none";
    actionsElement.style.display = "none";

    todoItemElement.insertBefore(inputElement, todoTextElement);
    inputElement.focus();
  }
}
