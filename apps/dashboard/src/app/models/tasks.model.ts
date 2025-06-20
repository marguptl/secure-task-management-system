/**
 * Interface representing a task in the task management system.
 * Each task has required and optional properties that define its state and metadata.
 */
export interface Tasks {
  /** Unique identifier for the task, auto-generated when created */
  id: string;
  
  /** Required title/name of the task */
  title: string;
  
  /** Optional detailed description of the task */
  description?: string;
  
  /** Current status of the task - determines workflow stage */
  status: 'pending' | 'in-progress' | 'completed';
  
  /** Boolean flag indicating if the task has been marked as complete */
  completed: boolean;
  
  /** Timestamp when the task was created */
  createdAt: Date;
  
  /** Optional name of the person assigned to the task */
  assignedTo?: string;
}
