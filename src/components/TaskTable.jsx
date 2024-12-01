import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { fetchTasks } from '../services/taskService';

function TaskTable(props) {
  const [tasks, setTasks] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [filter, setFilter] = createSignal('');

  const getTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await fetchTasks(props.token);
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
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Task List</h2>
      <input
        class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        type="text"
        placeholder="Filter tasks"
        value={filter()}
        onInput={(e) => setFilter(e.target.value)}
      />
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Reference
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th class="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <For each={filteredTasks()}>
              {(task) => (
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.id}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.taskDescription}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.priority}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.project}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.status}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.owner}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {task.company}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      onClick={() => props.onEdit(task)}
                    >
                      Edit
                    </button>
                    {' | '}
                    <button
                      class="text-red-600 hover:text-red-900 cursor-pointer"
                      onClick={() => props.onDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
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