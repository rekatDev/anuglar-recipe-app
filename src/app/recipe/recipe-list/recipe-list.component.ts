import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private recipeSubscription: Subscription;

  recipes: Recipe[];

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.recipeService.getRecipes();
    this.recipeSubscription = this.recipeService
      .getRecipeUpdate()
      .subscribe(recipes => {
        console.log(recipes);
        this.recipes = recipes;
      });
  }

  ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }

  onDetailClick(selectedId: string) {
    this.router.navigate([`recipes/${selectedId}`]);
  }
}
