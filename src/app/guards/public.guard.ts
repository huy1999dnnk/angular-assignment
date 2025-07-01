import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthState } from '../state/auth/auth.state';
import { GetCurrentUser } from '../state/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    const state = this.store.selectSnapshot((state: any) => state.auth);
    
    // If no token, allow access to public routes
    if (!state.accessToken) {
      return true;
    }

    // If we have token and user, redirect to products page
    if (state.accessToken && state.user) {
      this.router.navigate(['/products']);
      return false;
    }

    // If we have token but no user, verify authentication first
    if (state.accessToken && !state.user) {
      return this.store.dispatch(new GetCurrentUser()).pipe(
        map(() => {
          const updatedState = this.store.selectSnapshot((state: any) => state.auth);
          if (updatedState.user) {
            // User is authenticated, redirect to products
            this.router.navigate(['/products']);
            return false;
          } else {
            // Authentication failed, allow access to public route
            return true;
          }
        }),
        catchError(() => {
          // Authentication failed, allow access to public route
          return of(true);
        })
      );
    }

    // Default case: allow access to public routes
    return true;
  }
}
