import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { routes } from './app.routes';
import { AuthState } from './state/auth.state';
import { FavoritesState } from './state/favorites.state';
import { ProductsState } from './state/products.state';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    provideStore([AuthState, FavoritesState, ProductsState], 
      withNgxsLoggerPlugin(),
      withNgxsReduxDevtoolsPlugin()
    )
  ]
};
