import { Injectable } from '@nestjs/common';
// import { Task } from './entities/task.entity';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  role: 'admin' | 'user';
  description?: string;
}

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        { id: '1', title: 'Demo Task', description: 'Just a sample task', completed: false, role: 'admin' },
      ];
      

  findAll(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }
}
