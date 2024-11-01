import { Component, HostBinding, Input } from '@angular/core';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input({ alias: 'title' }) title: string | undefined;
  @Input({ alias: 'maxWidth' }) maxWidth = '400px';
  @HostBinding('style.maxWidth') mWidth = this.maxWidth;
  @Input({ alias: 'backgroundColor' })
  backgroundColor: string = 'var(--accent-100)';
  @Input({ alias: 'content', required: true }) content?: string;
}
