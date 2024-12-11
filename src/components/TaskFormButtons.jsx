import { Show } from 'solid-js';

function TaskFormButtons(props) {
  const { loading, isEdit, onCancel } = props;

  return (
    <div class="flex space-x-4">
      <button
        type="submit"
        class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
          loading() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading()}
      >
        <Show when={loading()}>
          {isEdit ? 'Updating...' : 'Saving...'}
        </Show>
        <Show when={!loading()}>
          {isEdit ? 'Update Task' : 'Save Task'}
        </Show>
      </button>
      <button
        type="button"
        class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

export default TaskFormButtons;