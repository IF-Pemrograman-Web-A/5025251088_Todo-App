let todos = [
    {
        id: 1,
        title: "Pelajari Elemen Semantik HTML",
        description: "Tinjau dokumentasi untuk elemen-elemen seperti header, main, aside, dan footer. Terapkan elemen-elemen tersebut dengan benar dalam tata letak tugas E01a untuk memastikan aksesibilitas web dan struktur yang baik.",
        isComplete: false
    },
    {
        id: 2,
        title: "Kuasai CSS Flexbox & Grid",
        description: "Pelajari cara membuat layout yang responsif dan fleksibel.",
        isComplete: true
    }
];

let selectedTodoId = null;

const todoForm = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const todoListEl = document.getElementById('todo-list');
const todoDetailEl = document.getElementById('todo-detail-card');
const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function renderTodos() {
    todoListEl.innerHTML = ''; 
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.id === selectedTodoId ? 'active' : ''}`;
        
        li.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <input type="checkbox" style="margin-top: 5px; cursor: pointer;" 
                    ${todo.isComplete ? 'checked' : ''} 
                    onchange="toggleComplete(${todo.id})">
                
                <div onclick="selectTodo(${todo.id})" style="flex-grow: 1; cursor: pointer;">
                    <h3 style="${todo.isComplete ? 'text-decoration: line-through; color: gray;' : ''}">${todo.title}</h3>
                    <p>Status: ${todo.isComplete ? 'Done' : 'Pending'}</p>
                </div>
            </div>
        `;
        todoListEl.appendChild(li);
    });
    
    renderDetail();
}

function renderDetail() {
    if (!selectedTodoId) {
        todoDetailEl.innerHTML = '<p style="text-align:center; color:gray;">Pilih tugas untuk melihat detail.</p>';
        return;
    }

    const todo = todos.find(t => t.id === selectedTodoId);
    if (!todo) return;

    todoDetailEl.innerHTML = `
        <span class="badge ${todo.isComplete ? 'badge-complete' : 'badge-progress'}">
            ${todo.isComplete ? 'Done' : 'In Progress'}
        </span>
        <h3 class="detail-title">${todo.title}</h3>
        <p class="detail-desc">${todo.description}</p>
        
        <div class="detail-actions">
            <!-- 2. Tombol Edit dan Delete -->
            <button class="btn btn-edit" onclick="editTodo(${todo.id})">Edit Todo</button>
            <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `;
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const newTodo = {
        id: Date.now(),
        title: titleInput.value,
        description: descInput.value,
        isComplete: false
    };
    
    todos.push(newTodo); 
    
    titleInput.value = '';
    descInput.value = '';
    
    renderTodos(); 
});

window.toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isComplete = !todo.isComplete;
        renderTodos();
    }
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    if (selectedTodoId === id) selectedTodoId = null; // Reset detail jika yang dihapus sedang dibuka
    renderTodos();
};

window.editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newTitle = prompt("Edit Judul Todo:", todo.title);
        const newDesc = prompt("Edit Deskripsi Todo:", todo.description);
        
        if (newTitle !== null && newTitle.trim() !== '') todo.title = newTitle;
        if (newDesc !== null && newDesc.trim() !== '') todo.description = newDesc;
        
        renderTodos();
    }
};

window.selectTodo = (id) => {
    selectedTodoId = id;
    renderTodos();
};

renderTodos();