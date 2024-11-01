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
  backgroundColor = signal('var(--primary-500)');
  firstColor = '#2b8de2';
  changeColor = 'green';
  adjustColor = effect(
    () => {
      const input = this.backgroundColor();
      if (input.includes('var')) {
        console.log(
          getComputedStyle(document.documentElement).getPropertyValue(
            this.backgroundColor()
          ),
          input.substring(input.indexOf('(') + 1, input.length - 1)
        );

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
    if (this.fullScreened) {
      console.log('listener removed', document.body);
    }
    console.log('DBL');
    try {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      this.fullScreened = true;
    } catch {}
  }

  constructor() {
    // document.body.onclick = this.fullScreen;
  }
  fullScreened = false;
}
