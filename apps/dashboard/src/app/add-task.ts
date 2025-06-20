import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask } from './actions/tasks.actions';
import { Tasks } from './models/tasks.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectSessionRole } from './state/session/session.selectors';
import { Observable } from 'rxjs';

/**
 * AddTaskComponent - Component for creating new tasks.
 * 
 * Features:
 * - Form for adding new tasks with validation
 * - Role-based access control (Viewer role cannot add tasks)
 * - Automatic ID generation for new tasks
 * - Form reset after successful submission
 * 
 * Role-based functionality:
 * - Owner/Admin: Full access to add task form
 * - Viewer: Form is hidden with access denied message
 */
@Component({
  selector: 'app-add-task',
  template: `
    <div *ngIf="(role$ | async) !== 'Viewer'" class="add-task">
      <h3>Add New Task</h3>
      <p class="role-indicator">Current Role: {{ role$ | async }}</p>
      
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm" class="task-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            [(ngModel)]="newTask.title" 
            required
            class="form-input"
            placeholder="Enter task title">
        </div>
        
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="newTask.description"
            class="form-textarea"
            placeholder="Enter task description (optional)"></textarea>
        </div>
        
        <div class="form-group">
          <label for="status">Status:</label>
          <select 
            id="status" 
            name="status" 
            [(ngModel)]="newTask.status"
            class="form-select">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="assignedTo">Assigned To:</label>
          <input 
            type="text" 
            id="assignedTo" 
            name="assignedTo" 
            [(ngModel)]="newTask.assignedTo"
            class="form-input"
            placeholder="Enter assignee (optional)">
        </div>
        
        <button 
          type="submit" 
          [disabled]="!taskForm.form.valid"
          class="submit-btn">
          Add Task
        </button>
      </form>
    </div>
    
    <div *ngIf="(role$ | async) === 'Viewer'" class="add-task disabled">
      <h3>Add New Task</h3>
      <p class="disabled-message">Add task functionality is not available for Viewer role.</p>
      <p class="role-indicator">Current Role: {{ role$ | async }}</p>
    </div>
  `,
  styleUrls: ['./add-task.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddTaskComponent {
  /** Form data for the new task being created */
  newTask: Partial<Tasks> = {
    title: '',
    description: '',
    status: 'pending',
    completed: false,
    assignedTo: '',
    createdAt: new Date()
  };

  /** Observable of the current user's role from the session state */
  role$: Observable<'Owner' | 'Admin' | 'Viewer'> = this.store.select(selectSessionRole);

  /**
   * Constructor initializes the component with store dependencies
   * and sets up role change logging for debugging.
   * 
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) {
    this.role$.subscribe(role => {
      console.log('AddTaskComponent - Current role:', role);
    });
  }

  /**
   * Handles form submission for creating a new task.
   * Validates required fields and dispatches addTask action.
   * Resets form after successful submission.
   */
  onSubmit() {
    if (this.newTask.title) {
      const task: Tasks = {
        id: this.generateId(),
        title: this.newTask.title,
        description: this.newTask.description || '',
        status: this.newTask.status || 'pending',
        completed: typeof this.newTask.completed === 'boolean' ? this.newTask.completed : false,
        createdAt: new Date(),
        assignedTo: this.newTask.assignedTo || undefined
      };
      
      this.store.dispatch(addTask({ tasks: task }));
      
      // Reset form to initial state
      this.newTask = {
        title: '',
        description: '',
        status: 'pending',
        completed: false,
        assignedTo: '',
        createdAt: new Date()
      };
    }
  }

  /**
   * Generates a unique ID for new tasks.
   * Uses timestamp and random string for uniqueness.
   * 
   * @returns Unique string ID for the task
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 