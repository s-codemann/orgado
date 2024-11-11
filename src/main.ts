import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
window.addEventListener('beforeinstallprompt', (ev) => {
  console.log('before prompt', ev);
});
window.addEventListener('appinstalled', (ev) => {
  console.log('app installed', ev);
});
