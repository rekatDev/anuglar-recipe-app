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
  username = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuth = this.authService.getAuthStatus();
    this.authSub = this.authService.getAuthStatusListener().subscribe(auth => {
      this.isAuth = auth;
      this.username = this.authService.getUsername();
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
