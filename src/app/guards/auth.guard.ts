import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthState, GetCurrentUser } from '../state/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    const state = this.store.selectSnapshot((state: any) => state.auth);
    
    // If no token, redirect to login
    if (!state.accessToken) {
      this.router.navigate(['/login']);
      return false;
    }

    // If we have a token but no user, try to get current user
    if (state.accessToken && !state.user && !state.loading) {
      return this.store.dispatch(new GetCurrentUser()).pipe(
        map(() => {
          const updatedState = this.store.selectSnapshot((state: any) => state.auth);
          if (updatedState.user) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    // If we have both token and user, allow access
    if (state.accessToken && state.user) {
      return true;
    }

    // If loading, redirect to loading page
    if (state.loading) {
      this.router.navigate(['/loading']);
      return false;
    }

    // Default case: redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
