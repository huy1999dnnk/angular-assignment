import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductsStateModel } from './products.model';
import { 
  LoadProducts, 
  LoadProductsSuccess, 
  LoadProductsFailure 
} from './products.actions';

@State<ProductsStateModel>({
  name: 'products',
  defaults: {
    products: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class ProductsState {
  constructor(private productService: ProductService) {}

  @Selector()
  static products(state: ProductsStateModel): Product[] {
    return state.products;
  }

  @Selector()
  static loading(state: ProductsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: ProductsStateModel): string | null {
    return state.error;
  }

  @Action(LoadProducts)
  loadProducts(ctx: StateContext<ProductsStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.productService.getProducts().pipe(
      tap(response => {
        ctx.dispatch(new LoadProductsSuccess(response.products));
      }),
      catchError(error => {
        ctx.dispatch(new LoadProductsFailure(error.message || 'Failed to load products'));
        return throwError(() => error);
      })
    );
  }

  @Action(LoadProductsSuccess)
  loadProductsSuccess(ctx: StateContext<ProductsStateModel>, action: LoadProductsSuccess) {
    ctx.patchState({
      products: action.products,
      loading: false,
      error: null
    });
  }

  @Action(LoadProductsFailure)
  loadProductsFailure(ctx: StateContext<ProductsStateModel>, action: LoadProductsFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }
}
