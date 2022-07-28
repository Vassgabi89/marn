import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product } from '../model/product';
import { Ocrd } from '../model/ocrd';
import { Oitm } from '../model/oitm';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { CRD1 } from '../model/crd1';

@Injectable({
  providedIn: 'root'
})
export class OitmService {

  baseUrl: string = environment.baseUrl;
  apiUrl: string = this.baseUrl + "/oitm"
  //apiUrl: string = "http://localhost:4000/oitm"


  private _cartItems: Oitm[];
  private _userArray: User[];
  private _sum: number;

  cartStatus = new Subject<number>();
  

  constructor(
    private http: HttpClient
  ) {}
   
    getAll(): Observable<Oitm[]>{
      return this.http.get<Oitm[]>(this.apiUrl);
    }

    /**
     * Get one product using by PK
     * @param id the PK key of the pruducts
     */
    getID(id: string | number): Observable<Oitm[]>{
      return this.http.get<Oitm[]>(`${this.apiUrl}/${id}`);

    }

    getByColumn(col: string, value: string): Observable<Oitm[]>{
      return this.http.get<Oitm[]>(`${this.apiUrl}/${col}/${value}`);

    } 
    getCRD1ByColumn(col: string, value: string): Observable<CRD1[]>{
      return this.http.get<CRD1[]>(`${this.apiUrl}/crd1/${col}/${value}`);

    }    

    getBySelect(value: string): Observable<Oitm[]>{
      return this.http.get<Oitm[]>(`${this.apiUrl}/select/${value}`);

    }
       
    update(oitm: any): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/${oitm.cardcode}`,
        oitm
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

    get cartItems(): Oitm[] {
      return this._cartItems;
    }
  
    @Input()
    set cartItems(value: Oitm[]) {
      this._cartItems = value;
    }

    get userArray(): User[] {
      return this._userArray;
    }
  
    @Input()
    set userArray(value: User[]) {
      this._userArray = value;
    }


    get sum(): number {
      return this._sum;
    }
  
    @Input()
    set sum(value: number) {
      this._sum = value;
    }

   
}