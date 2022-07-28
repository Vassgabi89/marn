import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordr } from '../model/ordr';
import { async } from '@angular/core/testing';
import { Iservice } from './iservice';
import { environment } from 'src/environments/environment';


export abstract class BaseService<T>{

  apiUrl: string;
  apiMainUrl: string;
  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient, _apiUrl: string, _apiMainUrl: string) {
    this.apiUrl = this.baseUrl + _apiUrl;
    this.apiMainUrl = this.baseUrl + _apiMainUrl;
  }


  async getAll(): Promise<T[]> {
    console.log("ORDRSERV");
    return await this.http.get<T[]>(this.apiUrl).toPromise();

  }

  async getAllByWhere(l_where: string): Promise<T[]> {
    if (l_where == "") {
      l_where = " 1=1 "
    }
    console.log(this.apiUrl);
    return await this.http.get<T[]>(`${this.apiUrl}/where/${l_where}`).toPromise();

  }

  /**
   * Get one product using by PK
   * @param id the PK key of the pruducts
   */
  async getID(id: string | number): Promise<T[]> {
    return await this.http.get<T[]>(`${this.apiUrl}/${id}`).toPromise();

  }

  async getByColumn(col: string, value: string): Promise<T[]> {
    return await this.http.get<T[]>(`${this.apiUrl}/${col}/${value}`).toPromise();

  }

  async getBySelect(value: string): Promise<T[]>{
    console.log("Bejöttem a getBySelect-be");
    console.log(value);
    return await this.http.get<T[]>(`${this.apiUrl}/select/${value}`).toPromise();

  }

  async getNewRow(): Promise<T> {
    console.log("CREATENEWROW");
    return await this.http.get<T>(`${this.apiUrl}/createnewrow`).toPromise();


  }

  async update(value: T): Promise<any> {
    return await this.http.put(
      `${this.apiUrl}/${value["id"]}`,
      value
    ).toPromise();
  }

  async insert(value: any): Promise<any> {
    console.log(value);
    return await this.http.post(
      this.apiUrl,
      value
    ).toPromise()
  }

  async validate(col: string, value: string, ordr: any): Promise<any> {
    console.log("VALIDAL");
    return await this.http.post(
      `${this.apiUrl}/validate/${col}/${value}`,
      ordr
    ).toPromise();
  }

  async updateMain(data: any[][]): Promise<any> {
    return await this.http.put(
      `${this.apiMainUrl}/update/`,
      data
    ).toPromise();
  }

  async insertMain(data: any[][]): Promise<any> {
    return await this.http.put(
      `${this.apiMainUrl}/insert/`,
      data
    ).toPromise();
  }

}

