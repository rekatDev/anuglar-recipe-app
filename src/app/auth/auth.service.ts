import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AlertService } from '../alert/alert.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private token: string = null;
  private isAuth = false;
  private init = false;

  private user: { username: string; email: string; id: string };
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertSerivce: AlertService,
    private shoppingListService: ShoppingListService
  ) {}

  createUser(email, password, username) {
    const authData: AuthData = {
      username,
      email,
      password
    };

    this.http.post('http://localhost:3000/users', authData).subscribe(
      res => {
        this.router.navigate(['/login']);
      },
      err => {
        this.alertSerivce.errorMessage(err);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email, password) {
    const authData: AuthData = {
      username: null,
      email,
      password
    };

    this.http
      .post('http://localhost:3000/users/login', authData, {
        observe: 'response'
      })
      .subscribe(
        res => {
          const body = <
            {
              token: string;
              user: {
                _id: string;
                email: string;
                username: string;
              };
            }
          >res.body;

          this.token = body.token;
          this.saveAuthData(this.token);

          this.setUser(
            {
              email: body.user.email,
              id: body.user._id,
              username: body.user.username
            },
            true
          );

          this.authStatusListener.next(true);
          this.router.navigate(['/']);
          return res;
        },
        err => {
          this.alertSerivce.errorMessage(err);
          this.authStatusListener.next(false);
        }
      );
  }
  logout() {
    this.http.delete('http://localhost:3000/users/me/token').subscribe(res => {
      this.removeAuthData();
      this.token = null;
      this.setUser(null, false);
      this.router.navigate(['/']);
    });
  }

  getToken(): string {
    return this.token;
  }

  getUserId() {
    if (this.user) {
      return this.user.id;
    }
  }

  getAuthStatus() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUsername() {
    if (this.user) {
      return this.user.username;
    }
  }

  private saveAuthData(token) {
    localStorage.setItem('token', token);
  }

  private removeAuthData() {
    localStorage.removeItem('token');
  }

  getUser() {
    this.http.get<any>('http://localhost:3000/users/me').subscribe(user => {
      this.setUser(
        {
          email: user.email,
          username: user.username,
          id: user._id
        },
        true
      );
      this.init = true;
    });
  }

  private setUser(user, isAuth) {
    this.user = {
      ...user
    };
    this.shoppingListService.fetchShoppingList();
    this.isAuth = isAuth;
    this.authStatusListener.next(isAuth);
  }

  autoAuth() {
    const authData = this.getAuthData();

    if (!authData) {
      return;
    }
    this.token = authData.token;
    // for initialization
    this.isAuth = true;
    // this.userId = authData.userId;
    // this.isAuth = true;
    // this.authStatusListener.next(true);
    this.getUser();
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token && !userId) {
      return;
    }

    return {
      userId,
      token
    };
  }
}
