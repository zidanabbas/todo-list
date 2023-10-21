// Mendefinisikan/initialisasi custom event yang sudah dibuat
const RENDER_EVENT = "render-todo";

//Menampung data todo berupa object yang disimpan dalam array todos
const todos = [];

// Fungsi untuk memuat DOM
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
  });
});

document.addEventListener(RENDER_EVENT, () => {
  //   console.log(todos);
  const uncompletedTODOList = document.getElementById("todos");
  //Membersihkan container sebelum diperbarui agar tidak terjadi duplikasi
  uncompletedTODOList.innerHTML = "";

  // Menampilakan todolist yang sudah selesai
  const completedTODOList = document.getElementById("completed-todos");
  //Membersihkan container sebelum diperbarui agar tidak terjadi duplikasi
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    /* Pengecekan untuk menampilkan todolist yang belum selesai */
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

function addTodo() {
  //Mengambil element pada html berdasarkan id
  const textTodo = document.getElementById("title").value;
  const timeStamp = document.getElementById("date").value;

  const generateID = generateId();
  const todoObject = generateTodoObject(generateID, textTodo, timeStamp, false);
  todos.push(todoObject);

  // Membuat event baru bernama RENDER_EVENT
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi untuk membuat generate id unik
function generateId() {
  // fungsi return +new Data() berfungsi untuk mendapatkan tanggal sekarang
  return +new Date();
}

/*Fungsi untuk membuat object baru yang menampung data yang sudah disediakan dari
  parameter function 
*/
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

// Fungsi untuk membuat element todo
function makeTodo(todoObject) {
  // Mmebuat element html h2
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  //Menambahkan class satu atau beberapa class inner
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo=${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", () => {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", () => {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", () => {
      addTaskToCompeleted(todoObject.id);
    });
    container.append(checkButton);
  }

  return container;
}

function addTaskToCompeleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget === null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

// Fungsi untuk menghapus todolist/task completed (selesai)
function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;
  // menghapus isi array todos menggunakan method splice()
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi untuk mengembalikan todolist/task completed (selesai) ke incompleted(belum selesai)
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget === null) return;
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}
