import { createReducer, on } from '@ngrx/store';
import { setRole } from './session.actions';

export interface SessionState {
  role: 'Owner' | 'Admin' | 'Viewer' | null;
}

export const initialState: SessionState = {
  role: 'Owner', // Set default role to Owner
};

export const sessionReducer = createReducer(
  initialState,
  on(setRole, (state, { role }) => ({
    ...state,
    role
  }))
);
