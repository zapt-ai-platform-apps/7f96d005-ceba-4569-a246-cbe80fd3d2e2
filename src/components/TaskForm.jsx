import { createSignal, Show, onMount, For } from 'solid-js';
import { fetchTasks } from '../services/taskService';
import DataListInput from './DataListInput';
import SelectField from './SelectField';

function TaskForm(props) {
  const [task, setTask] = createSignal(
    props.initialTask || {
      taskDescription: '',
      priority: '',
      project: '',
      dueDate: '',
      status: '',
      owner: '',
      company: '',
    }
  );
  const [loading, setLoading] = createSignal(false);
  const [priorityOptions] = createSignal(['Low', 'Normal', 'High']);
  const [statusOptions] = createSignal(['Open', 'Closed']);
  const [projectOptions, setProjectOptions] = createSignal([]);
  const [ownerOptions, setOwnerOptions] = createSignal([]);
  const [companyOptions, setCompanyOptions] = createSignal([]);

  onMount(async () => {
    try {
      const tasksData = await fetchTasks();
      const projects = [
        ...new Set(tasksData.map((t) => t.project).filter(Boolean)),
      ];
      const owners = [
        ...new Set(tasksData.map((t) => t.owner).filter(Boolean)),
      ];
      const companies = [
        ...new Set(tasksData.map((t) => t.company).filter(Boolean)),
      ];
      setProjectOptions(projects);
      setOwnerOptions(owners);
      setCompanyOptions(companies);
    } catch (error) {
      console.error('Error fetching task options:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await props.onSubmit(task());
    setLoading(false);
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-bold mb-4 text-blue-900">
        {props.isEdit ? 'Edit Task' : 'Add New Task'}
      </h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <input
          type="text"
          placeholder="Task Description"
          value={task().taskDescription}
          onInput={(e) =>
            setTask({ ...task(), taskDescription: e.target.value })
          }
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />

        <SelectField
          label="Select Priority"
          value={() => task().priority}
          onInput={(e) =>
            setTask({ ...task(), priority: e.target.value })
          }
          options={priorityOptions}
        />

        <DataListInput
          placeholder="Project"
          value={() => task().project}
          onInput={(e) =>
            setTask({ ...task(), project: e.target.value })
          }
          options={projectOptions}
          dataListId="projectOptions"
        />

        <div>
          <label class="block text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={task().dueDate}
            onInput={(e) =>
              setTask({ ...task(), dueDate: e.target.value })
            }
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>

        <SelectField
          label="Select Status"
          value={() => task().status}
          onInput={(e) =>
            setTask({ ...task(), status: e.target.value })
          }
          options={statusOptions}
        />

        <DataListInput
          placeholder="Owner"
          value={() => task().owner}
          onInput={(e) =>
            setTask({ ...task(), owner: e.target.value })
          }
          options={ownerOptions}
          dataListId="ownerOptions"
        />

        <DataListInput
          placeholder="Company"
          value={() => task().company}
          onInput={(e) =>
            setTask({ ...task(), company: e.target.value })
          }
          options={companyOptions}
          dataListId="companyOptions"
        />

        <div class="flex space-x-4">
          <button
            type="submit"
            class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={loading()}>
              {props.isEdit ? 'Updating...' : 'Saving...'}
            </Show>
            <Show when={!loading()}>
              {props.isEdit ? 'Update Task' : 'Save Task'}
            </Show>
          </button>
          <button
            type="button"
            class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;