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
  setEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { TTodoOccurance } from './model/todo.type';
import { computed, inject } from '@angular/core';
import { TodosService } from './todos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export const TodoOccurancesStore = signalStore(
  { providedIn: 'root' },
  withState({}),
  withEntities<TTodoOccurance>(),
  withComputed((store) => {
    const refreshIntv = toSignal(interval(30000));
    return {
      dueOccurances: computed(() => {
        refreshIntv();
        const occurances = store.entities();
        return occurances.filter(
          (occurance) =>
            !occurance.occurance.completed_at &&
            new Date(occurance.occurance.due_at).getTime() < Date.now()
        );
      }),
      completedOccurances: computed(() => {
        const completed = store
          .entities()
          .filter((occurance) => occurance.occurance.completed_at);
        console.log('COMPLETED OCCURANCES: ', completed, store.entities());
        return completed;
      }),
    };
  }),
  withMethods((store) => {
    const todosService = inject(TodosService);
    return {
      addTodoOccurance: (todoOccurance: TTodoOccurance) => {
        patchState(store, addEntity(todoOccurance));
      },
      completeTodo: function (todo_id: number) {
        todosService.markTodoOccuranceComplete(todo_id).subscribe({
          next: (t) => {
            console.log('COMPETETODO NEXT BLOCK');
            this.markCompleted(todo_id, t.body);
          },
          error: () => null,
        });
      },
      markCompleted: (occuranceId: number, timestamp: any) => {
        console.log('markCompleted running', occuranceId);
        return patchState(
          store,
          updateEntity({
            id: occuranceId as EntityId,
            changes: (oc) => ({
              occurance: { ...oc.occurance, completed_at: timestamp },
            }),
          })
        );
      },
      loadOccurances: () => {
        todosService.getTodoOccurances().subscribe((occurances) => {
          console.log('STORE GOT OCCURANCES: ', occurances);
          patchState(store, setEntities(occurances));
        });
      },
    };
  }),
  withHooks((store) => ({
    onInit: () => store.loadOccurances(),
  }))
);
