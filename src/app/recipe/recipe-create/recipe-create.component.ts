import {
  Component,
  OnInit,
  ViewRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { mimeType } from './../mime-type-validation';
import { RecipeService } from '../recipe.service';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';
import { ValidationService } from 'src/app/validation.service';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss']
})
export class RecipeCreateComponent implements OnInit {
  previewImage: string;
  recipeFormGroup: FormGroup;
  submitted = false;
  imageSelected = false;

  ingredients: Ingredient[] = [];

  mode = 'create';
  private recipeId: string;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    public validationService: ValidationService,
    private activatedRoute: ActivatedRoute
  ) {}

  onImageSelected(event: Event) {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      this.previewImage = result as string;
    };

    const file = (event.target as HTMLInputElement).files[0];
    this.recipeFormGroup.patchValue({
      image: file
    });
    this.recipeFormGroup.get('image').updateValueAndValidity();
    reader.readAsDataURL(file);
    this.imageSelected = true;
  }

  // get ingredients() {
  //   return this.recipeFormGroup.get('ingredients') as FormArray;
  // }

  onSave() {
    if (this.recipeFormGroup.invalid) {
      // this.addTouchedState();
      this.submitted = true;
      return;
    }
    if (this.mode === 'create') {
      this.recipeService.addRecipe(
        this.recipeFormGroup.value.title,
        this.recipeFormGroup.value.description,
        this.ingredients,
        this.recipeFormGroup.value.image
      );
    } else {
      this.recipeService.editRecipe(
        this.recipeId,
        this.recipeFormGroup.value.title,
        this.recipeFormGroup.value.description,
        this.ingredients,
        this.recipeFormGroup.value.image
      );
    }
  }

  onAddIngredient(ingredident) {
    this.ingredients.push(ingredident);
    // this.addIngredient(ingredientField.value);
    // ingredientField.value = '';
  }

  onRemoveIngredient(ingredient) {
    const delIdx = this.ingredients.findIndex(i => i === ingredient);
    this.ingredients.splice(delIdx);
  }

  // private addIngredient(value: string) {
  //   this.ingredients.push(
  //     this.fb.group({
  //       name: [value, Validators.required]
  //     })
  //   );
  // }

  // onRemoveIngredient(ingredient) {
  //   const index = this.ingredients.value.findIndex(i => ingredient === i);
  //   this.ingredients.removeAt(index);
  // }

  ngOnInit() {
    this.recipeFormGroup = this.fb.group({
      title: [
        null,
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      description: [
        null,
        Validators.compose([Validators.required, Validators.minLength(10)])
      ],
      image: [null, Validators.required, mimeType]
      // ingredients: this.fb.array([])
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        const recipeId = paramMap.get('id');
        this.mode = 'edit';
        this.recipeService.getById(recipeId).subscribe(recipeData => {
          this.recipeId = recipeData._id;

          this.recipeFormGroup.setValue({
            title: recipeData.title,
            description: recipeData.description,
            image: recipeData.imgPath
            // ingredients: []
          });
          this.previewImage = recipeData.imgPath;
          this.ingredients = [...recipeData.ingredients];
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }
}
