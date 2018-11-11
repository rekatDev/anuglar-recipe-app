import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from './ingredient.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipesUpdated = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    //   // {
    //   // _id: '1',
    //   // title: 'Food test',
    //   // description: 'Testing the recipe',
    //   // imgPath: 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg',
    //   // ingredients: [{name: 'Kartoffeln', amount: 10}, {name: 'Paprika', amount: 2}] as Ingredient[]
    //   // }, {
    //   //   _id: '2',
    //   //   title: 'Food2 test',
    //   //   description: 'Testing the recipe2',
    //   //   imgPath: 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg',
    //   //   ingredients: [] as Ingredient[]
    //   // }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  addRecipe(title, description, ingredients, image) {
    const recipeData = new FormData();

    recipeData.append('image', image);
    recipeData.append(
      'recipe',
      JSON.stringify({
        title: title,
        description: description,
        ingredients: ingredients
      })
    );

    this.http
      .post('http://localhost:3000/recipes', recipeData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  editRecipe(
    id: string,
    title: string,
    description: string,
    ingredients: Ingredient[],
    image: File | string
  ) {
    let recipeData: Recipe | FormData;

    if (typeof image === 'object') {
      recipeData = new FormData();
      recipeData.append('image', image);
      recipeData.append(
        'recipe',
        JSON.stringify({
          _id: id,
          title: title,
          description: description,
          ingredients: ingredients
        })
      );
    } else {
      recipeData = {
        _id: id,
        title,
        description,
        ingredients,
        imgPath: image,
        createdBy: null,
        creatorId: null
      };
    }
    this.http
      .patch('http://localhost:3000/recipes/' + id, recipeData)
      .subscribe(res => {
        this.router.navigate(['recipes/' + id]);
      });
  }

  deleteRecipe(id: string) {
    this.http.delete('http://localhost:3000/recipes/' + id).subscribe(
      res => {
        this.router.navigate(['recipes']);
      },
      err => {
        // Display error message!
        this.router.navigate(['recipes']);
      }
    );
  }

  getRecipes() {
    this.http
      .get<{ recipes: any }>('http://localhost:3000/recipes')
      .pipe(
        map(data => {
          return {
            recipes: data.recipes.map(recipe => {
              return {
                _id: recipe._id,
                title: recipe.title,
                description: recipe.description,
                imgPath: recipe.imgPath,
                createdBy: recipe._creator.username,
                creatorId: recipe._creator._id,
                ingredients: recipe.ingredients.map(ingredient => {
                  return {
                    name: ingredient.name
                  };
                })
              };
            })
          };
        })
      )
      .subscribe(transformedRecipes => {
        this.recipes = transformedRecipes.recipes;
        this.recipesUpdated.next(this.recipes);
      });
  }

  getById(id: string) {
    return this.http.get<any>('http://localhost:3000/recipes/' + id);
  }

  getRecipeUpdate() {
    return this.recipesUpdated.asObservable();
  }
}
