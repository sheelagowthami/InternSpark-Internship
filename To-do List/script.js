const taskList = document.getElementById("taskList");
const alarmSound = document.getElementById("alarmSound");

window.onload = function () {
    loadTasks();
    setInterval(updateCountdowns, 1000);
};

// ADD TASK
function addTask() {
    const name = taskInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const priority = priorityInput.value;

    if (!name || !date || !time) {
        alert("Fill all fields!");
        return;
    }

    const task = {
        id: Date.now(),
        name,
        date,
        time,
        priority,
        completed: false,
        reminded: false
    };

    saveTask(task);
    displayTask(task);

    alert("Task added successfully!");

    taskInput.value = "";
}

// DISPLAY TASK
function displayTask(task) {
    const li = document.createElement("li");
    li.classList.add(task.priority.toLowerCase());

    const details = document.createElement("div");
    details.className = "task-details";
    details.innerHTML = `
        <strong>${task.name}</strong>
        <small>${task.date} at ${task.time}</small>
        <div class="countdown" id="countdown-${task.id}"></div>
    `;

    if (task.completed) details.classList.add("completed");

    details.onclick = () => {
        task.completed = !task.completed;
        updateTask(task);
        location.reload();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.onclick = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            removeTask(task.id);
            li.remove();
        }
    };

    li.appendChild(details);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// SAVE TASK
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOAD TASKS
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length === 0) {
        taskList.innerHTML = "<p class='empty'>No tasks yet. Add your first task!</p>";
    } else {
        tasks.forEach(displayTask);
    }
}

// UPDATE TASK
function updateTask(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// REMOVE TASK
function removeTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// COUNTDOWN + REMINDER
function updateCountdowns() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const now = new Date();

    tasks.forEach(task => {
        const target = new Date(`${task.date}T${task.time}`);
        const diff = target - now;

        const el = document.getElementById(`countdown-${task.id}`);

        if (diff > 0 && el) {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            el.innerText = `⏳ ${h}h ${m}m ${s}s`;
        }

        if (diff <= 0 && !task.reminded) {
            alert("Reminder: " + task.name);
            alarmSound.play();
            task.reminded = true;
            updateTask(task);
        }
    });
}
