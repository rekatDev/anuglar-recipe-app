import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShoppingListService } from '../shopping-list.service';
import { _MatChipListMixinBase } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  private shoppingListSubscription: Subscription;
  form: FormGroup;

  @Input()
  _shoppingList;

  @Output()
  addIngredient = new EventEmitter<any>();

  @Output()
  removeIngredient = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {}
  set shoppingList(value) {
    this._shoppingList = value;
  }

  get shoppingList() {
    return this._shoppingList;
  }

  onAddIngredient(ingredientField) {
    this.addIngredient.emit({
      name: ingredientField.value
    });
  }
  // onAddIngredient(ingredientField) {
  //   this.addIngredient({
  //     name: ingredientField.value
  //   });
  // }

  // addIngredient(value) {
  //   // this._shoppingList.push(value);
  //   this.shoppingListService.addToShoppingList(value);
  // }

  onRemoveIngredient(ingredient) {
    // const delIdx = this.shoppingList.findIndex(i => i === ingredient);
    // this.shoppingList.splice(delIdx);
    this.shoppingListService.removeFromList(ingredient);
  }

  onSave() {
    this.shoppingListService.editShoppingList();
  }
}
