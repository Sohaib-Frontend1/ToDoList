let taskInput = document.getElementById("taskInput"),
    addBtn = document.getElementById("addBtn"),
    message = document.getElementById("message"),
    taskCount = document.getElementById("taskCount"),
    taskList = document.getElementById("taskList");

let tasks = [],
    savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
}

let msgTimeout;

function showMsg(msg, isError) {
    clearTimeout(msgTimeout);

    message.textContent = msg;
    message.style.color = isError ? "#ff4d4d" : "#facc15";

    msgTimeout = setTimeout(() => {
        message.textContent = "";
        message.style.color = "";
    }, 5000);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";
    tasks.forEach(function (task, index) {
        let li = document.createElement("li");

        if (task.done) {
            li.classList.add("done");
        }

        let taskSpan = document.createElement("span");
        taskSpan.textContent = task.text;

        let noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.placeholder = "Add a Note";
        noteInput.value = task.note || "";
        // noteInput.readOnly = task.done;
        noteInput.oninput = function () {
            tasks[index].note = noteInput.value;
            saveTasks();
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            tasks.splice(index, 1);

            saveTasks();
            displayTasks();

            showMsg("Task Deleted Successfully", false);
        };

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.onchange = function () {
            tasks[index].done = checkbox.checked;
            saveTasks();
            displayTasks();
        };

        noteInput.readOnly = checkbox.checked;

        if (checkbox.checked) {
            li.classList.add("done");
        } else {
            li.classList.remove("done");
        }

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(noteInput);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    taskCount.textContent = tasks.length;
}

addBtn.addEventListener("click", function () {
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        showMsg("Please Enter New Task", true);
        return;
    }

    let newTask = {
        text: taskText,
        note: "",
        done: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    showMsg("Task Added Successfully", false);
    taskInput.value = "";
});

function deleteAll() {
    if (tasks.length === 0) {
        showMsg("No items to delete", true);
        return;
    }

    tasks = [];

    saveTasks();
    displayTasks();

    showMsg("All Tasks Deleted Successfully", false);
}

displayTasks();
