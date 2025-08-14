import { ActivityLevel, Gender } from "@prisma/client";


export interface SignupData {
    fullName:string
    email: string;
    weight?:number
   
    password: string;
    imageUrl?:string
    height?:number
    age?:number
    gender?:Gender | null,
    phoneNumber?:string,
    country?:string,
    city?:string
    activityLevel?:ActivityLevel | null,
    healthConditions?:string[]
    dietaryRestrictions?:string[]
    
  }
  
  export interface SigninData {
    email: string;
    password: string;
  }

  export interface MealWithMacros {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }

  
  export let diseaseMacros: Record<string, {
    breakfast: MealWithMacros;
    lunch:     MealWithMacros;
    supper:    MealWithMacros;
    snack:     MealWithMacros;
  }> = {};

  export interface MealMacroMap {
    [mealName: string]: MealWithMacros;
  }
  
  
  
  export interface DiseaseMeal {
    Disease: string;
    Age: number;
    Gender: Gender;
    ActivityLevel: ActivityLevel;
    Recommended_Breakfast: string;
    Recommended_Lunch: string;
    Recommended_Supper: string;
    Dietary_Restrictions: string[];
  }
  
  
  
  // If you have a RecommendationResult type, update it:
  export interface DiseaseMealsWithMacros {
    
    
    disease: string;
    dietaryRestrictions: string[];
    recommendedMeals: {
      
      
      breakfast: { name: string; macros: MealWithMacros };
      lunch:     { name: string; macros: MealWithMacros };
      supper:    { name: string; macros: MealWithMacros };
    };
    recipes: any[];
  }


  export interface RecommendationResult extends DiseaseMealsWithMacros {
    energy: {
      BMR: number;
      TDEE: number;
      perMeal: number;
    };
  recipes: any[];
}

export interface RecipeSearchParams {
  disease?: string;
  usePersonalRestrictions?: boolean;
}


export interface ToggleBookmarkResult {
  removed: boolean;
  bookmark?: { id: number; userId: number; recipeUri: number };
}


// New ML Prediction Service
export interface MLRecommendationRequest {
  age: number;
  gender: string;
  height: number;
  weight: number;
  diseases: string[];
}


export interface MLRecommendationResponse {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}