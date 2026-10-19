const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

export function renderTasks(taskList, tasks) {
  if (!tasks.length) {
    taskList.innerHTML = "<p>No hay tareas todavía. Crea la primera.</p>";
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <article class="task">
      <div class="task-top">
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.description || "Sin descripción")}</p>
        </div>
        <strong>#${task.id}</strong>
      </div>
      <div class="task-actions">
        <label for="status-${task.id}">Estado</label>
        <select id="status-${task.id}" data-task-id="${task.id}">
          ${["pendiente", "en progreso", "finalizada"].map(status =>
            `<option ${task.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        <button type="button" class="secondary" data-save-id="${task.id}">Guardar estado</button>
      </div>
    </article>
  `).join("");
}

export function setApiStatus(apiStatus, connected) {
  apiStatus.textContent = connected ? "API conectada" : "API no disponible";
  apiStatus.style.background = connected ? "" : "#fde8e8";
  apiStatus.style.color = connected ? "" : "#9b2222";
}

export function setMessage(message, text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#17663a" : "#a12b2b";
}

export function showLoadError(taskList, error) {
  taskList.innerHTML = `<p>${escapeHtml(error.message)}. Verifica que el backend esté iniciado.</p>`;
}
