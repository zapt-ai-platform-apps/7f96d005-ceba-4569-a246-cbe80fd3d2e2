import { supabase } from '../supabaseClient';

export async function fetchTasks() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session.access_token;

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

export async function saveTask(task) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session.access_token;

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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error saving task');
  }
}

export async function updateTask(task) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session.access_token;

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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error updating task');
  }
}

export async function deleteTask(taskId) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session.access_token;

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