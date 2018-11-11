import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private shoppingListUpdate = new Subject<any>();
  private shoppingList: any = [];

  constructor(private http: HttpClient) {}
  fetchShoppingList() {
    return this.http
      .get<{
        shoppingList: any[];
      }>('http://localhost:3000/users/me/shoppinglist')
      .pipe(
        map(data => {
          return data.shoppingList.map(ingredient => {
            return {
              name: ingredient.name
            };
          });
        })
      )
      .subscribe(shoppingList => {
        this.shoppingList = [...shoppingList];
        this.shoppingListUpdate.next([...shoppingList]);
      });
  }

  editShoppingList() {
    this.http
      .patch('http://localhost:3000/users/me/shoppingList', this.shoppingList)
      .subscribe(res => {
        console.log('saved');
      });
  }

  addToShoppingList(...ingredients) {
    ingredients.forEach(ingredient => {
      this.shoppingList.push(ingredient);
    });
    this.shoppingListUpdate.next([...this.shoppingList]);
    this.editShoppingList();
  }

  removeFromList(ingredient) {
    const delIdx = this.shoppingList.findIndex(i => i === ingredient);
    this.shoppingList.splice(delIdx);
    this.shoppingListUpdate.next([...this.shoppingList]);
    this.editShoppingList();
  }

  getShoppingListUpdateListener() {
    return this.shoppingListUpdate.asObservable();
  }

  getShoppingList() {
    return [...this.shoppingList];
  }
}
