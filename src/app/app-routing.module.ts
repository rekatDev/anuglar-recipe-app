import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
import { RecipeCreateComponent } from './recipe/recipe-create/recipe-create.component';
import { AuthGuard } from './auth/auth.guard';
import { ShoppingListComponent } from './shopping-list/shopping-list/shopping-list.component';
import { ShoppingListListComponent } from './shopping-list-list/shopping-list-list.component';

const routes: Routes = [
  { path: '', component: RecipeListComponent, pathMatch: 'full' },
  {
    path: 'recipes/create',
    component: RecipeCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  {
    path: 'recipes/:id/edit',
    component: RecipeCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shoppingList',
    component: ShoppingListListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard]
})
export class AppRouting {}
