import { createSignal, createEffect } from 'solid-js';
import TaskFormFields from './TaskFormFields';
import TaskFormButtons from './TaskFormButtons';
import useTaskOptions from '../hooks/useTaskOptions';
import * as Sentry from '@sentry/browser';

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

  // Update the task signal whenever props.initialTask changes
  createEffect(() => {
    setTask(
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
  });

  const [loading, setLoading] = createSignal(false);

  const { projectOptions, ownerOptions, companyOptions } = useTaskOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await props.onSubmit(task());
    } catch (error) {
      console.error('Error submitting task:', error);
      Sentry.captureException(error);
      alert('An error occurred while submitting the task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-bold mb-4 text-blue-900">
        {props.isEdit ? 'Edit Task' : 'Add New Task'}
      </h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <TaskFormFields
          task={task}
          setTask={setTask}
          projectOptions={projectOptions}
          ownerOptions={ownerOptions}
          companyOptions={companyOptions}
        />
        <TaskFormButtons
          loading={loading}
          isEdit={props.isEdit}
          onCancel={props.onCancel}
        />
      </form>
    </div>
  );
}

export default TaskForm;