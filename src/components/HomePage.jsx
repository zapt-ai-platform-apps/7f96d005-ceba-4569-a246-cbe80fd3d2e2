import { createSignal, Show } from 'solid-js';
import { supabase } from '../supabaseClient';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TaskForm from './TaskForm';
import TaskTable from './TaskTable';
import {
  fetchTasks,
  saveTask,
  updateTask,
  deleteTask,
} from '../services/taskService';
import * as Sentry from '@sentry/browser';
import Header from './Header';
import TaskActions from './TaskActions';

function HomePage() {
  const [loading, setLoading] = createSignal(false);
  const [refreshTasks, setRefreshTasks] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [initialTask, setInitialTask] = createSignal(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddTask = () => {
    setShowForm(true);
    setIsEdit(false);
    setInitialTask({
      taskDescription: '',
      priority: '',
      project: '',
      dueDate: '',
      status: '',
      owner: '',
      company: '',
    });
  };

  const handleEditTask = (task) => {
    setShowForm(true);
    setIsEdit(true);
    setInitialTask(task);
  };

  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    try {
      await deleteTask(taskId);
      setRefreshTasks(true);
    } catch (error) {
      console.error('Error deleting task:', error);
      Sentry.captureException(error);
      alert('An error occurred while deleting the task.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (task) => {
    setLoading(true);
    try {
      if (isEdit()) {
        await updateTask(task);
      } else {
        await saveTask(task);
      }
      setRefreshTasks(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving task:', error);
      Sentry.captureException(error);
      alert('Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await fetchTasks();
      const ws = XLSX.utils.json_to_sheet(tasksData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        'tasks.xlsx'
      );
    } catch (error) {
      console.error('Error exporting tasks:', error);
      Sentry.captureException(error);
      alert('An error occurred while exporting tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareTasks = async () => {
    try {
      const tasksData = await fetchTasks();
      const taskDescriptions = tasksData.map(
        (task) => `${task.id}: ${task.taskDescription}`
      );
      const shareText = taskDescriptions.join('\n');
      if (navigator.share) {
        await navigator.share({
          title: 'My Tasks',
          text: shareText,
        });
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } catch (error) {
      console.error('Error sharing tasks:', error);
      Sentry.captureException(error);
      alert('An error occurred while sharing tasks.');
    }
  };

  return (
    <div class="max-w-6xl mx-auto">
      <Header onSignOut={handleSignOut} />

      <TaskActions
        loading={loading}
        onAddTask={handleAddTask}
        onExportTasks={handleExportTasks}
        onShareTasks={handleShareTasks}
      />

      <Show when={showForm()}>
        <TaskForm
          onSubmit={handleSaveTask}
          onCancel={() => setShowForm(false)}
          isEdit={isEdit()}
          initialTask={initialTask()}
        />
      </Show>

      <TaskTable
        refresh={refreshTasks}
        setRefresh={setRefreshTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <div class="mt-8 text-center">
        <a
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          class="text-purple-600 hover:underline"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default HomePage;