import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ChatService } from '../service/chat.service';

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState({
    groups: new Array(),
    activatedGroups: new Array(),
  }),
  withComputed((store) => {
    const chatService = inject(ChatService);
    return {
      activeGroups: computed(() => {
        // return 5;

        return store
          .groups()
          .filter((g) => store.activatedGroups().includes(g[0]));
      }),
    };
  }),
  withMethods((store) => {
    const chatService = inject(ChatService);
    const sb = chatService.getChatGroups()!();
    return {
      initialize: () => {
        chatService.getGroups().subscribe((groups: any) => {
          console.log('GOT GROUPS: ', groups);
          patchState(store, { groups: groups });
        });
        console.log('STORE GROUPS: ', sb);
      },
      activateGroup: (groupId: number) => {
        console.log('ACTIVATE GROUP: ', groupId);
        console.log(
          'ACGROUP before',
          store.activatedGroups(),
          store.activeGroups()
        );
        if (store.activatedGroups().includes(groupId)) return;
        patchState(store, {
          activatedGroups: [...store.activatedGroups(), groupId],
        });
        console.log(
          'ACGROUP AFTER',
          store.activatedGroups(),
          store.activeGroups()
        );
      },
      closeGroup: (groupId: number) => {
        const existingIndex = store.activatedGroups().indexOf(groupId);
        const newActiveGroups = [...store.activatedGroups()];
        newActiveGroups.splice(existingIndex, 1);
        patchState(store, { activatedGroups: newActiveGroups });
      },
    };
  })
);
