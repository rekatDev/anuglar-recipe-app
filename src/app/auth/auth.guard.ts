import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    const isAuth = this.authService.getAuthStatus();

    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
