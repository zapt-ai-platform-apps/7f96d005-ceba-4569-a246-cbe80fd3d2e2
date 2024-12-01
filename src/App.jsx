import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import { fetchTasks, saveTask, updateTask, deleteTask } from './services/taskService';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [token, setToken] = createSignal('');
  const [refreshTasks, setRefreshTasks] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [isEdit, setIsEdit] = createSignal(false);
  const [initialTask, setInitialTask] = createSignal(null);

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setToken(session.access_token);
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
        setToken(session.access_token);
      } else {
        setUser(null);
        setCurrentPage('login');
        setToken('');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
    setToken('');
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
      await deleteTask(token(), taskId);
      setRefreshTasks(true);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (task) => {
    setLoading(true);
    try {
      if (isEdit()) {
        await updateTask(token(), task);
      } else {
        await saveTask(token(), task);
      }
      setRefreshTasks(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await fetchTasks(token());
      // Use XLSX to write the tasksData to an Excel file
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
    } finally {
      setLoading(false);
    }
  };

  const handleShareTasks = async () => {
    try {
      const tasksData = await fetchTasks(token());
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
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-blue-900">
                Sign in with ZAPT
              </h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-blue-900">To Do List</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <button
            class="mb-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleAddTask}
          >
            Add New Task
          </button>

          <button
            class="mb-4 ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleExportTasks}
            disabled={loading()}
          >
            Export to Excel
          </button>

          <button
            class="mb-4 ml-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleShareTasks}
          >
            Share Tasks
          </button>

          <Show when={showForm()}>
            <TaskForm
              token={token()}
              onSubmit={handleSaveTask}
              onCancel={() => setShowForm(false)}
              isEdit={isEdit()}
              initialTask={initialTask()}
            />
          </Show>

          <TaskTable
            token={token()}
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
      </Show>
    </div>
  );
}

export default App;