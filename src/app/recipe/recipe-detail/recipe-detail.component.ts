import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((param: ParamMap) => {
      if (param.has('id')) {
        const id = param.get('id');
        this.recipeService.getById(id).subscribe(recipe => {
          this.selectedRecipe = {
            _id: recipe._id,
            title: recipe.title,
            description: recipe.description,
            imgPath: recipe.imgPath,
            ingredients: recipe.ingredients,
            createdBy: recipe._creator.username,
            creatorId: recipe._creator._id
          };
        });
        // this.selectedRecipe = this.recipeService.getById(id);
      }
    });
  }

  onDeleteClick() {
    this.recipeService.deleteRecipe(this.selectedRecipe._id);
  }

  onEditClick() {
    this.router.navigate([`recipes/${this.selectedRecipe._id}/edit`]);
  }
}
