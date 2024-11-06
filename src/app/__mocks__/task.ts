import { Task } from '../features/task/model/task.model';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Ir na academia',
    isCompleted: false,
    categoryId: '5',
  },
  {
    id: '2',
    title: 'Comprar pão na padaria',
    isCompleted: true,
    categoryId: '1',
  },
];

export const task: Task = {
  id: '1',
  title: 'Ir na academia',
  isCompleted: false,
  categoryId: '5',
};
