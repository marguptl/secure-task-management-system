import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tasks } from './models/tasks.model';
import { selectAllTasks } from './state/tasks/tasks.selectors';
import { selectSessionRole } from './state/session/session.selectors';
import { deleteTask, toggleTaskComplete } from './actions/tasks.actions';
import { CommonModule } from '@angular/common';
import { EditTaskComponent } from './edit-task';
import { FormsModule } from '@angular/forms';

/**
 * TaskListComponent - Main component for displaying and managing tasks.
 * 
 * Features:
 * - Displays all tasks with role-based permissions
 * - Real-time search and filtering capabilities
 * - Task completion toggling with visual indicators
 * - Edit and delete functionality for authorized roles
 * - Responsive design for all screen sizes
 * 
 * Role-based functionality:
 * - Owner/Admin: Full CRUD operations + completion toggling
 * - Viewer: Read-only access with search/filter capabilities
 */
@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list">
      <h3>Task List</h3>
      <p class="role-indicator">Current Role: {{ role$ | async }}</p>
      
      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            [ngModel]="searchTermValue" 
            (ngModelChange)="searchTermValue = $event"
            placeholder="Search tasks..."
            class="search-input"
          >
        </div>
        <div class="filter-options">
          <select [ngModel]="statusFilterValue" (ngModelChange)="statusFilterValue = $event" class="filter-select">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select [ngModel]="completionFilterValue" (ngModelChange)="completionFilterValue = $event" class="filter-select">
            <option value="">All Tasks</option>
            <option value="completed">Completed Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
      </div>
      
      <div *ngIf="(filteredTasks$ | async)?.length; else noTasks" class="tasks-container">
        <div *ngFor="let task of filteredTasks$ | async" class="task-card" [class.completed]="task.completed">
          <div class="task-content">
            <div class="task-info">
              <div class="task-header">
                <div class="task-title-section">
                  <h4 class="task-title" [class.strikethrough]="task.completed">
                    {{ task.title }}
                    <span *ngIf="task.completed" class="completion-badge">✔️</span>
                  </h4>
                </div>
                <div *ngIf="(role$ | async) !== 'Viewer'" class="completion-toggle">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [checked]="task.completed"
                      (change)="toggleComplete(task.id)"
                      class="completion-checkbox"
                    >
                    <span class="checkmark"></span>
                    Mark Complete
                  </label>
                </div>
              </div>
              <p *ngIf="task.description" class="task-description" [class.strikethrough]="task.completed">
                {{ task.description }}
              </p>
              <div class="task-badges">
                <span class="badge status-badge" [class.completed-status]="task.status === 'completed'">
                  Status: {{ task.status }}
                </span>
                <span *ngIf="task.assignedTo" class="badge assignee-badge">
                  Assigned: {{ task.assignedTo }}
                </span>
                <span class="badge date-badge">
                  Created: {{ task.createdAt | date:'short' }}
                </span>
                <span *ngIf="task.completed" class="badge completion-indicator">
                  Completed
                </span>
              </div>
            </div>
            <div *ngIf="(role$ | async) !== 'Viewer'" class="task-actions">
              <button 
                (click)="startEdit(task)"
                class="action-btn edit-btn">
                Edit
              </button>
              <button 
                (click)="deleteTask(task.id)"
                class="action-btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ng-template #noTasks>
        <div class="no-tasks">
          <p *ngIf="searchTermValue || statusFilterValue || completionFilterValue">
            No tasks match your current filters. Try adjusting your search criteria.
          </p>
          <p *ngIf="!searchTermValue && !statusFilterValue && !completionFilterValue">
            No tasks available. Add a new task using the form above!
          </p>
        </div>
      </ng-template>
      
      <div class="task-summary">
        <p><strong>Current Role:</strong> {{ role$ | async }}</p>
        <p><strong>Total Tasks:</strong> {{ (tasks$ | async)?.length || 0 }}</p>
        <p><strong>Filtered Tasks:</strong> {{ (filteredTasks$ | async)?.length || 0 }}</p>
        <p><strong>Completed Tasks:</strong> {{ (completedTasksCount$ | async) || 0 }}</p>
        <p *ngIf="(role$ | async) === 'Viewer'" class="permission-info viewer">
          <small>Viewer permissions: Read-only access to tasks</small>
        </p>
        <p *ngIf="(role$ | async) === 'Admin'" class="permission-info admin">
          <small>Admin permissions: Full access to add, edit, and delete tasks</small>
        </p>
        <p *ngIf="(role$ | async) === 'Owner'" class="permission-info owner">
          <small>Owner permissions: Full access to add, edit, and delete tasks</small>
        </p>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <app-edit-task 
      [task]="editingTask" 
      [isEditing]="isEditing" 
      (editCancelled)="cancelEdit()">
    </app-edit-task>
  `,
  styleUrls: ['./task-list.css'],
  standalone: true,
  imports: [CommonModule, EditTaskComponent, FormsModule]
})
export class TaskListComponent {
  /** Observable of the current user's role from the session state */
  role$: Observable<'Owner' | 'Admin' | 'Viewer'> = this.store.select(selectSessionRole);
  
  /** Observable of all tasks from the store */
  tasks$: Observable<Tasks[]>;
  
  // Search and filter properties
  /** Current search term for filtering tasks */
  searchTerm: string = '';
  
  /** Current status filter value */
  statusFilter: string = '';
  
  /** Current completion filter value */
  completionFilter: string = '';
  
  // BehaviorSubjects for reactive filtering
  /** BehaviorSubject for search term changes */
  private searchTerm$ = new BehaviorSubject<string>('');
  
  /** BehaviorSubject for status filter changes */
  private statusFilter$ = new BehaviorSubject<string>('');
  
  /** BehaviorSubject for completion filter changes */
  private completionFilter$ = new BehaviorSubject<string>('');
  
  /** Observable of filtered tasks based on current search and filter criteria */
  filteredTasks$: Observable<Tasks[]>;
  
  /** Observable of the count of completed tasks */
  completedTasksCount$: Observable<number>;
  
  /** Currently selected task for editing */
  editingTask: Tasks | null = null;
  
  /** Flag indicating if edit modal is open */
  isEditing: boolean = false;

  /**
   * Constructor initializes the component with store dependencies
   * and sets up reactive filtering observables.
   * 
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) { 
    this.tasks$ = this.store.select(selectAllTasks);
    
    // Create filtered tasks observable with reactive filtering
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.searchTerm$,
      this.statusFilter$,
      this.completionFilter$
    ]).pipe(
      map(([tasks, search, status, completion]) => {
        let filtered = tasks;
        
        // Apply search filter across title, description, and assignee
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchLower) ||
            (task.description && task.description.toLowerCase().includes(searchLower)) ||
            (task.assignedTo && task.assignedTo.toLowerCase().includes(searchLower))
          );
        }
        
        // Apply status filter
        if (status) {
          filtered = filtered.filter(task => task.status === status);
        }
        
        // Apply completion filter
        if (completion === 'completed') {
          filtered = filtered.filter(task => task.completed);
        } else if (completion === 'pending') {
          filtered = filtered.filter(task => !task.completed);
        }
        
        return filtered;
      })
    );
    
    // Count completed tasks for summary display
    this.completedTasksCount$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.completed).length)
    );
  }

  // Getters and setters for reactive filtering
  /**
   * Getter for search term value
   * @returns Current search term
   */
  get searchTermValue(): string {
    return this.searchTerm;
  }

  /**
   * Setter for search term value - triggers reactive filtering
   * @param value - New search term
   */
  set searchTermValue(value: string) {
    this.searchTerm = value;
    this.searchTerm$.next(value);
  }

  /**
   * Getter for status filter value
   * @returns Current status filter
   */
  get statusFilterValue(): string {
    return this.statusFilter;
  }

  /**
   * Setter for status filter value - triggers reactive filtering
   * @param value - New status filter
   */
  set statusFilterValue(value: string) {
    this.statusFilter = value;
    this.statusFilter$.next(value);
  }

  /**
   * Getter for completion filter value
   * @returns Current completion filter
   */
  get completionFilterValue(): string {
    return this.completionFilter;
  }

  /**
   * Setter for completion filter value - triggers reactive filtering
   * @param value - New completion filter
   */
  set completionFilterValue(value: string) {
    this.completionFilter = value;
    this.completionFilter$.next(value);
  }

  /**
   * Dispatches action to delete a task from the system
   * @param id - ID of the task to delete
   */
  deleteTask(id: string) {
    this.store.dispatch(deleteTask({ id }));
  }

  /**
   * Dispatches action to toggle the completion status of a task
   * @param id - ID of the task to toggle
   */
  toggleComplete(id: string) {
    this.store.dispatch(toggleTaskComplete({ id }));
  }

  /**
   * Opens the edit modal for a specific task
   * @param task - Task object to edit
   */
  startEdit(task: Tasks) {
    this.editingTask = task;
    this.isEditing = true;
  }

  /**
   * Closes the edit modal and resets editing state
   */
  cancelEdit() {
    this.editingTask = null;
    this.isEditing = false;
  }
}
