import {
  effect,
  HostListener,
  inject,
  Injectable,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppLayoutService {
  backgroundColor = signal('var(--background-color)');
  firstColor = '#2b8de2';
  changeColor = 'green';
  adjustColor = effect(
    () => {
      const input = this.backgroundColor();
      if (input.includes('var')) {
        this.backgroundColor.set(
          getComputedStyle(document.documentElement).getPropertyValue(
            input.substring(input.indexOf('(') + 1, input.length - 1)
          )
        );
      }
      document.body.style.setProperty(
        '--background-color',
        this.backgroundColor()
      );
      document.head
        .querySelector('meta[name="theme-color"')
        ?.setAttribute('content', this.backgroundColor());
    },
    { allowSignalWrites: true }
  );
  fullScreen() {
    try {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      this.fullScreened = true;
    } catch {}
  }

  constructor() {}
  fullScreened = false;
}
