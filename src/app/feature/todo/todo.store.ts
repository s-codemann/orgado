import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { addEntity, setEntities, withEntities } from '@ngrx/signals/entities';
import { TodosService } from './todos.service';
import { computed, inject } from '@angular/core';

export type TTodo = {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
  title: string;
  repeatable: boolean | null;
  userId: number;
  due_date: string | null;
  due_time: string | null;
};
export type TTodosState = {
  todos: TTodo[];
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
  withEntities<TTodo>(),
  withMethods((store) => {
    const todosService = inject(TodosService);
    return {
      getTodos: () => {
        patchState(store, { loading: true });
        console.log('store: getting todos');
        todosService.getTodos(true).subscribe({
          next: (todos) => {
            console.log('TUDINEXT');
            console.log('tudi todos', todos);
            // setEntities(todos);
            // patchState(store, { todos });
            patchState(store, setEntities(todos));
            patchState(store, { loading: false });
            setTimeout(() => console.log('tudi', store.todos()), 5000);
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
      addTodo: (todo: TTodo) => patchState(store, addEntity(todo)),
    };
  }),
  withComputed((store) => {
    return {
      repeatableTodos: computed(
        () => {
          console.log('COMPUTE REPEATABLES: ', store.entities());
          return store.entities().filter((t) => t.repeatable);
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
