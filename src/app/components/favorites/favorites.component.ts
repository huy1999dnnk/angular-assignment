import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { RemoveFromFavorites, AddToFavorites } from '../../state/favorites/favorites.actions';
import { FavoritesState } from '../../state/favorites/favorites.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private removedFromFavorites = new Set<number>();
  private initialFavorites$ = new BehaviorSubject<Product[]>([]);
  favorites$: Observable<Product[]> = this.initialFavorites$.asObservable();

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    // Load the favorites that were available when the page was loaded
    // and keep them displayed until the user navigates away
    this.store.select(FavoritesState.favorites)
      .pipe(take(1))
      .subscribe(favorites => {
        this.initialFavorites$.next([...favorites]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFavorite(product: Product) {
    // Remove from the global state
    this.store.dispatch(new RemoveFromFavorites(product.id));
    
    // Mark as removed for UI purposes but keep it in the display list
    this.removedFromFavorites.add(product.id);
    
    this.snackBar.open('Removed from favorites!', 'Close', { duration: 2000 });
  }

  addToFavorites(product: Product) {
    // Add back to the global state
    this.store.dispatch(new AddToFavorites(product));
    
    // Remove from the removed set
    this.removedFromFavorites.delete(product.id);
    
    this.snackBar.open('Added to favorites!', 'Close', { duration: 2000 });
  }

  toggleFavorite(product: Product) {
    if (this.isRemovedFromFavorites(product.id)) {
      this.addToFavorites(product);
    } else {
      this.removeFavorite(product);
    }
  }

  isRemovedFromFavorites(productId: number): boolean {
    return this.removedFromFavorites.has(productId);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}
