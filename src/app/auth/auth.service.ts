import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AlertService } from '../alert/alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private token: string = null;
  private userId: string;
  private isAuth = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertSerivce: AlertService
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
              };
            }
          >res.body;
          this.token = body.token;
          this.userId = body.user._id;
          this.saveAuthData(this.token, this.userId);
          this.isAuth = true;
          this.router.navigate(['/']);
          this.authStatusListener.next(true);
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
      this.userId = null;
      this.token = null;
      this.isAuth = false;
      this.authStatusListener.next(false);
      this.router.navigate(['/']);
    });
  }

  getToken(): string {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatus() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token, id) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
  }

  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  autoAuth() {
    const authData = this.getAuthData();

    if (!authData) {
      return;
    }

    console.log(authData);
    this.token = authData.token;
    this.userId = authData.userId;

    this.isAuth = true;
    this.authStatusListener.next(true);

    console.log(this.isAuth);
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log(token);

    if (!token && !userId) {
      return;
    }

    return {
      userId,
      token
    };
  }
}
