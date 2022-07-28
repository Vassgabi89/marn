import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordr } from '../model/ordr';
import { async } from '@angular/core/testing';
import { BaseService } from '../base/baseservice.service';
import { Rmhn } from '../model/rmhn';

@Injectable({
  providedIn: 'root'
})
export class RmhnService extends BaseService<Rmhn> {
  
  constructor(private _http: HttpClient) {
    super(_http, "http://localhost:4000/f_rmhn/rmhn", "http://localhost:4000/f_rmhn");
   }

}
