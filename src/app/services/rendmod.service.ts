import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordr } from '../model/ordr';
import { async } from '@angular/core/testing';
import { BaseService } from '../base/baseservice.service';
import { Rendmod } from '../model/rendmod';

@Injectable({
  providedIn: 'root'
})
export class RendmodService {

  apiUrl: string = "http://localhost:4000/RENDMODView/rendmod"

  constructor(
    private http: HttpClient
  ) {}
   
    getAll(): Observable<Rendmod[]>{
      return this.http.get<Rendmod[]>(this.apiUrl);
    }

    /**
     * Get one product using by PK
     * @param id the PK key of the pruducts
     */
    getID(id: string | number): Observable<Rendmod[]>{
      return this.http.get<Rendmod[]>(`${this.apiUrl}/${id}`);

    }

    getByColumn(col: string, value: string): Observable<Rendmod[]>{
      return this.http.get<Rendmod[]>(`${this.apiUrl}/${col}/${value}`);

    }    

    getBySelect(value: string): Observable<Rendmod[]>{
      return this.http.get<Rendmod[]>(`${this.apiUrl}/select/${value}`);

    }
}
