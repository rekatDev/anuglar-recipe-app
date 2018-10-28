import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Request } from 'selenium-webdriver/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    let request = req;
    if (token) {
      request = req.clone({
        headers: req.headers.set('Authorization', token)
      });
    }

    console.log(request);

    return next.handle(request);
  }

}
