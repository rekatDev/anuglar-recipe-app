import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, of, Observer} from 'rxjs';
import { map, catchError, first} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    // return this.authService.getAuthStatusListener().pipe(
    //   map(e => {
    //     console.log("TESTING!!");
    //     if (!e) {
    //       this.router.navigate(['/login']);
    //     }
    //     return e;
    //   })
    // ).pipe(first());
    // return Observable.create((observer: Observer<boolean>) => {
    //     setTimeout( () => {
    //       observer.next(true);
    //     }, 2000);
    // });
    const isAuth = this.authService.getAuthStatus();

    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;

    // .then(
    //   isAuth => {
    //     console.log("WOORKING??");
    //     console.log(isAuth);
    //     // if (!isAuth) {
    //     //   this.router.navigate(['/login']);
    //     // }
    //     return true;
    //   },
    //   err => {
    //     console.log("HELLO??");
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    // );
  }
}
