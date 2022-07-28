import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { Ocrd } from '../model/ocrd';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcrdService {

  baseUrl: string = environment.baseUrl;
  apiUrl: string = this.baseUrl + "/ocrd"

  //apiUrl: string = "http://localhost:4000/ocrd"

  constructor(
    private http: HttpClient
  ) {}
   
    getAll(): Observable<Ocrd[]>{
      return this.http.get<Ocrd[]>(this.apiUrl);
    }

    /**
     * Get one product using by PK
     * @param id the PK key of the pruducts
     */
    getID(id: string | number): Observable<Ocrd[]>{
      return this.http.get<Ocrd[]>(`${this.apiUrl}/${id}`);

    }

    getByColumn(col: string, value: string): Observable<Ocrd[]>{
      return this.http.get<Ocrd[]>(`${this.apiUrl}/${col}/${value}`);

    }    

    update(ocrd: Ocrd): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/${ocrd.cardcode}`,
        ocrd
      )
    }

    insert(ocrd: any): Observable<any> {
      console.log(ocrd);
      return this.http.post(
        this.apiUrl,
        ocrd
      )
    }

    validate(ocrd: any): Observable<any> {
      console.log(ocrd);
      return this.http.post(
        `${this.apiUrl}/validate`,
        ocrd
      )
    }
}
