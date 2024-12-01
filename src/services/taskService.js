export async function fetchTasks(token) {
  const response = await fetch('/api/getTasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error fetching tasks');
  }
}

export async function saveTask(token, task) {
  const response = await fetch('/api/saveTask', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error saving task');
  }
}

export async function updateTask(token, task) {
  const response = await fetch('/api/updateTask', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error updating task');
  }
}

export async function deleteTask(token, taskId) {
  const response = await fetch('/api/deleteTask', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: taskId }),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error deleting task');
  }
}