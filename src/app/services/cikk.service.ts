import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CikkService {

  baseUrl: string = environment.baseUrl;
  apiUrl: string = this.baseUrl + "/product"

  constructor(
    private http: HttpClient
  ) {}
   
    getAll(): Observable<Product[]>{
      return this.http.get<Product[]>(this.apiUrl);
    }

    /**
     * Get one product using by PK
     * @param id the PK key of the pruducts
     */
    getID(id: string | number): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/${id}`);

    }

    getByColumn(col: string, value: string): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/${col}/${value}`);

    }    

    update(product: Product): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/${product.id}`,
        product
      )
    }

    insert(product: any): Observable<any> {
      console.log(product);
      return this.http.post(
        this.apiUrl,
        product
      )
    }

    validate(product: any): Observable<any> {
      console.log(product);
      return this.http.post(
        `${this.apiUrl}/validate`,
        product
      )
    }
}
