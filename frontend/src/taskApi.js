async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la operación.");
  return data;
}

export function listTasks(apiUrl) {
  return request(apiUrl);
}

export function createTask(apiUrl, task) {
  return request(apiUrl, {
    method: "POST",
    body: JSON.stringify(task)
  });
}

export function updateTaskStatus(apiUrl, id, status) {
  return request(`${apiUrl}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
