import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setRole } from './state/session/session.actions';
import { selectSessionRole } from './state/session/session.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

/**
 * RoleSwitcherComponent - Component for switching between user roles.
 * 
 * Features:
 * - Dropdown selector for role switching
 * - Real-time role display
 * - Role change logging for debugging
 * - Responsive design for all screen sizes
 * 
 * Available Roles:
 * - Owner: Full access to all features
 * - Admin: Full access to all features  
 * - Viewer: Read-only access to tasks
 */
@Component({
  selector: 'app-role-switcher',
  template: `
    <div class="role-switcher">
      <h3>Role Switcher</h3>
      <label for="role">Select Role:</label>
      <select 
        id="role" 
        (change)="switchRole($event)" 
        [value]="(role$ | async) || 'Owner'"
        class="role-select">
        <option value="Owner">Owner</option>
        <option value="Admin">Admin</option>
        <option value="Viewer">Viewer</option>
      </select>
      <p class="current-role">
        Current Role: <strong>{{ role$ | async }}</strong>
      </p>
    </div>
  `,
  styleUrls: ['./role-switcher.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RoleSwitcherComponent {
  /** Observable of the current user's role from the session state */
  role$: Observable<'Owner' | 'Admin' | 'Viewer'> = this.store.select(selectSessionRole);

  /**
   * Constructor initializes the component with store dependencies.
   * 
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) {}

  /**
   * Handles role switching when user selects a different role from dropdown.
   * Dispatches setRole action to update the session state.
   * Logs role changes for debugging purposes.
   * 
   * @param event - Change event from the select element
   */
  switchRole(event: Event) {
    const role = (event.target as HTMLSelectElement).value as 'Owner' | 'Admin' | 'Viewer';
    console.log('Switching role to:', role);
    this.store.dispatch(setRole({ role }));
  }
}
