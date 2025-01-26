import { Component, input, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  host: { '[style.backgroundColor]': 'background()' },
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  background = input('var(--primary-900)');
}
