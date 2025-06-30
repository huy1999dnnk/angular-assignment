import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { LoadProducts, ProductsState } from '../../state/products.state';
import { ToggleFavorite } from '../../state/favorites.state';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <h1>Products</h1>

      @if (loading$ | async) {
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading products...</p>
      </div>
      } @else if (error$ | async) {
      <div class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error$ | async }}</p>
        <button mat-raised-button color="primary" (click)="loadProducts()">
          Retry
        </button>
      </div>
      } @else {
      <div class="products-grid">
        @for (product of products$ | async; track product.id) {
        <mat-card class="product-card">
          <div class="product-image-container">
            <img
              [src]="product.thumbnail"
              [alt]="product.title"
              class="product-image"
            />
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
              [color]="isFavorite(product.id) ? 'accent' : 'primary'"
              (click)="toggleFavorite(product)"
              class="favorite-button"
              [attr.aria-label]="
                isFavorite(product.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              "
            >

              {{
                isFavorite(product.id) ? 'Remove from Favorites' : 'Add to Favorites'
              }}
            </button>
          </mat-card-actions>
        </mat-card>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
      }

      .loading-container,
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px;
        text-align: center;
      }

      .error-container mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 16px;
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
    `,
  ],
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.products$ = this.store.select(ProductsState.products);
    this.loading$ = this.store.select(ProductsState.loading);
    this.error$ = this.store.select(ProductsState.error);
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.store.dispatch(new LoadProducts());
  }

  toggleFavorite(product: Product) {
    this.store.dispatch(new ToggleFavorite(product));
    const isFav = this.isFavorite(product.id);
    const message = isFav ? 'Added to favorites!' : 'Removed from favorites!';
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  isFavorite(productId: number): boolean {
    return this.store
      .selectSnapshot((state: any) => state.favorites.favorites)
      .some((product: any) => product.id === productId);
  }
}
