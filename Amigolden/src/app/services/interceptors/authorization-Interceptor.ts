import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app-routing.module';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    constructor(private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.router.navigate([RouteNames.login]);
              }
            }
        }));
    }
}
