let todos = [];
let selectedTodoId = null;
let db; 

// Elemen DOM
const todoForm = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const imageCapture = document.getElementById('image-capture');
const notifyTimeInput = document.getElementById('notify-time');
const todoListEl = document.getElementById('todo-list');
const todoDetailEl = document.getElementById('todo-detail-card');
const themeToggleBtn = document.getElementById('theme-toggle');

// ==========================================
// 1. SERVICE WORKER & NOTIFICATION
// ==========================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('Service Worker terdaftar:', registration);
    }).catch(err => console.error('Service Worker gagal:', err));
}

if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

setInterval(() => {
    const now = new Date().getTime();
    todos.forEach(todo => {
        if (todo.notifyTime && !todo.isNotified) {
            const timeToNotify = new Date(todo.notifyTime).getTime();
            if (now >= timeToNotify) {
                todo.isNotified = true;
                updateTodoInDB(todo); // Update status di IndexedDB
                
                // Kirim pesan ke Service Worker
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'SHOW_NOTIFICATION',
                        payload: {
                            title: todo.title,
                            body: todo.description,
                            image: todo.image
                        }
                    });
                }
            }
        }
    });
}, 10000);

// ==========================================
// 2. WEB STORAGE (localStorage untuk Tema)
// ==========================================
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ==========================================
// 3. WEB STORAGE (IndexedDB untuk Todo List)
// ==========================================
const request = indexedDB.open('TodoDatabase', 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id' });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    loadTodos();
};

function loadTodos() {
    const transaction = db.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    const request = store.getAll();
    
    request.onsuccess = () => {
        todos = request.result;
        renderTodos();
    };
}

function saveTodoToDB(todo) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    store.add(todo);
}

function updateTodoInDB(todo) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    store.put(todo);
}

function deleteTodoFromDB(id) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    store.delete(id);
}

// ==========================================
// 4. LOGIKA UI & MEDIA CAPTURE
// ==========================================
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const file = imageCapture.files[0];
    
    const processForm = (imageBase64) => {
        const newTodo = {
            id: Date.now(),
            title: titleInput.value,
            description: descInput.value,
            image: imageBase64,
            notifyTime: notifyTimeInput.value || null,
            isNotified: false,
            isComplete: false
        };
        
        todos.push(newTodo); 
        saveTodoToDB(newTodo);
        
        titleInput.value = '';
        descInput.value = '';
        imageCapture.value = '';
        notifyTimeInput.value = '';
        renderTodos();
    };

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => processForm(reader.result);
        reader.readAsDataURL(file);
    } else {
        processForm(null);
    }
});

function renderTodos() {
    todoListEl.innerHTML = ''; 
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.id === selectedTodoId ? 'active' : ''}`;
        li.setAttribute('role', 'listitem');
        
        li.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <input type="checkbox" style="margin-top: 5px; cursor: pointer;" 
                    ${todo.isComplete ? 'checked' : ''} 
                    aria-label="Tandai tugas ${todo.title} selesai"
                    onchange="toggleComplete(${todo.id})">
                
                <div onclick="selectTodo(${todo.id})" style="flex-grow: 1; cursor: pointer;" tabindex="0" role="button" aria-pressed="${todo.id === selectedTodoId}">
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

    let imageHTML = todo.image ? `<img src="${todo.image}" alt="Gambar referensi tugas ${todo.title}" style="max-width: 100%; border-radius: 4px; margin-bottom: 15px;">` : '';
    let timeHTML = todo.notifyTime ? `<p><strong>Pengingat:</strong> ${new Date(todo.notifyTime).toLocaleString()}</p>` : '';

    todoDetailEl.innerHTML = `
        <span class="badge ${todo.isComplete ? 'badge-complete' : 'badge-progress'}" aria-label="Status tugas">
            ${todo.isComplete ? 'Done' : 'In Progress'}
        </span>
        <h3 class="detail-title">${todo.title}</h3>
        ${timeHTML}
        ${imageHTML}
        <p class="detail-desc">${todo.description}</p>
        
        <div class="detail-actions">
            <button class="btn btn-edit" aria-label="Edit tugas ini" onclick="editTodo(${todo.id})">Edit Todo</button>
            <button class="btn btn-delete" aria-label="Hapus tugas ini" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `;
}

window.toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isComplete = !todo.isComplete;
        updateTodoInDB(todo);
        renderTodos();
    }
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    deleteTodoFromDB(id);
    if (selectedTodoId === id) selectedTodoId = null; 
    renderTodos();
};

window.editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newTitle = prompt("Edit Judul Todo:", todo.title);
        const newDesc = prompt("Edit Deskripsi Todo:", todo.description);
        
        if (newTitle !== null && newTitle.trim() !== '') {
            todo.title = newTitle;
            todo.description = newDesc !== null ? newDesc : todo.description;
            updateTodoInDB(todo);
            renderTodos();
        }
    }
};

window.selectTodo = (id) => {
    selectedTodoId = id;
    renderTodos();
};