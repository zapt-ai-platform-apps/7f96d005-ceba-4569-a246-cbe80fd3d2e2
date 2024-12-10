import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { fetchTasks } from '../services/taskService';
import TaskRow from './TaskRow';
import TaskTableHeader from './TaskTableHeader';

function TaskTable(props) {
  const [tasks, setTasks] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [filter, setFilter] = createSignal('');

  const getTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    getTasks();
  });

  createEffect(() => {
    if (props.refresh()) {
      getTasks();
      props.setRefresh(false);
    }
  });

  const filteredTasks = () =>
    tasks().filter((task) =>
      task.taskDescription.toLowerCase().includes(filter().toLowerCase())
    );

  return (
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-blue-900">Task List</h2>
      <input
        class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        type="text"
        placeholder="Filter tasks"
        value={filter()}
        onInput={(e) => setFilter(e.target.value)}
      />
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <TaskTableHeader />
          <tbody class="bg-white divide-y divide-gray-200">
            <For each={filteredTasks()}>
              {(task) => (
                <TaskRow task={task} onEdit={props.onEdit} onDelete={props.onDelete} />
              )}
            </For>
          </tbody>
        </table>
      </div>
      <Show when={loading()}>
        <div class="text-center mt-4">Loading...</div>
      </Show>
    </div>
  );
}

export default TaskTable;