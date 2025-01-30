import { TTodo } from '../todo.store';

export type Ttodo = {
  id: number;
  title: string;
  description: string | undefined;
  due_date?: Date;
};
export type TtodoCreate = Omit<Ttodo, 'id'>;
export type TTodoOccuranceData = {
  id: number;
  todo_id: number;
  completed_at: string;
  due_at: string;
};
export type TTodoOccurance = {
  id: number;
  todo: TTodo;
  occurance: TTodoOccuranceData;
};
