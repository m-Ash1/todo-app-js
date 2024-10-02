// Get references to DOM elements
const input = document.querySelector(".list .input input"); // Task input field
const listBody = document.querySelector(".list-body"); // Task list container
const itemsLeft = document.querySelector(".length"); // Counter for active tasks
const filters = document.querySelectorAll(".filter"); // Task filters (All, Active, Completed)
const clearCompletedBtn = document.querySelector(".clear"); // Button to clear completed tasks
const notification = document.querySelector(".notification"); // Notification container

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage or start with an empty array
let filter = "All"; // Default filter is 'All'

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to update the number of active tasks
function updateItemsLeft() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  itemsLeft.textContent = activeTasks;
}

// Function to render the task list based on the current filter
function renderTasks() {
  listBody.innerHTML = ""; // Clear the task list

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true; // For 'All' filter
  });

  // Create and append each task to the list
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("item", "title");
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <div class="check ${task.completed ? "checked" : ""}">
        <img src="images/icon-check.svg" alt="check" ${
          task.completed ? 'style="opacity: 1"' : ""
        } />
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } data-index="${index}" style="display:none">
      </div>
      <div class="task-text ${
        task.completed ? "checked-title" : ""
      }" contenteditable="true">${task.text}</div>
      <img src="images/icon-cross.svg" class="cross" data-index="${index}"/>
    `;

    listBody.appendChild(taskItem);
  });

  updateItemsLeft(); // Update the active task count
}

// Function to add a new task
function addTask(text) {
  if (text.trim()) {
    tasks.push({ text, completed: false }); // Add new task object
    saveTasks(); // Save to localStorage
    renderTasks(); // Re-render the task list
    showNotification("Task added successfully");
  }
}

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1); // Remove the task from the array
  saveTasks(); // Save to localStorage
  renderTasks(); // Re-render the task list
  showNotification("Task deleted successfully");
}

// Function to toggle task completion
function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed; // Toggle the completed status
  saveTasks(); // Save to localStorage
  renderTasks(); // Re-render the task list
}

// Function to clear completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed); // Keep only active tasks
  saveTasks(); // Save to localStorage
  renderTasks(); // Re-render the task list
  showNotification("Completed tasks cleared");
}

// Function to show a nice UI notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Event listeners
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(input.value); // Add task on Enter key press
    input.value = ""; // Clear the input field
  }
});

listBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("cross")) {
    const index = e.target.getAttribute("data-index");
    deleteTask(index); // Delete task on clicking delete button
  } else if (e.target.closest(".check")) {
    const index = e.target
      .closest(".check")
      .querySelector("input")
      .getAttribute("data-index");
    toggleTaskCompletion(index); // Toggle task completion on checkbox click
  }
});

listBody.addEventListener("input", (e) => {
  if (e.target.classList.contains("task-text")) {
    const index = e.target.previousElementSibling
      .querySelector("input")
      .getAttribute("data-index");
    tasks[index].text = e.target.textContent; // Update task text
    saveTasks(); // Save to localStorage
    showNotification("Task edited successfully");
  }
});

// Filter tasks based on the selected filter
filters.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    filters.forEach((f) => f.classList.remove("active"));
    filterBtn.classList.add("active");
    filter = filterBtn.textContent;
    renderTasks(); // Re-render the task list
  });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Initial render on page load
renderTasks();
