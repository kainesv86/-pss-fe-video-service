import { Student } from './student';

export interface Booking {
  id: string;
  cost: number;
  student: Student;
}
