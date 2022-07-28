import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class PruductService {

  apiUrl: string = "http://localhost:4000/product"

  constructor(
    private http: HttpClient
  ) {}
   
    getAll(): Observable<Product[]>{
      return this.http.get<Product[]>(this.apiUrl);
    }

    get(id: string | number): Observable<Product>{
      return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    update(product: Product): void {
      this.http.put(
        `${this.apiUrl}/${product.id}`,
        product
      ).forEach(
        response => {
          console.log(response);
        }
      )
    }
}
