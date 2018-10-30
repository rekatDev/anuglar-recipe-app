import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private alertSubscription: Subscription;
  errorShow = false;
  errorObject: { type: string; message: string };

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertSubscription = this.alertService
      .getAlertListener()
      .subscribe(val => {
        this.errorObject = val;
        this.errorShow = !!val;
      });
  }
  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }
}
