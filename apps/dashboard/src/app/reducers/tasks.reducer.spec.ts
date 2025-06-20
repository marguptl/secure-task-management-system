import { tasksReducer, initialState, TasksState } from './tasks.reducer';
import * as TasksActions from '../actions/tasks.actions';
import { Tasks } from '../models/tasks.model';

describe('Tasks Reducer', () => {
  let state: TasksState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const result = tasksReducer(undefined, { type: 'UNKNOWN' });
      expect(result).toEqual(initialState);
    });

    it('should have empty tasks array and null error', () => {
      expect(state.tasks).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('addTask', () => {
    it('should add a new task to the state', () => {
      const newTask: Tasks = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John Doe'
      };

      const action = TasksActions.addTask({ tasks: newTask });
      const result = tasksReducer(state, action);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0]).toEqual(newTask);
      expect(result.error).toBeNull();
    });

    it('should add multiple tasks to the state', () => {
      const task1: Tasks = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John'
      };

      const task2: Tasks = {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'in-progress',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'Jane'
      };

      // Add first task
      let result = tasksReducer(state, TasksActions.addTask({ tasks: task1 }));
      expect(result.tasks).toHaveLength(1);

      // Add second task
      result = tasksReducer(result, TasksActions.addTask({ tasks: task2 }));
      expect(result.tasks).toHaveLength(2);
      expect(result.tasks[0]).toEqual(task1);
      expect(result.tasks[1]).toEqual(task2);
    });
  });

  describe('deleteTask', () => {
    it('should remove a task from the state', () => {
      // First add a task
      const task: Tasks = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John Doe'
      };

      state = tasksReducer(state, TasksActions.addTask({ tasks: task }));
      expect(state.tasks).toHaveLength(1);

      // Then delete it
      const result = tasksReducer(state, TasksActions.deleteTask({ id: '1' }));
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBeNull();
    });

    it('should not affect other tasks when deleting a specific task', () => {
      const task1: Tasks = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John'
      };

      const task2: Tasks = {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'in-progress',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'Jane'
      };

      // Add both tasks
      state = tasksReducer(state, TasksActions.addTask({ tasks: task1 }));
      state = tasksReducer(state, TasksActions.addTask({ tasks: task2 }));
      expect(state.tasks).toHaveLength(2);

      // Delete only task1
      const result = tasksReducer(state, TasksActions.deleteTask({ id: '1' }));
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0]).toEqual(task2);
    });
  });

  describe('toggleTaskComplete', () => {
    it('should toggle the completed status of a task', () => {
      const task: Tasks = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John Doe'
      };

      // Add task
      state = tasksReducer(state, TasksActions.addTask({ tasks: task }));
      expect(state.tasks[0].completed).toBe(false);

      // Toggle to completed
      let result = tasksReducer(state, TasksActions.toggleTaskComplete({ id: '1' }));
      expect(result.tasks[0].completed).toBe(true);

      // Toggle back to not completed
      result = tasksReducer(result, TasksActions.toggleTaskComplete({ id: '1' }));
      expect(result.tasks[0].completed).toBe(false);
    });

    it('should not affect other tasks when toggling completion', () => {
      const task1: Tasks = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John'
      };

      const task2: Tasks = {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'in-progress',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'Jane'
      };

      // Add both tasks
      state = tasksReducer(state, TasksActions.addTask({ tasks: task1 }));
      state = tasksReducer(state, TasksActions.addTask({ tasks: task2 }));

      // Toggle only task1
      const result = tasksReducer(state, TasksActions.toggleTaskComplete({ id: '1' }));
      expect(result.tasks[0].completed).toBe(true);
      expect(result.tasks[1].completed).toBe(false);
    });
  });

  describe('updateTask', () => {
    it('should update specific fields of a task', () => {
      const task: Tasks = {
        id: '1',
        title: 'Original Title',
        description: 'Original Description',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John Doe'
      };

      // Add task
      state = tasksReducer(state, TasksActions.addTask({ tasks: task }));

      // Update task
      const changes = {
        title: 'Updated Title',
        status: 'completed' as const,
        completed: true
      };

      const result = tasksReducer(state, TasksActions.updateTask({ 
        tasks: { id: '1', changes } 
      }));

      expect(result.tasks[0].title).toBe('Updated Title');
      expect(result.tasks[0].status).toBe('completed');
      expect(result.tasks[0].completed).toBe(true);
      expect(result.tasks[0].description).toBe('Original Description'); // Should remain unchanged
      expect(result.tasks[0].assignedTo).toBe('John Doe'); // Should remain unchanged
    });
  });

  describe('clearTasks', () => {
    it('should clear all tasks from the state', () => {
      const task1: Tasks = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'John'
      };

      const task2: Tasks = {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'in-progress',
        completed: false,
        createdAt: new Date(),
        assignedTo: 'Jane'
      };

      // Add tasks
      state = tasksReducer(state, TasksActions.addTask({ tasks: task1 }));
      state = tasksReducer(state, TasksActions.addTask({ tasks: task2 }));
      expect(state.tasks).toHaveLength(2);

      // Clear all tasks
      const result = tasksReducer(state, TasksActions.clearTasks());
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBeNull();
    });
  });
});
