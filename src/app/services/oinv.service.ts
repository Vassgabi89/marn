import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/baseservice.service';
import { environment } from 'src/environments/environment';
import { Oinv } from '../model/oinv';

@Injectable({
  providedIn: 'root'
})
export class OinvService extends BaseService<Oinv> {
  baseUrl: string = environment.baseUrl;
  constructor(private _http: HttpClient) {
    super(_http, "/oinvlistform/oinv", "/oinvlistform");
   }

  

}

