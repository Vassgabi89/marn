import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordr } from '../model/ordr';
import { async } from '@angular/core/testing';
import { BaseService } from '../base/baseservice.service';
import { Rmhn } from '../model/rmhn';
import { Rmhv } from '../model/rmhv';

@Injectable({
  providedIn: 'root'
})
export class RmhvService extends BaseService<Rmhv> {
  
  constructor(private _http: HttpClient) {
    super(_http, "http://localhost:4000/f_rmhn/rmhv", "http://localhost:4000/f_rmhn");
   }

}
