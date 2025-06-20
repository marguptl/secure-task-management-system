import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as TaskActions from '../actions/tasks.actions';
import { Tasks } from '../models/tasks.model';


@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.http.get<Tasks[]>('http://localhost:3000/tasks', {
          headers: { 'x-user-id': '1' } // simulate logged-in user
        }).pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks: tasks })),
          catchError(error => of(TaskActions.loadTasksFailure({ error })))
        )
      )
    )
  );
}
