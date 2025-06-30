import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ToggleFavorite, FavoritesState } from '../../state/favorites.state';
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
  template: `
    <div class="container">
      <div class="header">
        <button mat-raised-button (click)="goToProducts()" aria-label="Go back to products" class="back-button">
          Back to list
        </button>
        <h1>My Favorite Products</h1>
      </div>
      @if (displayedFavorites.length === 0) {
        <div class="empty-state">
          <mat-icon>favorite_border</mat-icon>
          <h2>No favorites yet</h2>
          <p>Start adding products to your favorites from the products page!</p>
        </div>
      } @else {
        <div class="products-grid">
          @for (product of displayedFavorites; track product.id) {
            <mat-card class="product-card">
              <div class="product-image-container">
                <img [src]="product.thumbnail" [alt]="product.title" class="product-image">
              </div>
              
              <mat-card-header>
                <mat-card-title>{{ product.title }}</mat-card-title>
                <mat-card-subtitle>\${{ product.price }}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <p class="product-description">{{ product.description }}</p>
              </mat-card-content>
              
              <mat-card-actions>
                <button 
                  mat-raised-button 
                  color="accent"
                  (click)="toggleFavorite(product)"
                  class="favorite-button"
                  aria-label="Remove from favorites">
                  Remove from Favorites
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .back-button {
      margin-right: 16px;
    }

    h1 {
      color: #333;
      margin: 0;
      flex: 1;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 72px;
      height: 72px;
      width: 72px;
      margin-bottom: 20px;
      color: #ccc;
    }

    .empty-state h2 {
      margin-bottom: 10px;
      color: #666;
    }

    .empty-state p {
      margin-bottom: 20px;
      color: #999;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-image-container {
      height: 200px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-description {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      max-height: 4.2em;
    }

    mat-card-content {
      flex: 1;
    }

    mat-card-actions {
      padding: 16px;
      margin: 0;
      display: flex;
      justify-content: flex-end;
    }

    .favorite-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .favorite-button mat-icon {
      margin: 0;
    }
  `]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites$: Observable<Product[]>;
  displayedFavorites: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.favorites$ = this.store.select(FavoritesState.favorites);
  }

  ngOnInit() {
    // Take a snapshot of favorites when component loads
    // This ensures products stay visible until user navigates away
    this.displayedFavorites = this.store.selectSnapshot((state: any) => state.favorites.favorites);
    
    // But still listen for changes to update the displayed list
    this.favorites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(favorites => {
      // Only add new favorites, don't remove existing ones from display
      favorites.forEach(fav => {
        if (!this.displayedFavorites.find(displayed => displayed.id === fav.id)) {
          this.displayedFavorites.push(fav);
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(product: Product) {
    this.store.dispatch(new ToggleFavorite(product));
    this.snackBar.open('Removed from favorites!', 'Close', { duration: 2000 });
  }

  goToProducts() {
    // Navigate to product list page
    this.router.navigate(['/products']);
  }
}
