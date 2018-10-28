import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ValidationService {


  validate(form: FormGroup, formField: string) {
    return form.get(formField).invalid && (form.get(formField).touched || form.get(formField).dirty);
  }

}
