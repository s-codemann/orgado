import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { buffer, map, switchAll, switchMap } from 'rxjs';
import { AppLayoutService } from './service/app-layout.service';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private layoutService: AppLayoutService) {}
  httpClient = inject(HttpClient);
  todos$ = this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
  title = 'orgado';
  isFullScreen = false;
  // requestFullScreen = () => {
  //   document.body.requestFullscreen();
  //   this.isFullScreen = true;
  //   if (this.isFullScreen) {
  //     window.removeEventListener('pointerdown', this.requestFullScreen);
  //   }
  // };
  f() {
    document.documentElement.requestFullscreen({ navigationUI: 'hide' });
  }
  ngOnInit(): void {
    this.todos$.pipe().subscribe((val) => {
      console.log(val);
    });
    // setTimeout(() => {
    // document.querySelector('button')?.click();
    //   console.log(
    //     'COLOR:',
    //     document.head
    //       .querySelector('meta[name="theme-color"')
    //       ?.setAttribute('content', '#ffffff')
    //   );
    // }, 2000);
    const ev = new Event('beforeinstallprompt');
    // window.addEventListener('pointerdown', this.requestFullScreen);
    // setTimeout(() => {
    //   window.dispatchEvent(ev);
    // }, 2000);
    // document.body.addEventListener('click', () => {});
  }
}
