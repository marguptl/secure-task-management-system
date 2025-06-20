import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

/**
 * ThemeService - Manages application theme state (dark/light mode)
 * 
 * Features:
 * - Toggle between light and dark themes
 * - Persist theme preference in localStorage
 * - Provide reactive theme state
 * - Apply theme classes to document body
 * - Keyboard shortcut support (Ctrl/Cmd + T)
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /** BehaviorSubject for current theme state */
  private themeSubject = new BehaviorSubject<Theme>('light');
  
  /** Observable of current theme */
  public theme$: Observable<Theme> = this.themeSubject.asObservable();
  
  /** Current theme value */
  public get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  constructor() {
    console.log('ThemeService constructor called');
    this.initializeTheme();
    console.log('ThemeService initialization completed');
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(initialTheme);
  }

  /**
   * Set the current theme and apply it to the document
   * @param theme - The theme to set ('light' or 'dark')
   */
  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyThemeToDocument(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  public toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme classes to document body
   * @param theme - The theme to apply
   */
  private applyThemeToDocument(theme: Theme): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    body.classList.add(`theme-${theme}`);
    
    // Set data attribute for CSS custom properties
    body.setAttribute('data-theme', theme);
  }

  /**
   * Check if system prefers dark mode
   * @returns Observable that emits when system preference changes
   */
  public getSystemThemePreference(): Observable<boolean> {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    return new Observable(observer => {
      const handler = (e: MediaQueryListEvent) => observer.next(e.matches);
      
      mediaQuery.addEventListener('change', handler);
      observer.next(mediaQuery.matches);
      
      return () => mediaQuery.removeEventListener('change', handler);
    });
  }
} 