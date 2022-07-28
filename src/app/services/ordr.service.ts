import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordr } from '../model/ordr';
import { async } from '@angular/core/testing';
import { BaseService } from '../base/baseservice.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdrService extends BaseService<Ordr> {
  baseUrl: string = environment.baseUrl;
  constructor(private _http: HttpClient) {
    super(_http, "/ordrform/ordr", "/ordrform");
   }

  

}
