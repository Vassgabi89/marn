import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationsService {

  baseUrl: string = environment.baseUrl;
  private apiUrl: string = this.baseUrl +  "/Users";
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  public currentUser: Observable<User> = this.currentUserSubject.asObservable();

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  constructor( private http: HttpClient) { 
    let localUser: string = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localUser)
      );
  }

  public login(userName: string, password: string): Observable<any> {
    let url: string = `${this.apiUrl}/authenticate`
    return this.http.post<any>(url,{userName:userName, password:password})
    .pipe(tap(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }));
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
