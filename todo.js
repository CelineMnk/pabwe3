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

// elemen tambahan di index.html
const searchInput = document.getElementById("searchInput");
const editArea = document.getElementById("editArea");
const editInput = document.getElementById("editInput");
const updateBtn = document.getElementById("updateBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const extraNotes = document.getElementById("extraNotes");

let todos = [];
let editingIndex = null;
let currentFilter = "all";

// render todos
function renderTodos() {
  todoList.innerHTML = "";
  let doneCount = 0;

  // filter dan search
  let filtered = todos.filter((t) => {
    if (currentFilter === "done") return t.done;
    if (currentFilter === "undone") return !t.done;
    return true;
  });
  if (searchInput && searchInput.value.trim()) {
    filtered = filtered.filter((t) =>
      t.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  }

  filtered.forEach((todo, index) => {
    const item = document.createElement("div");
    item.className = "todo-item";

    const handle = document.createElement("span");
    handle.className = "handle";
    handle.textContent = "☰";

    const emoji = document.createElement("span");
    emoji.className = "todo-emoji";
    emoji.textContent = todo.done ? "✅" : "📝";

    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.text;
    if (todo.done) {
      title.classList.add("done");
      doneCount++;
    }

    const priorityLabel = document.createElement("span");
    priorityLabel.style.marginLeft = "10px";
    if (todo.priority === "high") {
      priorityLabel.textContent = "🔥 Tinggi";
    } else if (todo.priority === "low") {
      priorityLabel.textContent = "🌿 Rendah";
    } else {
      priorityLabel.textContent = "📌 Normal";
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️";
    doneBtn.addEventListener("click", () => toggleDone(index));

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => startEdit(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(handle);
    item.appendChild(emoji);
    item.appendChild(title);
    item.appendChild(priorityLabel);
    item.appendChild(actions);

    todoList.appendChild(item);
  });

  countNote.textContent = `Total: ${todos.length}, Selesai: ${doneCount}, Belum: ${
    todos.length - doneCount
  }`;

  statTotal.textContent = `Total kegiatan: ${todos.length}`;
  statDone.textContent = `Selesai: ${doneCount}`;
  statUndone.textContent = `Belum selesai: ${todos.length - doneCount}`;
}

// tambah todo
addBtn.addEventListener("click", () => {
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
  addActivityLog(`Mengubah status: ${todos[index].text}`);
  renderTodos();
}

// hapus
function deleteTodo(index) {
  addActivityLog(`Menghapus ${todos[index].text}`);
  todos.splice(index, 1);
  renderTodos();
}

// edit
function startEdit(index) {
  editingIndex = index;
  editArea.style.display = "block";
  editInput.value = todos[index].text;
}

updateBtn.addEventListener("click", () => {
  if (editingIndex !== null) {
    todos[editingIndex].text = editInput.value;
    addActivityLog(`Mengubah judul`);
    editingIndex = null;
    editArea.style.display = "none";
    renderTodos();
  }
});
cancelEditBtn.addEventListener("click", () => {
  editingIndex = null;
  editArea.style.display = "none";
});

// log
function addActivityLog(msg) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
  activityLog.prepend(li);
}

// filter
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// search
if (searchInput) {
  searchInput.addEventListener("input", renderTodos);
}

// drag
new Sortable(todoList, {
  animation: 150,
  handle: ".handle",
});

renderTodos();
