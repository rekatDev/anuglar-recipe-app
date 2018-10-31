import { Ingredient } from './ingredient.model';

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imgPath: string;
  ingredients: Ingredient[];
  createdBy: string;
  creatorId: string;
}
