const form = document.getElementById('destination-form');
const input = document.getElementById('destination-input');
const dateInput = document.getElementById('date-input');
const list = document.getElementById('destination-list');
const emptyMessage = document.getElementById('empty-message');

let destinations = JSON.parse(localStorage.getItem('jp-trip-destinations') || '[]');

function saveDestinations() {
  localStorage.setItem('jp-trip-destinations', JSON.stringify(destinations));
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderDestinations() {
  list.innerHTML = '';

  if (destinations.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  destinations
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((dest) => {
      const li = document.createElement('li');

      const info = document.createElement('div');
      info.className = 'destination-info';

      const name = document.createElement('span');
      name.className = 'destination-name';
      name.textContent = dest.name;

      const date = document.createElement('span');
      date.className = 'destination-date';
      date.textContent = formatDate(dest.date);

      info.appendChild(name);
      info.appendChild(date);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.setAttribute('aria-label', `Remove ${dest.name}`);
      removeBtn.addEventListener('click', () => {
        destinations = destinations.filter((d) => d.id !== dest.id);
        saveDestinations();
        renderDestinations();
      });

      li.appendChild(info);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = input.value.trim();
  const date = dateInput.value;

  if (!name || !date) return;

  destinations.push({ id: Date.now(), name, date });
  saveDestinations();
  renderDestinations();

  input.value = '';
  dateInput.value = '';
  input.focus();
});

renderDestinations();
