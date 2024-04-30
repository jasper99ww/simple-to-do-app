import { TodoListPanelFactory } from '../utils/TodoListPanelFactory.js'; // Importujemy naszą fabrykę

export class TodoListPanel {

  constructor(model) {
    this.model = model;
    this.listContainer = document.getElementById('list-names');
    this.model.addObserver(this);

    this.firstListForm = document.getElementById("first-list-form");
    this.listForm = document.getElementById("new-list-form");

    this.setupEventListeners();
    this.factory = new TodoListPanelFactory(this.model); // Tworzymy instancję fabryki
    this.render();
  }

  setupEventListeners() {
    if (this.firstListForm) {
        this.firstListForm.addEventListener('submit', (e) => this.handleCreateFirstList(e));
    }
    // Dodawanie nowej listy
    if (this.listForm) {
        this.listForm.addEventListener('submit', (e) => this.handleCreateList(e));
    }
  }
  
    // Metoda obsługująca dodawanie pierwszej listy
    handleCreateFirstList(e) {
        e.preventDefault();
        const newListInput = document.getElementById("first-list-input");
        const newListName = newListInput.value.trim();
        console.log('dodawanie pierwszej listy' + newListName)
        if (newListName.length > 0) {
          this.model.addList({
            name: newListName,
            completed: false,
            todos: []
        });
        newListInput.value = ""; // Czyść pole tekstowe po dodaniu listy
        }
      }
    
      // Metoda obsługująca dodawanie nowej listy
      handleCreateList(e) {
        e.preventDefault();
        const newListInput = document.getElementById("new-list-input");
        const newListName = newListInput.value.trim();
        console.log('handle create list')
        if (newListName.length > 0) {
          this.model.addList({
            name: newListName,
            completed: false,
            todos: []
          });
          console.log('new lsit name to ' + newListName)
          newListInput.value = ""; // Czyść pole tekstowe po dodaniu listy
        }
      }

  render() {
    this.listContainer.innerHTML = ''; 
    Object.keys(this.model.lists).forEach(name => {
      const list = this.model.lists[name]; // Pobieramy informacje o liście z modelu
      console.log("RENDERUJEMY LISTE" + name)
      const listItem = this.factory.createTodoListPanel(list); // Tworzymy element listy panelu ToDo za pomocą fabryki
      if (name === this.model.currentList) {
        listItem.classList.add('active');
      }
      this.listContainer.appendChild(listItem);
    });
  }

  
  update() {
    this.render();
  }
}
