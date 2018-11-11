import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent implements OnInit {
  private shoppingListSubscription: Subscription;
  shoppingList = [];
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    // this.form = this.fb.group({
    //   ingredients: this.fb.array([])
    // });
    // this.shoppingListService.fetchShoppingList();
    this.shoppingList = this.shoppingListService.getShoppingList();
    this.shoppingListSubscription = this.shoppingListService
      .getShoppingListUpdateListener()
      .subscribe(shoppingList => {
        this.shoppingList = shoppingList;
        console.log(shoppingList);
      });
  }
  onAddIngredient(event) {
    this.shoppingListService.addToShoppingList(event);
    console.log(event.value);
  }
  onRemoveIngredient(event) {
    this.shoppingListService.removeFromList(event);
    console.log(event);
  }
}
