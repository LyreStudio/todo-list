const key = 'lyre-todo-list.v1';
const form = document.getElementById('form');
const input = document.getElementById('input');
const list = document.getElementById('todos');
const status = document.getElementById('status');
let tasks = [];
let canSave = true;
try {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length > 2000 || parsed.some(task => !task || typeof task.text !== 'string' || !task.text.trim() || task.text.length > 500 || typeof task.completed !== 'boolean')) throw new Error('Invalid saved tasks');
    tasks = parsed;
  }
} catch {
  canSave = false;
  status.textContent = 'Saved tasks could not be read. Existing storage is preserved; changes stay in memory this session.';
}
function save() {
  if (!canSave) return;
  try { localStorage.setItem(key, JSON.stringify(tasks)); status.textContent = 'Saved in this browser.'; }
  catch { status.textContent = 'Tasks could not be saved. Keep this page open to retain this session.'; }
}
function render() {
  list.replaceChildren();
  for (const [index, task] of tasks.entries()) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Complete ' + task.text);
    checkbox.addEventListener('change', () => { task.completed = checkbox.checked; item.classList.toggle('completed', task.completed); save(); });
    const text = document.createElement('span'); text.textContent = task.text;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Delete'; remove.setAttribute('aria-label', 'Delete ' + task.text);
    remove.addEventListener('click', () => { tasks.splice(index, 1); render(); save(); input.focus(); });
    label.append(checkbox, text); item.append(label, remove); item.classList.toggle('completed', task.completed); list.append(item);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!input.value.trim()) return;
  if (tasks.length >= 2000) { status.textContent = 'Remove a task before adding more.'; return; }
  tasks.push({ text: input.value.trim(), completed: false }); render(); save(); input.value = ''; input.focus();
});
render();
