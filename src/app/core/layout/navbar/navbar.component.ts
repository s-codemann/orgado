import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  router = inject(Router);
  navItems = signal(
    new Array(
      { title: 'home', link: '' },
      { title: 'Kalender', link: 'calendar' },
      {
        title: 'Aufgaben',
        link: 'tasks',
        children: [
          {
            title: 'Fällig',
            link: '',
            queryparams: { show: 'due-tasks' },
          },
          {
            title: 'Wiederholende',
            link: '',
            queryparams: { show: 'repeatable' },
          },
          {
            title: 'Einmalige',
            link: '',
            queryparams: { show: 'one-off' },
          },
          {
            title: 'Erledigt',
            link: '',
            queryparams: { show: 'completed' },
          },
        ],
      },
      { title: 'Projekte', link: 'projects' },
      { title: 'Ziele', link: 'objectives' }
    )
  );
  navigate(ev: MouseEvent, path: string, params?: any) {
    console.log('NAVIGATE');
    ev.stopPropagation();
    if (params) {
      this.router.navigate([path], { queryParams: params });
    } else {
      this.router.navigate([path]);
    }
    this.expanded.set(false);
  }
  expanded = signal(false);
  toggleExpanded() {
    this.expanded.update((v) => !v);
  }
}
