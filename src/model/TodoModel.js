export class TodoModel {

    constructor() {
        const storedLists = localStorage.getItem("todoLists");
        this.lists = storedLists ? JSON.parse(storedLists) : {};
        this.currentList = Object.keys(this.lists)[0] || null;
        this.observers = [];
      }
    
      addObserver(observer) {
        this.observers.push(observer);
      }
    
      notifyObservers() {
        this.observers.forEach(observer => observer.update());
      }
    
      addList(list) {
        console.log('w modelu ' + list.name)
        if (!this.lists[list.name]) {
          this.lists[list.name] = {
              name: list.name,
              completed: list.completed || false,
              todos: list.todos || []
          };
          this.saveTodos();
          this.notifyObservers();
        }
      }
    
      deleteList(listName) {
        if (this.lists[listName]) {
          delete this.lists[listName];
          this.saveTodos();
          this.notifyObservers();
        }
      }
    
      addTodo(todo) {
        // Dodawanie zadania do bieżącej listy zadań
        if (this.lists[this.currentList]) {
          if (!this.lists[this.currentList].todos) {
              this.lists[this.currentList].todos = []; // Upewnij się, że istnieje tablica todos, zanim dodasz do niej element
          }
          this.lists[this.currentList].todos.push(todo);
          this.saveTodos(); // Zapisz zmiany w localStorage
          this.notifyObservers(); // Powiadom obserwatorów o zmianie
      } else {
          console.error("Brak zdefiniowanej listy dla bieżącej listy:", this.currentList);
      }
    }
    
    
      deleteTodoItem(index) {
        this.lists[this.currentList].splice(index, 1);
        this.saveTodos();
        this.notifyObservers();
      }
    
      toggleTodoItemCompleted(index) {
        const todo = this.lists[this.currentList][index];
        todo.completed = !todo.completed;
        this.saveTodos();
        this.notifyObservers();
      }
    
      saveTodos() {
        localStorage.setItem("todoLists", JSON.stringify(this.lists));
      }
    
      changeList(newList) {
        if (this.lists[newList]) {
          this.currentList = newList;
          this.notifyObservers();
        }
      }
}