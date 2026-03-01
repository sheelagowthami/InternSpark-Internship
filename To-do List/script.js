const taskList = document.getElementById("taskList");
const alarmSound = document.getElementById("alarmSound");

window.onload = function () {
    loadTasks();
    requestNotificationPermission();
    setInterval(updateCountdowns, 1000);
};

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

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
    taskInput.value = "";
}

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
        removeTask(task.id);
        li.remove();
    };

    li.appendChild(details);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(displayTask);
}

function updateTask(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCountdowns() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const now = new Date();

    tasks.forEach(task => {
        const target = new Date(`${task.date}T${task.time}`);
        const diff = target - now;

        const countdownEl = document.getElementById(`countdown-${task.id}`);

        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (countdownEl)
                countdownEl.innerText = `⏳ ${hours}h ${minutes}m ${seconds}s remaining`;
        }

        if (diff <= 0 && !task.reminded) {
            showNotification(task.name);
            alarmSound.play();
            task.reminded = true;
            updateTask(task);
        }
    });
}

function showNotification(taskName) {
    // Play sound safely
    alarmSound.currentTime = 0;
    alarmSound.play().catch(() => {
        console.log("Sound blocked until user interaction.");
    });

    if (Notification.permission === "granted") {
        new Notification("⏰ Reminder!", {
            body: taskName
        });
    } else {
        alert("⏰ Reminder: " + taskName);
    }
}
