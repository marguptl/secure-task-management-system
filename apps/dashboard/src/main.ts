import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { tasksReducer } from './app/reducers/tasks.reducer';
import { sessionReducer } from './app/state/session/session.reducer';
import { reducers } from './app/reducers';
import { TaskEffects } from './app/effects/tasks.effects';
import { isDevMode } from '@angular/core';

/**
 * Application Bootstrap Configuration
 * 
 * This file configures and bootstraps the Angular application with:
 * - Router configuration for navigation
 * - NgRx store setup for state management
 * - Effects for handling side effects
 * - HTTP client for API communication
 * - Store devtools for development debugging
 * 
 * State Management Structure:
 * - tasksState: Manages task-related state (CRUD operations)
 * - session: Manages user session state (role, authentication)
 * - Additional reducers from the reducers index
 */
bootstrapApplication(App, {
  providers: [
    // Router configuration for navigation
    provideRouter(appRoutes),
    
    // HTTP client for API communication
    provideHttpClient(),
    
    // NgRx store configuration with all reducers
    provideStore({ 
      tasksState: tasksReducer, 
      session: sessionReducer,
      ...reducers 
    }),
    
    // NgRx effects for handling side effects
    provideEffects([TaskEffects]),
    
    // Store devtools for development debugging (only in dev mode)
    isDevMode() ? provideStoreDevtools() : []
  ]
}).catch((err) => console.error(err));
