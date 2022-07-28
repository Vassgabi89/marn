import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { Ocrd } from '../model/ocrd';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  apiUrl: string = "http://192.168.120.82:4000/base"

  constructor(
    private http: HttpClient
  ) {}
   
    
    getBySelect(value: string): Observable<any[]>{
      return this.http.get<any[]>(`${this.apiUrl}/select/${value}`);

    }    

    update(l_update_string: string): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/${l_update_string}`,
        null
      )
    }

    insert(l_insert_string: string): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/${l_insert_string}`,
        null
      )
    }
    
}
