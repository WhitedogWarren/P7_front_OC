import { HTTP_INTERCEPTORS, HttpEvent  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401 && err.error.message == 'jwt expired') {
          //this.authService.signOut();
          //window.localStorage.clear();
          console.log('redirect from ErrorInterceptor');
          this.router.navigate(['auth/login'], { queryParams: { error: 'jwt' } });
        }

        //const error = err.error.message || err.statusText;
        return throwError(err);
      }),
    );
  }
}

export const errorInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];