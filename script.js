let taskList = document.getElementById("taskList");

window.onload = () => {
  loadTasks();
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

function addTask() {
  let task = taskInput.value;
  let time = timeInput.value;
  let priority = priorityInput.value;

  if (task === "" || time === "") return alert("Enter task and time!");

  let obj = { task, time, priority, completed: false };
  let data = JSON.parse(localStorage.getItem("tasks")) || [];
  data.push(obj);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTask(obj);
  setAlarm(obj);
  taskInput.value = "";
}

function renderTask(obj) {
  let li = document.createElement("li");
  li.className = obj.priority.toLowerCase();
  if (obj.completed) li.classList.add("completed");

  li.innerHTML = `
  <div>
    <b>${obj.task}</b><br>
    <small>${obj.time}</small>
  </div>
  <div>
    <input type="checkbox" ${obj.completed ? "checked" : ""} onclick="toggleComplete(this)">
    <span onclick="deleteTask(this)">✖</span>
  </div>
  `;
  taskList.appendChild(li);
}

function loadTasks() {
  let data = JSON.parse(localStorage.getItem("tasks")) || [];
  data.forEach(task => {
    renderTask(task);
    setAlarm(task);
  });
}

function toggleComplete(el) {
  el.closest("li").classList.toggle("completed");
  updateStorage();
}

function deleteTask(el) {
  el.closest("li").remove();
  updateStorage();
}

function updateStorage() {
  let arr = [];
  document.querySelectorAll("li").forEach(li => {
    arr.push({
      task: li.querySelector("b").innerText,
      time: li.querySelector("small").innerText,
      priority: li.classList.contains("high") ? "High" :
                li.classList.contains("medium") ? "Medium" : "Low",
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(arr));
}

/* ⏰ ALARM SYSTEM */
function setAlarm(task) {
  if (task.completed) return;

  let now = new Date();
  let alarmTime = new Date();
  let [h, m] = task.time.split(":");
  alarmTime.setHours(h, m, 0, 0);

  if (alarmTime < now) alarmTime.setDate(alarmTime.getDate() + 1);

  let timeout = alarmTime - now;

  setTimeout(() => {
    showNotification(task.task);
    playSound();
  }, timeout);
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification("⏰ Task Reminder", {
      body: text,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
    });
  }
}

function playSound() {
  let audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
  audio.play();
}

function toggleMode() {
  document.body.classList.toggle("dark");
}
