import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`);
  }
}
