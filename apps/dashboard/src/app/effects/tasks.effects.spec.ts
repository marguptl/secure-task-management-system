import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TasksEffects } from './tasks.effects';

describe('TasksEffects', () => {
  let actions$: Observable<any>;
  let effects: TasksEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TasksEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TasksEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
