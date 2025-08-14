// import { getMealsByDisease } from "../services/dataset-service";
// import { fetchRecipes } from "../services/recipe";
// import { computeEnergyNeeds } from "../utils/energy";

// import { prisma } from "../utils/init";
// import { MealWithMacros, RecommendationResult } from "../utils/types";

// type MealSlot = "breakfast" | "lunch" | "supper";

// export const recommendationHandler = async (
//   disease: string | null,
//   userId: number,
//   restrictions: string[]

// ): Promise<RecommendationResult> => {
//   // 1. Load user & compute energy
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       dietaryRestrictions: true,
//       age: true,
//       gender: true,
//       activityLevel: true,
//       height: true,
//       weight: true
//     }
//   });
//   if (!user) throw new Error("User not found");
//   if (!user.height || !user.weight || !user.age || !user.gender || !user.activityLevel) {
//     throw new Error("Incomplete user profile");
//   }

//   const { BMR, TDEE, perMeal } = computeEnergyNeeds({
//     weightKg: user.weight,
//     heightCm: user.height,
//     age: user.age,
//     gender: user.gender,
//     activityLevel: user.activityLevel
//   });

//   // 2. Prepare defaults for output
//   let outputDisease = "";
//   let outputDietaryRestrictions = restrictions;
//   const zeroMacros: MealWithMacros = { calories: 0, protein: 0, fat: 0, carbs: 0 };

//   let recommendedMeals: RecommendationResult["recommendedMeals"] = {
//     breakfast: { name: "", macros: zeroMacros },
//     lunch: { name: "", macros: zeroMacros },
//     supper: { name: "", macros: zeroMacros },
//   };

//   // 3. Get recommendations
//   let recipesLists: any[][] = [];
//   const mealTypes: MealSlot[] = ["breakfast", "lunch", "supper"];
//   let recipesByMeal: { [key in MealSlot]: any[] } = {
//     breakfast: [],
//     lunch: [],
//     supper: []
//   };

//   if (disease) {
//     // Hybrid recommendation flow
//     const data = await getMealsByDisease(
//       restrictions,
//       disease,
//       user.age,
//       user.gender,
//       user.activityLevel,
//       user.height,
//       user.weight
//     );

//     if (!data) throw new Error("No recommendations available");

//     outputDisease = data.disease;
//     outputDietaryRestrictions = data.dietaryRestrictions;
//     recommendedMeals = data.recommendedMeals;

//     // Fetch recipes with enhanced parameters
//     recipesLists = await Promise.all(
//       mealTypes.map((m) => {
//         const apiMealType = m === "supper" ? "main course" : m.charAt(0).toUpperCase() + m.slice(1);

//         return fetchRecipes(
//           recommendedMeals[m].name,
//           [...outputDietaryRestrictions, ...user.dietaryRestrictions],
//           // userId,
//           {
//             min: Math.floor(perMeal * 0.3),
//             max: Math.ceil(perMeal * 1.5),
//             // protein: recommendedMeals[m].macros.protein,
//             // carbs: recommendedMeals[m].macros.carbs,
//             // fat: recommendedMeals[m].macros.fat
//           },
//           apiMealType
//         );
//       })
//     );

//     recipesByMeal = {
//       breakfast: recipesLists[0],
//       lunch: recipesLists[1],
//       supper: recipesLists[2]
//     };
//   } else {
//     // Restrictions-only mode (existing logic)
//     recipesLists = await Promise.all(
//       mealTypes.map((m) => {
//         // const apiMealType = m === "supper" ? "dinner" : m.charAt(0).toUpperCase() + m.slice(1);
//         const apiMealType = m === "supper" ? "main course" : m;
//         return fetchRecipes(
//           "",
//           restrictions,
//           // userId,
//           undefined,
//           apiMealType
//         );
//       })
//     );

//      recommendedMeals = {
//     breakfast: {
//       name: recipesLists[0][0]?.label || "",
//       macros: recipesLists[0][0]?.macros || zeroMacros
//     },
//     lunch: {
//       name: recipesLists[1][0]?.label || "",
//       macros: recipesLists[1][0]?.macros || zeroMacros
//     },
//     supper: {
//       name: recipesLists[2][0]?.label || "",
//       macros: recipesLists[2][0]?.macros || zeroMacros
//     }
//   };

//     recipesByMeal = {
//       breakfast: recipesLists[0],
//       lunch: recipesLists[1],
//       supper: recipesLists[2]
//     };
//   }

//   // Update meal names from top recipe hits if needed
//   const [breakfastHits, lunchHits, supperHits] = recipesLists;
//   recommendedMeals = {
//     breakfast: {
//       ...recommendedMeals.breakfast,
//       name: breakfastHits[0]?.label || recommendedMeals.breakfast.name
//     },
//     lunch: {
//       ...recommendedMeals.lunch,
//       name: lunchHits[0]?.label || recommendedMeals.lunch.name
//     },
//     supper: {
//       ...recommendedMeals.supper,
//       name: supperHits[0]?.label || recommendedMeals.supper.name
//     }
//   };

//   return {
//     energy: {
//       BMR: Math.round(BMR),
//       TDEE: Math.round(TDEE),
//       perMeal: Math.round(perMeal)
//     },
//     disease: outputDisease,
//     dietaryRestrictions: outputDietaryRestrictions,
//     recommendedMeals,
//     recipes: recipesLists.flat()
//   };
// };

import { getMealsByDisease } from "../services/dataset-service";
import { fetchRecipes } from "../services/recipe";
import { computeEnergyNeeds } from "../utils/energy";

import { prisma } from "../utils/init";
import { MealWithMacros, RecommendationResult } from "../utils/types";

type MealSlot = "breakfast" | "lunch" | "supper";

export const recommendationHandler = async (
  disease: string[] | null,
  userId: number,
  restrictions: string[]
): Promise<RecommendationResult> => {
  // 1. Load user & compute energy
  console.log("Inside recommendation Handler");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dietaryRestrictions: true,
      age: true,
      gender: true,
      activityLevel: true,
      height: true,
      weight: true,
    },
  });
  console.log("User data:", user);
  if (!user) throw new Error("User not found");
  if (
    !user.height ||
    !user.weight ||
    !user.age ||
    !user.gender ||
    !user.activityLevel
  ) {
    throw new Error("Incomplete user profile");
  }

  const { BMR, TDEE, perMeal } = computeEnergyNeeds({
    weightKg: user.weight,
    heightFeet: user.height,
    age: user.age,
    gender: user.gender,
    activityLevel: user.activityLevel,
  });
  console.log("Computed energy needs:", { BMR, TDEE, perMeal });

  // 2. Prepare defaults for output
  let outputDisease: string[] = [];
  let outputDietaryRestrictions = restrictions;
  const zeroMacros: MealWithMacros = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  let recommendedMeals: RecommendationResult["recommendedMeals"] = {
    breakfast: { name: "", macros: zeroMacros },
    lunch: { name: "", macros: zeroMacros },
    supper: { name: "", macros: zeroMacros },
  };
  console.log("Initial recommended meals:", recommendedMeals);
  // 3. Get recommendations
  let recipesLists: any[][] = [];
  console.log(recipesLists, "recipes before");
  const mealTypes: MealSlot[] = ["breakfast", "lunch", "supper"];
  let recipesByMeal: { [key in MealSlot]: any[] } = {
    breakfast: [],
    lunch: [],
    supper: [],
  };

  if (disease && disease.length > 0) {
    // Hybrid recommendation flow
    const data = await getMealsByDisease(
      restrictions,
      disease,
      user.age,
      user.gender,
      user.activityLevel,
      user.height,
      user.weight
    );
    console.log("user data",data)

    if (!data.length) throw new Error("No recommendations available");

    const selectedRec = data[0];

    outputDisease = [selectedRec.disease];

    // FIX: Handle string or array restrictions
    outputDietaryRestrictions = Array.isArray(selectedRec.dietaryRestrictions)
      ? selectedRec.dietaryRestrictions
      : [selectedRec.dietaryRestrictions];

    recommendedMeals = {
      breakfast: {
        name: selectedRec.recommendedMeals?.breakfast?.name ?? "",
        macros: selectedRec.recommendedMeals?.breakfast?.macros ?? zeroMacros,
      },
      lunch: {
        name: selectedRec.recommendedMeals?.lunch?.name ?? "",
        macros: selectedRec.recommendedMeals?.lunch?.macros ?? zeroMacros,
      },
      supper: {
        name: selectedRec.recommendedMeals?.supper?.name ?? "",
        macros: selectedRec.recommendedMeals?.supper?.macros ?? zeroMacros,
      },
    };

    // FIX: Combine restrictions safely
    const allRestrictions = [
      ...outputDietaryRestrictions,
      ...(user.dietaryRestrictions || []),
    ];

    // Fetch recipes with enhanced parameters
    recipesLists = await Promise.all(
      mealTypes.map(async (m) => {
        const apiMealType = m === "supper" ? "main course" : m;

        // Log before fetching
        console.log(`Fetching recipes for ${m}: ${recommendedMeals[m].name}`);

        const recipes = await fetchRecipes(
          recommendedMeals[m].name,
          allRestrictions,
          {
            min: Math.floor(perMeal * 0.3),
            max: Math.ceil(perMeal * 1.5),
          },
          apiMealType
        );

        // Log after fetching
        console.log(`Fetched ${recipes.length} recipes for ${m}`);
        return recipes;
      })
    );
    console.log("recipeLists",recipesLists)

    // Log all recipe lists together
    console.log("Fetched recipes lists:", recipesLists);
    recipesByMeal = {
      breakfast: recipesLists[0],
      lunch: recipesLists[1],
      supper: recipesLists[2],
    };
    console.log(recipesByMeal, "after recipe lists");
  } else {
    // Restrictions-only mode
    recipesLists = await Promise.all(
      mealTypes.map((m) => {
        const apiMealType = m === "supper" ? "main course" : m;
        return fetchRecipes("", restrictions, undefined, apiMealType);
      })
    );

    recommendedMeals = {
      breakfast: {
        name: recipesLists[0][0]?.label || "",
        macros: recipesLists[0][0]?.macros || zeroMacros,
      },
      lunch: {
        name: recipesLists[1][0]?.label || "",
        macros: recipesLists[1][0]?.macros || zeroMacros,
      },
      supper: {
        name: recipesLists[2][0]?.label || "",
        macros: recipesLists[2][0]?.macros || zeroMacros,
      },
    };
    recipesByMeal = {
      breakfast: recipesLists[0],
      lunch: recipesLists[1],
      supper: recipesLists[2],
    };
    console.log(recipesByMeal, "recipes by meals afterrrr");
  }

  // Update meal names from top recipe hits
  const [breakfastHits, lunchHits, supperHits] = recipesLists;
  recommendedMeals = {
    breakfast: {
      ...recommendedMeals.breakfast,
      name: breakfastHits[0]?.label || recommendedMeals.breakfast.name,
    },
    lunch: {
      ...recommendedMeals.lunch,
      name: lunchHits[0]?.label || recommendedMeals.lunch.name,
    },
    supper: {
      ...recommendedMeals.supper,
      name: supperHits[0]?.label || recommendedMeals.supper.name,
    },
  };

    console.log("recommended meals",recommendedMeals)


  console.log("handler test")
  return {
    energy: {
      BMR: Math.round(BMR),
      TDEE: Math.round(TDEE),
      perMeal: Math.round(perMeal),
    },
    disease: outputDisease.join(","),
    dietaryRestrictions: outputDietaryRestrictions,
    recommendedMeals: recommendedMeals,
    recipes: recipesLists.flat(),
  };
};
