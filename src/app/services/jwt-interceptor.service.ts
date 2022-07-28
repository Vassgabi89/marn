import { Injectable } from '@angular/core';
import { AuthenticationsService } from './authentications.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../base/loader.service';

@Injectable()
export class JwtInterceptorService  implements HttpInterceptor {

  activeRequests: number = 0;

  skippUrls = [
    '/authrefresh',
  ];
  
  constructor(private authService: AuthenticationsService, private router: Router, public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.authService.currentUserValue;
        
    
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }
  
    let displayLoadingScreen = true;

    for (const skippUrl of this.skippUrls) {
      if (new RegExp(skippUrl).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    if (displayLoadingScreen) {
      if (this.activeRequests === 0) {
        this.loaderService.startLoading();
      }
      this.activeRequests++;

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loaderService.stopLoading();
          }
        })
      )
    } else {
      return next.handle(request);
    }
    //return next.handle(request).pipe();

    
  }
}
