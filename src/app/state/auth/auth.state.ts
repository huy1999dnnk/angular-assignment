import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';
import { AuthStateModel } from './auth.model';
import { 
  Login, 
  GetCurrentUser, 
  SetCurrentUser, 
  Logout, 
  RefreshToken, 
  SetTokens 
} from './auth.actions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isLoggedIn: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null
  }
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.user;
  }

  @Selector()
  static isLoggedIn(state: AuthStateModel): boolean {
    return state.isLoggedIn;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });
    
    return this.authService.login(action.credentials).pipe(
      tap(response => {
        const { accessToken, refreshToken, ...user } = response;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        ctx.patchState({
          user,
          accessToken,
          refreshToken,
          isLoggedIn: true,
          loading: false,
          error: null
        });

        // Get current user after successful login
        ctx.dispatch(new GetCurrentUser());
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Login failed'
        });
        return throwError(() => error);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    ctx.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      loading: false,
      error: null
    });
  }

  @Action(RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>, action: RefreshToken) {
    const state = ctx.getState();
    const refreshTokenRequest = action.refreshTokenRequest || {
      refreshToken: state.refreshToken!
    };

    return this.authService.refreshToken(refreshTokenRequest).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        ctx.patchState({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });
      }),
      catchError(error => {
        // If refresh fails, logout user
        ctx.dispatch(new Logout());
        return throwError(() => error);
      })
    );
  }

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    if (!state.accessToken) {
      return;
    }

    ctx.patchState({ loading: true });
    
    return this.authService.getCurrentUser().pipe(
      tap(user => {
        ctx.dispatch(new SetCurrentUser(user));
      }),
      catchError(error => {
        // If getting current user fails, logout
        ctx.dispatch(new Logout());
        return throwError(() => error);
      })
    );
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<AuthStateModel>, action: SetCurrentUser) {
    ctx.patchState({
      user: action.user,
      loading: false,
      error: null
    });
  }

  @Action(SetTokens)
  setTokens(ctx: StateContext<AuthStateModel>, action: SetTokens) {
    localStorage.setItem('accessToken', action.accessToken);
    localStorage.setItem('refreshToken', action.refreshToken);
    
    ctx.patchState({
      accessToken: action.accessToken,
      refreshToken: action.refreshToken,
      isLoggedIn: true
    });
  }
}
