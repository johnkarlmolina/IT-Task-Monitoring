export interface Task {
  id: number;
  title: string;
  date: string;
  time?: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

export type HolidayType = 'Regular' | 'SpecialNonWorking' | 'SpecialWorking' | 'Holiday';

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  type: HolidayType;
}

