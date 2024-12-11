function TaskActions(props) {
  return (
    <div>
      <button
        class="mb-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        onClick={props.onAddTask}
      >
        Add New Task
      </button>

      <button
        class="mb-4 ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        onClick={props.onExportTasks}
        disabled={props.loading()}
      >
        Export to Excel
      </button>

      <button
        class="mb-4 ml-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        onClick={props.onShareTasks}
      >
        Share Tasks
      </button>
    </div>
  );
}

export default TaskActions;