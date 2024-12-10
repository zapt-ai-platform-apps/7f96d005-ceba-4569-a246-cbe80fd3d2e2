function TaskRow(props) {
  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.id}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.taskDescription}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.priority}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.project}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.dueDate ? new Date(props.task.dueDate).toLocaleDateString() : ''}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.status}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.owner}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        {props.task.company}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
          onClick={() => props.onEdit(props.task)}
        >
          Edit
        </button>
        {' | '}
        <button
          class="text-red-600 hover:text-red-900 cursor-pointer"
          onClick={() => props.onDelete(props.task.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;