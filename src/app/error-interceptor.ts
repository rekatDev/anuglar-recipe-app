import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // const errorMessage = 'An unknown error occured!';
        // if (err.status === 401) {
        //   console.log('not auth!');
        //   location.reload(true);
        // }
        let error;
        if (err.error) {
          error = err.error.message;
        } else {
          error = err.statusText;
        }

        return throwError(error);
      })
    );
  }
}
