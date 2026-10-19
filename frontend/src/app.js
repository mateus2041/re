import { createTask, listTasks, updateTaskStatus } from "./taskApi.js";
import {
  renderTasks,
  setApiStatus,
  setMessage,
  showLoadError
} from "./taskView.js";

const API_URL = "http://localhost:3000/api/tasks";
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");
const apiStatus = document.querySelector("#api-status");

async function loadTasks() {
  try {
    const tasks = await listTasks(API_URL);
    renderTasks(taskList, tasks);
    setApiStatus(apiStatus, true);
  } catch (error) {
    setApiStatus(apiStatus, false);
    showLoadError(taskList, error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(message, "");
  try {
    await createTask(API_URL, {
      title: titleInput.value,
      description: descriptionInput.value
    });
    form.reset();
    setMessage(message, "Tarea creada correctamente.", true);
    await loadTasks();
  } catch (error) {
    setMessage(message, error.message);
  }
});

document.querySelector("#refresh").addEventListener("click", loadTasks);

taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-save-id]");
  if (!button) return;

  const id = button.dataset.saveId;
  const select = taskList.querySelector(`[data-task-id="${id}"]`);
  if (!select) {
    setMessage(message, "No se encontró el estado de la tarea seleccionada.");
    return;
  }

  try {
    await updateTaskStatus(API_URL, id, select.value);
    await loadTasks();
  } catch (error) {
    setMessage(message, error.message);
  }
});

loadTasks();
