const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUL = document.getElementById('todos');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

if (todos.length > 0) {
  todos.forEach((todo) => addTodoElement(todo));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = input.value.trim();
  if (todoText) {
    const priority = prompt("Enter priority (1 for high, 2 for medium, 3 for low):");
    const parsedPriority = parseInt(priority);

    if (isNaN(parsedPriority) || parsedPriority < 1 || parsedPriority > 3) {
      alert("Invalid priority! Please enter a priority between 1 ,2 and 3.");
      return;
    }

    const todo = {
      text: todoText,
      completed: false,
      priority: parsedPriority,
      created: new Date().toISOString(),
    };
    todos.push(todo);
    addTodoElement(todo);
    input.value = '';
    updateLS();
  }
}

function addTodoElement(todo) {
  const todoEl = document.createElement('li');
  if (todo.completed) {
    todoEl.classList.add('completed');
  }
  todoEl.dataset.priority = todo.priority;
  todoEl.innerHTML = `
    <span>${todo.text}</span>
    <span class="priority">${todo.priority}</span>
  `;
  todoEl.addEventListener('click', () => {
    todoEl.classList.toggle('completed');
    updateLS();
  });

  todoEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    todoEl.remove();
    todos = todos.filter((item) => item !== todo);
    updateLS();
  });

  todosUL.appendChild(todoEl);
}

function updateLS() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

filterSelect.addEventListener('change', () => {
  const selectedFilter = filterSelect.value;
  const todoElements = Array.from(todosUL.children);

  todoElements.forEach((todoEl) => {
    switch (selectedFilter) {
      case 'all':
        todoEl.style.display = 'block';
        break;
      case 'completed':
        todoEl.style.display = todoEl.classList.contains('completed') ? 'block' : 'none';
        break;
      case 'incomplete':
        todoEl.style.display = todoEl.classList.contains('completed') ? 'none' : 'block';
        break;
    }
  });
});

sortSelect.addEventListener('change', () => {
  const selectedSort = sortSelect.value;

  switch (selectedSort) {
    case 'created':
      todos.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case 'priority':
      todos.sort((a, b) => a.priority - b.priority);
      break;
  }

  while (todosUL.firstChild) {
    todosUL.firstChild.remove();
  }

  todos.forEach((todo) => {
    addTodoElement(todo);
  });
});
 