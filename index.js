'use strict';

class Item {
    constructor(text) {
        this.text = text;
        this.isCompleted = false;
    }
}

class ToDoList {
    constructor(element) {
        this.items = JSON.parse(window.localStorage.getItem("items")) || [];
        this.searchTerm = '';
        this.searchResults = [];
        this.element = element;
        this.renderToDoList(this.items);
    }

    renderToDoList(itemsArray) {
        this.element.innerHTML = '';
        this.createInputForm();
        this.createFilterContainer();
        this.createItemsContainer(itemsArray);
    }

    createInputForm() {
        const inputForm = document.createElement('div');
        inputForm.className = 'input-form';
        this.element.appendChild(inputForm);
      
        const inputField = document.createElement('input');
        inputField.className = 'input-field';
        inputField.autofocus = true;
        inputField.placeholder = 'Item';
        inputField.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.addItemsToList(inputField.value);
          }
        });
        inputForm.appendChild(inputField);
      
        const buttons = [
          { text: 'Add', onClick: () => this.addItemsToList(inputField.value) },
          { text: 'Search', onClick: () => this.search() }
        ];
        buttons.forEach(({ text, onClick }) => {
        const button = document.createElement('button');
        button.className = 'input-buttons';
        button.innerText = text;
        button.addEventListener('click', onClick);
        inputForm.appendChild(button);
        });
    }

    search() {
      const inputField = document.querySelector('.input-field');
      this.searchTerm = inputField.value.trim();
      
      if (this.searchTerm !== "") {
          this.searchResults = this.items.filter((item) => {
              return item.text.toLowerCase().includes(this.searchTerm.toLowerCase())
          });
              this.renderToDoList(this.searchResults);
          }
    }

    createFilterContainer() {
        const filterButtons = document.createElement('div');
        filterButtons.className = 'todolist-filters';
        
        const buttons = [
          { text: 'All', isCompleted: null },
          { text: 'To Do', isCompleted: false },
          { text: 'Completed', isCompleted: true }
        ];
      
        buttons.forEach(({ text, isCompleted }) => {
          const button = document.createElement('button');
          button.innerText = text;
          button.className = 'todolist-filters-button';
          if (button.innerText === 'All') {
            button.addEventListener('click', () => this.renderToDoList(this.items))
          } else {
              button.addEventListener('click', () => {
              this.renderToDoList(this.items.filter(item => item.isCompleted === isCompleted));
            });
          }
            filterButtons.appendChild(button);
        });
      
        this.element.appendChild(filterButtons);
      }
            

    addItemsToList(text) {
        if (text && text.trim()) {
            this.items.push(new Item(text.trim()));
            this.saveTaskInLocalStorage();
        }
        this.renderToDoList(this.items);
    }

    createItemsContainer(itemsArray) {
        const listItems = document.createElement('div');
        listItems.className = 'todolist-items';
      
        itemsArray.forEach((item, index) => {
          const itemContainer = document.createElement('div');
          const itemLabel = document.createElement('p');
          itemContainer.className = 'todolist-item';
          itemLabel.innerText = item.text;
      
          const removeButton = document.createElement('span');
          removeButton.className = 'delete';
          removeButton.innerHTML = "&times;";
      
          if (item.isCompleted) {
            itemContainer.classList.add('todolist-item-completed');
          }
      
          itemContainer.addEventListener('click', () => {
            itemContainer.classList.toggle('todolist-item-completed');
            item.isCompleted = !item.isCompleted;
            this.saveTaskInLocalStorage();
          });
      
          removeButton.addEventListener('click', () => {
            itemContainer.classList.remove('todolist-item-completed');

            const selectedArrayIndex = itemsArray.findIndex(
              item => item.text === itemLabel.textContent);
            const itemsIndex = this.items.findIndex(
              item => item.text === itemLabel.textContent);

            selectedArrayIndex === itemsIndex ? 
            this.items = this.items.filter((_, i) => i !== index) : 
            (selectedArrayIndex !== -1) ? 
            this.items = this.items.filter(item => item.text !== itemLabel.textContent) : null;

            this.saveTaskInLocalStorage();
            listItems.removeChild(itemContainer);
          });
      
          itemContainer.appendChild(itemLabel);
          itemContainer.appendChild(removeButton);
          listItems.appendChild(itemContainer);
        });
      
        this.element.appendChild(listItems);
      }

    saveTaskInLocalStorage() {
        window.localStorage.setItem("items", JSON.stringify(this.items));
    }

}

const toDoList = document.getElementById('todolist-container');
const todo = new ToDoList(toDoList);  