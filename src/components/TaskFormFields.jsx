import DataListInput from './DataListInput';
import SelectField from './SelectField';
import { priorityOptions, statusOptions } from '../constants/taskConstants';

function TaskFormFields(props) {
  const { task, setTask, projectOptions, ownerOptions, companyOptions } = props;

  return (
    <>
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
        onInput={(e) => setTask({ ...task(), priority: e.target.value })}
        options={priorityOptions}
      />

      <DataListInput
        placeholder="Project"
        value={() => task().project}
        onInput={(e) => setTask({ ...task(), project: e.target.value })}
        options={projectOptions}
        dataListId="projectOptions"
      />

      <div>
        <label class="block text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          value={task().dueDate}
          onInput={(e) => setTask({ ...task(), dueDate: e.target.value })}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        />
      </div>

      <SelectField
        label="Select Status"
        value={() => task().status}
        onInput={(e) => setTask({ ...task(), status: e.target.value })}
        options={statusOptions}
      />

      <DataListInput
        placeholder="Owner"
        value={() => task().owner}
        onInput={(e) => setTask({ ...task(), owner: e.target.value })}
        options={ownerOptions}
        dataListId="ownerOptions"
      />

      <DataListInput
        placeholder="Company"
        value={() => task().company}
        onInput={(e) => setTask({ ...task(), company: e.target.value })}
        options={companyOptions}
        dataListId="companyOptions"
      />
    </>
  );
}

export default TaskFormFields;