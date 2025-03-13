// 전역 상태
let todos = [];
let todoContainer;
let addTodoBtn;

// 앱 초기화
function initTodoApp() {
  todoContainer = document.getElementById("todoContainer");
  addTodoBtn = document.getElementById("addTodoBtn");

  // 이벤트 리스너 등록
  addTodoBtn.addEventListener("click", createNewTodoInput);

  // localStorage에서 데이터 로드
  loadFromLocalStorage();

  // 초기 렌더링
  renderTodos();
}

// localStorage에서 todos 로드
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");

  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
}

// localStorage에 todos 저장
function saveToLocalStorage() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    alert("localStorage에 데이터를 저장하는 중 오류가 발생했습니다.");
    console.error(
      "localStorage에 데이터를 저장하는 중 오류가 발생했습니다.",
      error
    );
  }
}

// 새로운 todo 입력창 생성
function createNewTodoInput() {
  const todoItemElement = document.createElement("div");
  todoItemElement.className = "todo-item";

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "todo-input";
  inputElement.placeholder = "할 일을 입력하세요...";

  const handleInput = () => {
    const value = inputElement.value.trim();

    if (value) {
      addTodo(value);
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
  todoContainer.appendChild(todoItemElement);
  inputElement.focus();
}

// 새로운 todo 추가
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos = [...todos, newTodo];

  saveToLocalStorage();
  renderTodos();
}

// todo 삭제
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

// todo 완료 상태 토글
function toggleComplete(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }

    return todo;
  });

  saveToLocalStorage();
  renderTodos();
}

// todo 수정
function editTodo(id, newText) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: newText };
    }

    return todo;
  });

  saveToLocalStorage();
  renderTodos();
}

// todo 수정 모드로 전환
function startEditMode(todoItemElement, todo) {
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
      editTodo(todo.id, value);
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

// 모든 todo 렌더링
function renderTodos() {
  todoContainer.innerHTML = "";

  for (const todo of todos) {
    const todoElement = document.createElement("div");
    todoElement.className = "todo-item";

    if (todo.completed) {
      todoElement.classList.add("completed");
    }

    // 체크박스 생성
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.className = "checkbox";
    checkboxElement.checked = todo.completed;
    checkboxElement.addEventListener("change", () => toggleComplete(todo.id));

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
    editButtonElement.addEventListener("click", () =>
      startEditMode(todoElement, todo)
    );

    // 삭제 버튼
    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.className = "delete-btn";
    deleteButtonElement.textContent = "삭제";
    deleteButtonElement.addEventListener("click", () => deleteTodo(todo.id));

    // 요소들 추가
    actionsElement.appendChild(editButtonElement);
    actionsElement.appendChild(deleteButtonElement);

    todoElement.appendChild(checkboxElement);
    todoElement.appendChild(todoTextElement);
    todoElement.appendChild(actionsElement);

    todoContainer.appendChild(todoElement);
  }
}

// 앱 초기화
document.addEventListener("DOMContentLoaded", initTodoApp);
