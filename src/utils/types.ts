export interface SignupResponse {
  user: {
    id: number;
    fullName: string;
    email: string;
    imageUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}

// types.ts
export type MealRecommendation = {
  name: string;
  macros: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  image?: string; // We'll add this from the recipes array
};

export type RecommendationResponse = {
  energy: {
    BMR: number;
    TDEE: number;
    perMeal: number;
  };
  disease: string;
  dietaryRestrictions: string[];
  recommendedMeals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    supper: MealRecommendation;
  };
  recipes: Recipe[];
};

export type Recipe = {
  id: number;
  label: string;
  mealType: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  images: {
    REGULAR: {
      url: string;
    };
  };
  isBookmarked?: boolean;
};

export type ToggleBookmarkResult = {
  removed: boolean;
  bookmark?: Bookmark;
};

export type Bookmark = {
  id: number;
  userId: number;
  recipeUri: number;
  createdAt: Date;
};

export type GetBookmarks = {
  count: number;
  result: Recipe[];
};

export type FormDataType = {
  fullName?: string;
  email?: string;
  phoneNumber: string;
  age: number;
  gender: string;
  country: string;
  city: string;
  disease: string;
  activityLevel: string;
  imageUrl: string;
  imageFile?: File;
  dietaryRestrictions: string[];
  height: string
  weight: number;
};

export const chunkRecipes = (recipes: Recipe[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < recipes.length; i += chunkSize) {
    chunks.push(recipes.slice(i, i + chunkSize));
  }
  return chunks;
};

export function capitalizeWords(input: string) {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
