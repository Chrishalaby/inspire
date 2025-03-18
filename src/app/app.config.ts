import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { routes } from './app.routes';
import { PrimengPreset } from './primeng.preset';
import { CasesState } from './state/cases/cases.state';
import { NavigationState } from './state/navigation/navigation.state';
import { AppState } from './store/app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      NgxsModule.forRoot([NavigationState, CasesState, AppState], {
        developmentMode: true,
      }),
      ToastModule
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: PrimengPreset,
        options: {
          ripple: true,
          // darkModeSelector: 'none',
        },
      },
    }),
    MessageService,
  ],
};
