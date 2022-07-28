import { Injectable } from '@angular/core';
import { BaseService } from '../base/baseservice.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Domain } from '../model/domain';

@Injectable({
  providedIn: 'root'
})
export class DomainService extends BaseService<Domain>  {

  baseUrl: string = environment.baseUrl;
  constructor(private _http: HttpClient) {
    super(_http, "/domain/domain", "/domain");
   }
}
