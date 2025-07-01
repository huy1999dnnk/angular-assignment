import { Product } from '../../models/product.model';

export interface ProductsStateModel {
  products: Product[];
  loading: boolean;
  error: string | null;
}
