document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("input_text");
const taskList = document.getElementById("list");
const filterButton = document.getElementById("filter_task");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterCompleted = false;

function loadTasks() {
    updateDate();
    renderTasks(tasks);
}

function updateDate() {
    const dateElement = document.getElementById("current-date");
    const options = { year: "numeric", month: "short", day: "numeric" };
    dateElement.textContent = new Date().toLocaleDateString(undefined, options);
}

function addingTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(newTask);
    saveAndRender();
    taskInput.value = "";
}

function renderTasks(taskArray) {
    taskList.innerHTML = "";
    if (taskArray.length === 0) {
        taskList.innerHTML = "<li>No tasks to display.</li>";
        return;
    }
    taskArray.forEach(task => {
        const taskItem = document.createElement("li");
        taskItem.className = task.completed ? "completed" : "";
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <span class="timestamp">- ${new Date(task.id).toLocaleTimeString()}</span>
            <button onclick="toggleComplete(${task.id})">Mark as ${task.completed ? "Not Completed" : "Completed"}</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(tasks);
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    const newTaskText = prompt("Edit task:", task.text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        task.text = newTaskText.trim();
        saveAndRender();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function filterTasks() {
    filterCompleted = !filterCompleted;
    const filteredTasks = filterCompleted ? tasks.filter(task => task.completed) : tasks.filter(task => !task.completed);
    renderTasks(filteredTasks);
    filterButton.textContent = `Show ${filterCompleted ? "Pending" : "Completed"} Tasks`;
}

function searchTasks() {
    const searchText = document.getElementById("input_searchbox").value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchText));
    renderTasks(filteredTasks);
}