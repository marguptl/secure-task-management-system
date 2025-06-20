import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { TaskListComponent } from './task-list';
import { RoleSwitcherComponent } from './role-switcher';
import { AddTaskComponent } from './add-task';
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { ThemeService } from './services/theme.service';

/**
 * AppComponent - Main application component.
 * 
 * Features:
 * - Serves as the root component for the task management application
 * - Integrates all major components (RoleSwitcher, AddTask, TaskList, ThemeToggle)
 * - Provides the main layout and structure
 * - Uses standalone component architecture
 * 
 * Component Structure:
 * - Header: RoleSwitcher and ThemeToggle
 * - AddTask: Middle section for creating new tasks
 * - TaskList: Bottom section for displaying and managing tasks
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [
    RouterModule, 
    TaskListComponent, 
    RoleSwitcherComponent, 
    AddTaskComponent,
    ThemeToggleComponent
  ],
  standalone: true
})
export class App {
  constructor(private themeService: ThemeService) {}
}
