const apiBase = 'http://localhost:8080/api';
const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
const messageBox = document.getElementById('message');
const habitCount = document.getElementById('habitCount');

async function loadHabits() {
  try {
    const response = await fetch(`${apiBase}/habits`);
    const habits = await response.json();
    renderHabits(habits);
    habitCount.textContent = habits.length;
  } catch (error) {
    showMessage('Could not load habits. Make sure the Java backend is running.', 'danger');
  }
}

function renderHabits(habits) {
  if (!habits.length) {
    habitList.innerHTML = '<div class="text-muted">No habits yet. Add your first one above.</div>';
    return;
  }

  habitList.innerHTML = habits
    .map((habit) => {
      const completedClass = habit.completed ? 'completed' : '';
      const buttonText = habit.completed ? 'Done' : 'Mark done';
      return `
        <div class="habit-item ${completedClass}">
          <div>
            <div class="habit-name">${habit.name}</div>
            <div class="habit-meta">${habit.category}</div>
          </div>
          <button class="btn btn-sm toggle-btn ${habit.completed ? 'btn-success' : 'btn-outline-success'}" data-id="${habit.id}">
            ${buttonText}
          </button>
        </div>
      `;
    })
    .join('');
}

function showMessage(text, type = 'success') {
  messageBox.className = `alert alert-${type} mt-3`;
  messageBox.textContent = text;
  messageBox.classList.remove('d-none');
}

habitForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('habitName').value.trim();
  const category = document.getElementById('habitCategory').value;

  if (!name) {
    showMessage('Please enter a habit name.', 'warning');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category })
    });

    const result = await response.json();
    if (response.ok) {
      habitForm.reset();
      showMessage(result.message || 'Habit added successfully!', 'success');
      loadHabits();
    } else {
      showMessage(result.message || 'Something went wrong.', 'danger');
    }
  } catch (error) {
    showMessage('Could not add habit. Check the backend server.', 'danger');
  }
});

habitList.addEventListener('click', async (event) => {
  const button = event.target.closest('.toggle-btn');
  if (!button) return;

  const habitId = button.getAttribute('data-id');

  try {
    const response = await fetch(`${apiBase}/habits/${habitId}/toggle`, {
      method: 'PUT'
    });
    const result = await response.json();
    if (response.ok) {
      showMessage(result.message || 'Habit updated.', 'success');
      loadHabits();
    } else {
      showMessage(result.message || 'Unable to update habit.', 'danger');
    }
  } catch (error) {
    showMessage('Could not update habit.', 'danger');
  }
});

loadHabits();
