import { createAction, props } from '@ngrx/store';
import { Tasks } from '../models/tasks.model';

/**
 * Action to initiate loading of all tasks from the backend
 * Dispatched when the application starts or when tasks need to be refreshed
 */
export const loadTasks = createAction('[Tasks] Load Tasks');

/**
 * Action dispatched when tasks are successfully loaded from the backend
 * Contains the array of tasks retrieved from the server
 */
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Tasks[] }>()
);

/**
 * Action to add a new task to the system
 * Dispatched when a user creates a new task through the add task form
 */
export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ tasks: Tasks }>()
);

/**
 * Action to update an existing task
 * Dispatched when a user edits a task through the edit task modal
 * Uses partial updates to only modify specific fields
 */
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ tasks: { id: string, changes: Partial<Tasks> } }>()
);

/**
 * Action to toggle the completion status of a task
 * Dispatched when a user clicks the completion checkbox
 * Automatically toggles between true/false
 */
export const toggleTaskComplete = createAction(
  '[Tasks] Toggle Task Complete',
  props<{ id: string }>()
);

/**
 * Action to delete a task from the system
 * Dispatched when a user confirms task deletion
 */
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

/**
 * Action dispatched when loading tasks fails
 * Contains error information for debugging and user feedback
 */
export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: any }>()
);

/**
 * Action to clear all tasks from the store
 * Useful for cleanup or when switching contexts
 */
export const clearTasks = createAction('[Tasks] Clear All');
