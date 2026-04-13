export interface Task {
  id: number;
  title: string;
  date: string;
  time?: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

