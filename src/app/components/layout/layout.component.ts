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
import { FavoritesState } from '../../state/favorites/favorites.state';
import { Logout } from '../../state/auth/auth.actions';

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
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
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
