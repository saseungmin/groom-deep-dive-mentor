// TodoStorage.js - localStorage 관련 기능을 담당하는 클래스
export class TodoStorage {
  constructor() {
    this.STORAGE_KEY = "todos";
  }

  // localStorage에서 todos 로드
  loadFromLocalStorage() {
    const storedTodos = localStorage.getItem(this.STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  // localStorage에 todos 저장
  saveToLocalStorage(todos) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      alert("localStorage에 데이터를 저장하는 중 오류가 발생했습니다.");
      console.error(
        "localStorage에 데이터를 저장하는 중 오류가 발생했습니다.",
        error
      );
    }
  }
}
