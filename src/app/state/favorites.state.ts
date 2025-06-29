import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../models/product.model';

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

export interface FavoritesStateModel {
  favorites: Product[];
}

@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favorites: []
  }
})
@Injectable()
export class FavoritesState {
  @Selector()
  static favorites(state: FavoritesStateModel): Product[] {
    return state.favorites;
  }

  @Selector()
  static isFavorite(state: FavoritesStateModel) {
    return (productId: number): boolean => {
      return state.favorites.some(product => product.id === productId);
    };
  }

  @Selector()
  static favoritesCount(state: FavoritesStateModel): number {
    return state.favorites.length;
  }

  @Action(AddToFavorites)
  addToFavorites(ctx: StateContext<FavoritesStateModel>, action: AddToFavorites) {
    const state = ctx.getState();
    const isAlreadyFavorite = state.favorites.some(product => product.id === action.product.id);
    
    if (!isAlreadyFavorite) {
      ctx.patchState({
        favorites: [...state.favorites, action.product]
      });
    }
  }

  @Action(RemoveFromFavorites)
  removeFromFavorites(ctx: StateContext<FavoritesStateModel>, action: RemoveFromFavorites) {
    const state = ctx.getState();
    const updatedFavorites = state.favorites.filter(product => product.id !== action.productId);
    
    ctx.patchState({
      favorites: updatedFavorites
    });
  }

  @Action(ToggleFavorite)
  toggleFavorite(ctx: StateContext<FavoritesStateModel>, action: ToggleFavorite) {
    const state = ctx.getState();
    const isAlreadyFavorite = state.favorites.some(product => product.id === action.product.id);
    
    if (isAlreadyFavorite) {
      ctx.dispatch(new RemoveFromFavorites(action.product.id));
    } else {
      ctx.dispatch(new AddToFavorites(action.product));
    }
  }

  @Action(ClearFavorites)
  clearFavorites(ctx: StateContext<FavoritesStateModel>) {
    ctx.patchState({
      favorites: []
    });
  }
}
