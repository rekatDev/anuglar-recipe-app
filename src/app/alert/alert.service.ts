import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<{type: string, message: string}>();

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.subject.next();
    });
  }

  errorMessage(message: string) {
    this.subject.next({ type: 'error', message });
  }

  getAlertListener() {
    return this.subject.asObservable();
  }
}
