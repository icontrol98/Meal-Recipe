
export interface FormData {
  date: string;
  day: string;
  menuType: string;
  ingredientConstraints: string;
  allergens: string[];
  nutritionGoals: string;
  previousMenus: string;
}

export interface IngredientInfo {
  name: string;
  price: string;
  status: '원활' | '보통' | '부족';
  notes: string;
}
