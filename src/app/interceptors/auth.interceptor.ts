import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthState, RefreshToken, Logout } from '../state/auth.state';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const store = inject(Store);
  const accessToken = store.selectSnapshot(AuthState.accessToken);
  
  if (accessToken && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    req = addTokenHeader(req, accessToken);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, store);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`)
  });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, store: Store): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const authState = store.selectSnapshot(state => state.auth);
    const refreshToken = authState.refreshToken;
    
    if (refreshToken) {
      return store.dispatch(new RefreshToken()).pipe(
        switchMap(() => {
          isRefreshing = false;
          const newAccessToken = store.selectSnapshot(AuthState.accessToken);
          refreshTokenSubject.next(newAccessToken);
          
          if (newAccessToken) {
            return next(addTokenHeader(request, newAccessToken));
          }
          return throwError(() => new Error('Token refresh failed'));
        }),
        catchError(error => {
          isRefreshing = false;
          store.dispatch(new Logout());
          return throwError(() => error);
        })
      );
    } else {
      store.dispatch(new Logout());
      return throwError(() => new Error('No refresh token available'));
    }
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token)))
  );
}
