// TodoRenderer.js - UI 렌더링을 담당하는 클래스
export class TodoRenderer {
  constructor(container) {
    this.container = container;
  }

  // 모든 todo 렌더링
  renderTodos(todos) {
    this.container.innerHTML = "";

    for (const todo of todos) {
      const todoElement = document.createElement("div");
      todoElement.className = "todo-item";
      todoElement.dataset.id = todo.id; // todo의 id를 data 속성으로 저장

      if (todo.completed) {
        todoElement.classList.add("completed");
      }

      // 체크박스 생성
      const checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.className = "checkbox";
      checkboxElement.checked = todo.completed;

      // Todo 텍스트
      const todoTextElement = document.createElement("div");
      todoTextElement.className = "todo-text";
      todoTextElement.textContent = todo.text;

      // 액션 버튼들
      const actionsElement = document.createElement("div");
      actionsElement.className = "actions";

      // 수정 버튼
      const editButtonElement = document.createElement("button");
      editButtonElement.className = "edit-btn";
      editButtonElement.textContent = "수정";

      // 삭제 버튼
      const deleteButtonElement = document.createElement("button");
      deleteButtonElement.className = "delete-btn";
      deleteButtonElement.textContent = "삭제";

      // 요소들 추가
      actionsElement.appendChild(editButtonElement);
      actionsElement.appendChild(deleteButtonElement);

      todoElement.appendChild(checkboxElement);
      todoElement.appendChild(todoTextElement);
      todoElement.appendChild(actionsElement);

      this.container.appendChild(todoElement);
    }
  }
}
