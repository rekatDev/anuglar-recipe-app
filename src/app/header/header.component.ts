import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authSub: Subscription;

  isAuth = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatus();
    this.authSub = this.authService.getAuthStatusListener().subscribe(auth => {
      console.log(auth);
      this.isAuth = auth;
    });
    console.log(this.isAuth);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  onLogout() {
   this.authService.logout();
  }

}
