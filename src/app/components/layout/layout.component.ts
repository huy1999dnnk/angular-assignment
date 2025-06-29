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
          mat-icon-button
          (click)="goToFavorites()"
          [matBadge]="favoritesCount$ | async"
          matBadgeColor="accent"
          aria-label="Go to favorites">
          <mat-icon>favorite</mat-icon>
        </button>
        <button
          mat-icon-button
          (click)="logout()"
          aria-label="Logout">
          <mat-icon>logout</mat-icon>
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
      gap: 8px;
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
