import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rdr1 } from '../model/rdr1';
import { BaseService } from '../base/baseservice.service';

@Injectable({
  providedIn: 'root'
})
export class Rdr1Service extends BaseService<Rdr1> {

  constructor(private _http: HttpClient) {
    super(_http, "/ordrform/rdr1", "/ordrform");
   }

}
