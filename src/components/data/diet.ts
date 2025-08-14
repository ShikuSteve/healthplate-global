import pic from "../../assets/foodie.jpeg";

export interface Meals {
  breakfast: {
    name: string;
    image: string;
  };
  lunch: { name: string; image: string };
  supper: { name: string; image: string };
}

export interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
}

export interface DietData {
  disease: string;
  restriction: string;
  energy: {
    BMR: number;
    TDEE: number;
    perMeal: number;
  };
  recommendedMeals: Meals[];
  recipes: Recipe[];
}

export const dietDummyData: DietData = {
  disease: "Type 2 Diabetes",
  restriction: "Low sugar, moderate carbs",
  energy: {
    BMR: 1500,
    TDEE: 2000,
    perMeal: 667,
  },
  recommendedMeals: [
    {
      breakfast: {
        name: "Oatmeal with Berries",
        image: pic,
      },
      lunch: {
        name: "Grilled Chicken Salad",
        image: pic,
      },
      supper: {
        name: "Steamed Fish with Veggies",
        image: pic,
      },
    },
    {
      breakfast: {
        name: "Avocado Toast",
        image: pic,
      },
      lunch: {
        name: "Quinoa Bowl with Tofu",
        image: pic,
      },
      supper: {
        name: "Lentil Soup with Whole Grain Bread",
        image: pic,
      },
    },
  ],
  recipes: [
    {
      uri: "recipe_001",
      label: "Grilled Chicken Salad",
      image: pic,
      ingredientLines: [
        "200g grilled chicken breast",
        "Mixed greens",
        "Cherry tomatoes",
        "Olive oil dressing",
      ],
    },
    {
      uri: "recipe_002",
      label: "Oatmeal with Berries",
      image: pic,
      ingredientLines: [
        "1 cup rolled oats",
        "1 cup almond milk",
        "Handful of blueberries",
        "Drizzle of honey",
      ],
    },
  ],
};
