import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { FavoritesState } from '../../state/favorites.state';
import { Logout } from '../../state/auth.state';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>DummyShop</span>
      <span class="spacer"></span>
      <div class="menu-actions-container">
        <button
          mat-raised-button
          color="accent"
          (click)="goToFavorites()"
          [matBadge]="favoritesCount$ | async"
          matBadgeColor="warn"
          class="toolbar-button"
          aria-label="Go to favorites">
          My Favorites
        </button>
        <button
          mat-raised-button
          (click)="logout()"
          class="toolbar-button"
          aria-label="Logout">
          Sign Out
        </button>
      </div>
    </mat-toolbar>
    
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .menu-actions-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toolbar-button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }

    .toolbar-button mat-icon {
      margin: 0;
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
  `]
})
export class LayoutComponent {
  favoritesCount$: Observable<number>;

  constructor(
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.favoritesCount$ = this.store.select(FavoritesState.favoritesCount);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }
}
