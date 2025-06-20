import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

/**
 * ThemeToggleComponent - Toggle between light and dark themes.
 * 
 * Features:
 * - Displays current theme state with appropriate icon
 * - Toggles between light and dark themes on click
 * - Smooth animations and hover effects
 * - Accessible with proper ARIA labels
 * - Responsive design
 * 
 * Usage:
 * <app-theme-toggle></app-theme-toggle>
 */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <button 
      (click)="toggleTheme()" 
      class="theme-toggle-btn"
      [title]="'Switch to ' + (isDarkMode ? 'light' : 'dark') + ' mode'"
      type="button">
      <svg 
        *ngIf="isDarkMode" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      <svg 
        *ngIf="!isDarkMode" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  `,
  styleUrls: ['./theme-toggle.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ThemeToggleComponent implements OnInit {
  /** Current theme state */
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 