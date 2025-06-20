import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateTask } from './actions/tasks.actions';
import { Tasks } from './models/tasks.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectSessionRole } from './state/session/session.selectors';
import { Observable } from 'rxjs';

/**
 * EditTaskComponent - Modal component for editing existing tasks.
 * 
 * Features:
 * - Modal dialog for editing task properties
 * - Role-based access control (Viewer role cannot edit)
 * - Form validation and error handling
 * - Automatic form population with existing task data
 * 
 * Role-based functionality:
 * - Owner/Admin: Full access to edit task form
 * - Viewer: Access denied message with close button only
 */
@Component({
  selector: 'app-edit-task',
  template: `
    <div *ngIf="isEditing" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Task</h3>
        
        <div *ngIf="(role$ | async) === 'Viewer'" class="access-denied">
          <strong>Access Denied:</strong> Viewers cannot edit tasks. Please switch to Owner or Admin role.
        </div>
        
        <form *ngIf="(role$ | async) !== 'Viewer'" (ngSubmit)="onSubmit()" #editForm="ngForm" class="edit-form">
          <div class="form-group">
            <label for="editTitle">Title:</label>
            <input 
              type="text" 
              id="editTitle" 
              name="title" 
              [(ngModel)]="editedTask.title" 
              required
              class="form-input"
              placeholder="Enter task title">
          </div>
          
          <div class="form-group">
            <label for="editDescription">Description:</label>
            <textarea 
              id="editDescription" 
              name="description" 
              [(ngModel)]="editedTask.description"
              class="form-textarea"
              placeholder="Enter task description (optional)"></textarea>
          </div>
          
          <div class="form-group">
            <label for="editStatus">Status:</label>
            <select 
              id="editStatus" 
              name="status" 
              [(ngModel)]="editedTask.status"
              class="form-select">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="editAssignedTo">Assigned To:</label>
            <input 
              type="text" 
              id="editAssignedTo" 
              name="assignedTo" 
              [(ngModel)]="editedTask.assignedTo"
              class="form-input"
              placeholder="Enter assignee (optional)">
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="editCompleted" 
                name="completed" 
                [(ngModel)]="editedTask.completed"
                class="form-checkbox">
              <span class="checkmark"></span>
              Mark as Completed
            </label>
          </div>
          
          <div class="modal-actions">
            <button 
              type="button" 
              (click)="cancelEdit()"
              class="btn btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!editForm.form.valid"
              class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
        
        <div *ngIf="(role$ | async) === 'Viewer'" class="modal-actions">
          <button 
            type="button" 
            (click)="cancelEdit()"
            class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./edit-task.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditTaskComponent {
  /** Input property for the task to be edited */
  @Input() task: Tasks | null = null;
  
  /** Input property to control modal visibility */
  @Input() isEditing: boolean = false;
  
  /** Output event emitted when edit is cancelled */
  @Output() editCancelled = new EventEmitter<void>();

  /** Form data for the task being edited */
  editedTask: Partial<Tasks> = {};
  
  /** Observable of the current user's role from the session state */
  role$: Observable<'Owner' | 'Admin' | 'Viewer'> = this.store.select(selectSessionRole);

  /**
   * Constructor initializes the component with store dependencies.
   * 
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) {}

  /**
   * Lifecycle hook that runs when input properties change.
   * Populates the edit form with existing task data when editing starts.
   */
  ngOnChanges() {
    if (this.task && this.isEditing) {
      this.editedTask = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        assignedTo: this.task.assignedTo || '',
        completed: this.task.completed || false
      };
    }
  }

  /**
   * Handles form submission for updating an existing task.
   * Validates required fields and dispatches updateTask action.
   * Closes modal and emits cancellation event.
   */
  onSubmit() {
    if (this.task && this.editedTask.title) {
      const changes: Partial<Tasks> = {
        title: this.editedTask.title,
        description: this.editedTask.description || '',
        status: this.editedTask.status || 'pending',
        assignedTo: this.editedTask.assignedTo || undefined,
        completed: this.editedTask.completed || false
      };
      
      this.store.dispatch(updateTask({ 
        tasks: { 
          id: this.task.id, 
          changes 
        } 
      }));
      
      this.isEditing = false;
      this.editCancelled.emit();
    }
  }

  /**
   * Handles modal cancellation.
   * Closes modal and emits cancellation event.
   */
  cancelEdit() {
    this.isEditing = false;
    this.editCancelled.emit();
  }
} 