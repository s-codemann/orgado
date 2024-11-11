export type Ttodo = {
  id: number;
  title: string;
  description: string | undefined;
  due_date?: Date;
};
export type TtodoCreate = Omit<Ttodo, 'id'>;
