import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  EntityId,
  removeEntity,
  setEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { TodosService } from './todos.service';
import { computed, inject } from '@angular/core';
import { ScheduleService } from '../../shared/cron/schedule.service';
import { TodoDataService } from './services/todo-data.service';

export type TTodo = {
  id: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  title: string;
  repeatable: boolean;
  userId: number;
  due_date: Date | null;
  due_time: string | null;
};
export type TTodoWithSchedule = TTodo & {
  repeatable: true;
  repeatableTodoSchedules: any;
};
export type TTodoWithNextDue = TTodoWithSchedule & {
  nextDue: Date;
};
export type TTodosState = {
  todos: TTodo | TTodoWithSchedule[];
  loading: boolean;
  error: null;
};

const initialState: TTodosState = {
  todos: new Array(),
  loading: false,
  error: null,
};

export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<TTodo | TTodoWithSchedule>(),
  withMethods((store) => {
    const todosService = inject(TodoDataService);
    const scheduleService = inject(ScheduleService);
    return {
      getTodos: () => {
        patchState(store, { loading: true });
        console.log('store: getting todos');
        todosService.getTodos(true).subscribe({
          next: (todos) => {
            patchState(store, setEntities(todos));
            patchState(store, { loading: false });
          },
          error: (err) => {
            console.log('TUDIERR');
            patchState(store, { error: err });
          },
          complete: () => {
            console.log('TUDICOMP');
            patchState(store, { loading: false });
          },
        });
      },
      addTodo: (todo: TTodo) => {
        patchState(store, addEntity(todo));
        store.entities().sort((a, b) => {
          return new Date(a.created_at).getTime() >
            new Date(b.created_at).getTime()
            ? -1
            : 1;
        });
      },
      getTodo: (todoId: number) => {},
      updateAfterDue: (todo: TTodoWithSchedule) => {
        patchState(
          store,
          updateEntity({
            id: todo.id as EntityId,
            changes: {
              //@ts-ignore
              repeatableTodoSchedules: [
                ...todo.repeatableTodoSchedules.schedules,
              ],
            },
          })
        );
      },
      removeTodo: (todoId: number) => {
        patchState(store, removeEntity(todoId));
      },
      updateTodo: (todo: TTodo | TTodoWithNextDue) => {
        patchState(store, setEntity(todo));
      },
    };
  }),
  withComputed((store) => {
    const schedulesService = inject(ScheduleService);
    return {
      repeatableTodos: computed(
        () => {
          console.log('NEW TODO SET: ', store.entities());
          const repeatables = store
            .entities()
            .filter((t) => t.repeatable) as TTodoWithSchedule[];
          const withNextDue = repeatables.map((r) => {
            return {
              ...r,
              repeatableTodoSchedules: {
                schedules: r.repeatableTodoSchedules,
                nextDue: schedulesService.getNextDue(r),
              },
            };
            // const schedule = schedulesService.parseCronSchedule(
            //   r.schedule.cron_schedule
            // );
            // console.log('MAP DUE SCHEDULE: ', schedule);
            // return {
            //   ...r,
            //   schedule: { ...r.schedule, nextDue: schedule.next()!.toDate() },
            // };
          });
          console.log('GOT REPEATABLES:', withNextDue);
          //   console.log('COMPUTE REPEATABLES: ', );
          return withNextDue as TTodoWithNextDue[];
        }

        // store.todos().filter((t) => t.repeatable)
      ),
      oneOffTodos: computed(() => {
        console.log(
          'ONE OFF: ',
          store.entities().filter((t) => !t.repeatable)
        );
        return store.entities().filter((t) => !t.repeatable);
      }),
    };
  }),
  withHooks((store) => {
    return { onInit: () => {} };
  })
);
