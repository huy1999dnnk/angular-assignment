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
import { LoadProducts } from '../../state/products/products.actions';
import { ProductsState } from '../../state/products/products.state';
import { ToggleFavorite } from '../../state/favorites/favorites.actions';

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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
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
