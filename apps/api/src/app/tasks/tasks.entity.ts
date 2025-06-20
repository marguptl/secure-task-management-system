export class Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    ownerId: string; // to link task to a user
  }
  