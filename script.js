document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const error = document.getElementById('formError');

  if (!name || !email || !message) {
    error.textContent = "All fields are required.";
    return;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  error.textContent = "Form submitted successfully!";
  this.reset();
});


function addTask() {
  const input = document.getElementById('taskInput');
  const task = input.value.trim();
  const list = document.getElementById('taskList');
  console.log(task);
  if (task === "") return;

  const li = document.createElement('li');
  li.innerHTML = `${task} <button onclick="removeTask(this)">Remove</button>`;
  list.appendChild(li);
  input.value = "";
}

function removeTask(button) {
  button.parentElement.remove();
}

// Task Management System
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Form validation
const contactForm = document.getElementById('contactForm');
const formError = document.getElementById('formError');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name || !email || !subject || !message) {
        showError('All fields are required');
        return;
    }
    
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    formError.style.display = 'none';
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

function showError(message) {
    formError.textContent = message;
    formError.style.display = 'block';
}

// Task Management Functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskInput.value,
        priority: taskPriority.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStatistics();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredTasks = tasks;
    
    if (priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => 
            statusFilter === 'completed' ? t.completed : !t.completed
        );
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
            <span onclick="toggleTaskStatus(${task.id})">
                <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                ${task.text}
            </span>
            <div class="task-controls">
                <button onclick="toggleTaskStatus(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
    
    updateStatistics();
}

function updateStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
}

// Theme Switcher
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeIcon = document.querySelector('.theme-switch i');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
}

// Event Listeners
document.getElementById('priorityFilter').addEventListener('change', renderTasks);
document.getElementById('statusFilter').addEventListener('change', renderTasks);

// Initial render
renderTasks();