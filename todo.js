// ambil elemen
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const prioritySelect = document.getElementById("prioritySelect");
const countNote = document.getElementById("countNote");
const statTotal = document.getElementById("statTotal");
const statDone = document.getElementById("statDone");
const statUndone = document.getElementById("statUndone");
const activityLog = document.getElementById("activityLog");

let todos = [];

// render todos
function renderTodos() {
  todoList.innerHTML = "";
  let doneCount = 0;

  todos.forEach((todo, index) => {
    const item = document.createElement("div");
    item.className = "todo-item";

    // drag handle
    const handle = document.createElement("span");
    handle.className = "handle";
    handle.textContent = "☰";

    // emoji status
    const emoji = document.createElement("span");
    emoji.className = "todo-emoji";
    emoji.textContent = todo.done ? "✅" : "📝";

    // judul
    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.text;
    if (todo.done) {
      title.classList.add("done");
      doneCount++;
    }

    // label prioritas
    const priorityLabel = document.createElement("span");
    priorityLabel.style.marginLeft = "10px";
    priorityLabel.style.fontSize = "14px";
    priorityLabel.style.fontWeight = "600";
    priorityLabel.style.padding = "3px 8px";
    priorityLabel.style.borderRadius = "8px";

    if (todo.priority === "high") {
      priorityLabel.textContent = "🔥 Tinggi";
      priorityLabel.style.background = "#fdecea";
      priorityLabel.style.color = "#f44336";
    } else if (todo.priority === "low") {
      priorityLabel.textContent = "🌿 Rendah";
      priorityLabel.style.background = "#eafbea";
      priorityLabel.style.color = "#4caf50";
    } else {
      priorityLabel.textContent = "📌 Normal";
      priorityLabel.style.background = "#eaf3fd";
      priorityLabel.style.color = "#2196f3";
    }

    // tombol aksi
    const actions = document.createElement("div");
    actions.className = "actions";

    const doneBtn = document.createElement("button");
    doneBtn.type = "button"; // penting!
    doneBtn.className = "icon-btn edit";
    doneBtn.textContent = "✔️";
    doneBtn.addEventListener("click", () => toggleDone(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button"; // penting!
    deleteBtn.className = "icon-btn danger";
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    // susun item
    item.appendChild(handle);
    item.appendChild(emoji);
    item.appendChild(title);
    item.appendChild(priorityLabel);
    item.appendChild(actions);

    todoList.appendChild(item);
  });

  // update catatan jumlah
  countNote.textContent = `Total: ${todos.length}, Selesai: ${doneCount}, Belum: ${
    todos.length - doneCount
  }`;

  // update statistik
  if (statTotal) statTotal.textContent = `Total kegiatan: ${todos.length}`;
  if (statDone) statDone.textContent = `Selesai: ${doneCount}`;
  if (statUndone) statUndone.textContent = `Belum selesai: ${
    todos.length - doneCount
  }`;
}

// tambah todo
addBtn.addEventListener("click", (e) => {
  e.preventDefault(); // cegah submit form
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;

  if (!text) return;

  todos.unshift({ text, done: false, priority });
  todoInput.value = "";
  prioritySelect.value = "normal";

  addActivityLog(`Menambahkan "${text}" [${priority}]`);
  renderTodos();
});

// toggle selesai
function toggleDone(index) {
  todos[index].done = !todos[index].done;
  addActivityLog(
    `Mengubah status: "${todos[index].text}" → ${
      todos[index].done ? "selesai" : "belum selesai"
    }`
  );
  renderTodos();
}

// hapus todo
function deleteTodo(index) {
  addActivityLog(`Menghapus "${todos[index].text}"`);
  todos.splice(index, 1);
  renderTodos();
}

// log aktivitas
function addActivityLog(msg) {
  if (!activityLog) return;
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
  activityLog.prepend(li);
}

// drag & drop
new Sortable(todoList, {
  animation: 150,
  handle: ".handle",
});

renderTodos();
