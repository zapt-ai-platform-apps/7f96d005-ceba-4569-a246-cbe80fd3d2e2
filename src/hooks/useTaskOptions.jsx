import { createSignal, onMount } from 'solid-js';
import { fetchTasks } from '../services/taskService';
import * as Sentry from '@sentry/browser';

function useTaskOptions() {
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
      Sentry.captureException(error);
      alert('An error occurred while fetching task options.');
    }
  });

  return {
    projectOptions,
    ownerOptions,
    companyOptions,
  };
}

export default useTaskOptions;