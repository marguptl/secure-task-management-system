import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from '../../reducers/tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasksState');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state: TasksState) => state.tasks
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state: TasksState) => state.error
);
