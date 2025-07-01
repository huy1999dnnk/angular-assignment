import { Product } from '../../models/product.model';

// Products Actions
export class LoadProducts {
  static readonly type = '[Products] Load Products';
}

export class LoadProductsSuccess {
  static readonly type = '[Products] Load Products Success';
  constructor(public products: Product[]) {}
}

export class LoadProductsFailure {
  static readonly type = '[Products] Load Products Failure';
  constructor(public error: string) {}
}
