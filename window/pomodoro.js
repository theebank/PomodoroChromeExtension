var TodoList = [];

function updateTime() {
  chrome.storage.local.get(["timer", "isRunning", "timeOption"], (ret) => {
    const time = document.getElementById("Time");
    const minutes = `${ret.timeOption - Math.ceil(ret.timer / 60)}`.padStart(
      2,
      "0"
    );

    let seconds = "00";

    if (ret.timer % 60 != 0) {
      seconds = `${60 - (ret.timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
    startBtn.textContent = ret.isRunning ? "Pause" : "Start";
  });
}

updateTime();
setInterval(updateTime, 1000);

const startBtn = document.getElementById("Start-btn");
startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (ret) => {
    chrome.storage.local.set({ isRunning: !ret.isRunning }, () => {
      startBtn.textContent = !ret.isRunning ? "Pause" : "Start";
    });
  });
});

const resetBtn = document.getElementById("Reset-btn");
resetBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startBtn.textContent = "Start";
    }
  );
});

const addTaskBtn = document.getElementById("Add-Task-btn");
addTaskBtn.addEventListener("click", () => addTask());
chrome.storage.sync.get(["TodoList"], (ret) => {
  TodoList = ret.TodoList ? ret.TodoList : [];
  console.log("Added");
  renderTodo();
});

function renderTodo() {
  const Todocontainer = document.getElementById("Todo-container");
  Todocontainer.textContent = "";
  TodoList.forEach((item, num) => {
    renderitem(num);
  });
}

function renderitem(num) {
  const item = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Add a task";
  text.value = TodoList[num];
  text.className = "add-task";
  text.addEventListener("change", () => {
    TodoList[num] = text.value;
    saveTodo();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.className = "delete-task";
  deleteBtn.addEventListener("click", () => {
    deleteTask(num);
  });

  item.appendChild(text);
  item.appendChild(deleteBtn);

  const Todocontainer = document.getElementById("Todo-container");
  Todocontainer.appendChild(item);
}

function addTask() {
  var num = TodoList.length;
  TodoList.push("");
  renderitem(num);
  saveTodo();
}

function deleteTask(num) {
  TodoList.splice(num, 1);
  renderTodo();
  saveTodo();
}

function saveTodo() {
  chrome.storage.sync.set({
    TodoList,
  });
}
