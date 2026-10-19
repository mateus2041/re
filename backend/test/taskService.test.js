const assert = require("node:assert/strict");
const test = require("node:test");
const { TaskRepository } = require("../src/taskRepository");
const { TaskService } = require("../src/taskService");

function createService() {
  return new TaskService(new TaskRepository());
}

test("createTask trims input and creates a pending task", () => {
  const service = createService();

  const task = service.createTask({ title: "  Preparar taller  ", description: "  Revisar módulos  " });

  assert.equal(task.title, "Preparar taller");
  assert.equal(task.description, "Revisar módulos");
  assert.equal(task.status, "pendiente");
  assert.equal(service.listTasks().at(-1), task);
});

test("createTask rejects titles shorter than three characters", () => {
  const service = createService();

  assert.throws(
    () => service.createTask({ title: "ab" }),
    error => error.statusCode === 400 && error.message.includes("al menos 3")
  );
});

test("createTask rejects a title that is not a string", () => {
  const service = createService();

  assert.throws(
    () => service.createTask({ title: 123 }),
    error => error.statusCode === 400
  );
});

test("changeStatus updates a task when given a supported status", () => {
  const service = createService();

  const task = service.changeStatus(1, "finalizada");

  assert.equal(task.status, "finalizada");
  assert.equal(service.listTasks()[0].status, "finalizada");
});

test("changeStatus rejects unsupported statuses", () => {
  const service = createService();

  assert.throws(
    () => service.changeStatus(1, "bloqueada"),
    error => error.statusCode === 400 && error.message.includes("Estado inválido")
  );
});

test("changeStatus returns not found for an unknown task", () => {
  const service = createService();

  assert.throws(
    () => service.changeStatus(999, "finalizada"),
    error => error.statusCode === 404
  );
});
