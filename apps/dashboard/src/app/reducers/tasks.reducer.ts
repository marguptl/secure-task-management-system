import { createReducer, on } from '@ngrx/store';
import * as TasksActions from '../actions/tasks.actions';
import { Tasks as Task } from '../models/tasks.model';

/**
 * Interface defining the structure of the tasks state in the NgRx store.
 * Contains the array of tasks and any error information.
 */
export interface TasksState {
  /** Array of all tasks in the system */
  tasks: Task[];
  /** Error information if any operation fails */
  error: any;
}

/**
 * Initial state for the tasks reducer.
 * Starts with an empty task array and no errors.
 */
export const initialState: TasksState = {
  tasks: [],
  error: null,
};

/**
 * NgRx reducer for managing tasks state.
 * Handles all task-related actions and updates the state accordingly.
 * Uses pure functions to ensure predictable state changes.
 */
export const tasksReducer = createReducer(
  initialState,
  
  // Handle successful task loading
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    error: null,
  })),
  
  // Handle task loading failures
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  
  // Handle adding a new task
  on(TasksActions.addTask, (state, { tasks }) => ({
    ...state,
    tasks: [...state.tasks, tasks],
    error: null,
  })),
  
  // Handle deleting a task
  on(TasksActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    error: null,
  })),
  
  // Handle updating an existing task
  on(TasksActions.updateTask, (state, { tasks }) => ({
    ...state,
    tasks: state.tasks.map(task => 
      task.id === tasks.id ? { ...task, ...tasks.changes } : task
    ),
    error: null,
  })),
  
  // Handle toggling task completion status
  on(TasksActions.toggleTaskComplete, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ),
    error: null,
  })),
  
  // Handle clearing all tasks
  on(TasksActions.clearTasks, (state) => ({
    ...state,
    tasks: [],
    error: null,
  }))
);
