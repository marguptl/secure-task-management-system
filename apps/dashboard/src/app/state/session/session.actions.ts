import { createAction, props } from '@ngrx/store';

export const setRole = createAction(
  '[Session] Set Role',
  props<{ role: 'Owner' | 'Admin' | 'Viewer' }>()
);
