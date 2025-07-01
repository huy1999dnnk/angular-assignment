import { Product } from '../../models/product.model';

// Favorites Actions
export class AddToFavorites {
  static readonly type = '[Favorites] Add to Favorites';
  constructor(public product: Product) {}
}

export class RemoveFromFavorites {
  static readonly type = '[Favorites] Remove from Favorites';
  constructor(public productId: number) {}
}

export class ToggleFavorite {
  static readonly type = '[Favorites] Toggle Favorite';
  constructor(public product: Product) {}
}

export class ClearFavorites {
  static readonly type = '[Favorites] Clear Favorites';
}
