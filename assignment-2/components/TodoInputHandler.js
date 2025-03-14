// TodoInputHandler.js - 입력 처리를 담당하는 클래스
export class TodoInputHandler {
  constructor(todoApp) {
    this.todoApp = todoApp;
  }

  // 새로운 todo 입력창 생성
  createNewTodoInput() {
    const todoItemElement = document.createElement("div");
    todoItemElement.className = "todo-item";

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "todo-input";
    inputElement.placeholder = "할 일을 입력하세요...";

    const handleInput = () => {
      const value = inputElement.value.trim();

      if (value) {
        this.todoApp.addTodo(value);
      }

      todoItemElement.remove();
    };

    inputElement.addEventListener("blur", () => {
      todoItemElement.remove();
    });

    // Enter 키 이벤트
    inputElement.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleInput();
      }
    };

    todoItemElement.appendChild(inputElement);
    this.todoApp.todoContainer.appendChild(todoItemElement);
    inputElement.focus();
  }
}
