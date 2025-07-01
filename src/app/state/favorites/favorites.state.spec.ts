import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Store, provideStore } from '@ngxs/store';
import { FavoritesState } from './favorites.state';
import { AddToFavorites, RemoveFromFavorites, ToggleFavorite, ClearFavorites } from './favorites.actions';
import { Product } from '../../models/product.model';

describe('FavoritesState', () => {
  let store: Store;
  
  const mockProduct1: Product = {
    id: 1,
    title: 'Test Product 1',
    description: 'Test Description 1',
    category: 'test',
    price: 99.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 100,
    tags: ['test'],
    sku: 'TEST001',
    weight: 1,
    dimensions: { width: 10, height: 10, depth: 10 },
    warrantyInformation: 'Test warranty',
    shippingInformation: 'Test shipping',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: 'Test return policy',
    minimumOrderQuantity: 1,
    meta: {
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      barcode: '123456789',
      qrCode: 'test-qr'
    },
    images: ['test-image.jpg'],
    thumbnail: 'test-thumbnail.jpg'
  };

  const mockProduct2: Product = {
    ...mockProduct1,
    id: 2,
    title: 'Test Product 2',
    description: 'Test Description 2'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideStore([FavoritesState])
      ]
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    const favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites).toBeDefined();
    expect(favorites).toEqual([]);
  });

  it('should add product to favorites', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    
    const favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(1);
    expect(favorites[0]).toEqual(mockProduct1);
  });

  it('should not add duplicate products to favorites', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    store.dispatch(new AddToFavorites(mockProduct1));
    
    const favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(1);
  });

  it('should remove product from favorites', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    store.dispatch(new AddToFavorites(mockProduct2));
    store.dispatch(new RemoveFromFavorites(mockProduct1.id));
    
    const favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(1);
    expect(favorites[0]).toEqual(mockProduct2);
  });

  it('should toggle favorite status', () => {
    // Add product via toggle
    store.dispatch(new ToggleFavorite(mockProduct1));
    let favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(1);
    expect(favorites[0]).toEqual(mockProduct1);

    // Remove product via toggle
    store.dispatch(new ToggleFavorite(mockProduct1));
    favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(0);
  });

  it('should check if product is favorite', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    
    const isFavorite = store.selectSnapshot(FavoritesState.isFavorite);
    expect(isFavorite(mockProduct1.id)).toBe(true);
    expect(isFavorite(mockProduct2.id)).toBe(false);
  });

  it('should return favorites count', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    store.dispatch(new AddToFavorites(mockProduct2));
    
    const count = store.selectSnapshot(FavoritesState.favoritesCount);
    expect(count).toBe(2);
  });

  it('should clear all favorites', () => {
    store.dispatch(new AddToFavorites(mockProduct1));
    store.dispatch(new AddToFavorites(mockProduct2));
    store.dispatch(new ClearFavorites());
    
    const favorites = store.selectSnapshot(FavoritesState.favorites);
    expect(favorites.length).toBe(0);
  });
});
