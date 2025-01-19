import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {makeServer} from './app/server/mirage-server';

makeServer();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error());


