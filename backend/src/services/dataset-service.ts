import csv from "csv-parser";
import fs from "fs";
import { diseaseMacros, DiseaseMeal, MealMacroMap, MealWithMacros, MLRecommendationRequest, MLRecommendationResponse } from "../utils/types";



// Add ML API configuration
const ML_API_URL = "http://localhost:5000/predict";

export let diseaseMeals: DiseaseMeal[] = [];
export let mealMacros: MealMacroMap = {};


export async function getMLRecommendation(
  userData: MLRecommendationRequest
): Promise<MLRecommendationResponse | null> {
  try {
    const response = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("ML API Error");
    return await response.json();
  } catch (error) {
    console.error("Failed to get ML recommendation:", error);
    return null;
  }
}


/**
 * Load both the disease→meal mapping and the macros CSV into memory.
 */
export async function loadDataset(): Promise<void> {
  
  await Promise.all([
    loadDiseaseMeals("data/Food_and_Nutrition__.csv"),
    loadMealMacros("data/detailed_meals_macros_CLEANED.csv")
  ]);
  console.log("mealMacros keys:", Object.keys(mealMacros).slice(0,10));
}


/** Load the disease → [breakfast, lunch, dinner] mapping */
function loadDiseaseMeals(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)                    // ← updated path :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
      .pipe(csv())  
    //   .on("headers", headers => console.log("CSV headers:", headers))                            // ← csv-parser streaming API :contentReference[oaicite:2]{index=2}
    //   .on("headers", headers => console.log("CSV headers:", headers))                            // ← csv-parser streaming API :contentReference[oaicite:2]{index=2}
      .on("data", row => {
        const diseaseName = ((row["Dietary Preference"] || "")).split("/.").map((s:string)=>s.trim()).filter(Boolean)
       
        diseaseMeals.push({
          Disease: (row["Disease"] || row["Disease "]).trim(),
          Age: parseInt(row.Ages, 10),
          Recommended_Breakfast: (row["Breakfast Suggestion"] || "").trim(),
          Recommended_Lunch: (row["Lunch Suggestion"] || "").trim(),
          Recommended_Supper: (row["Dinner Suggestion"] || "").trim(),
          Dietary_Restrictions: ((row["Dietary Preference"] || ""))
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
            Gender:    row.Gender.trim().toLowerCase() as any,
            ActivityLevel: row["Activity Level"].replace(/\s/g,"") as any,
        });
      })
      .on("end", () => {
        console.log(`Loaded ${diseaseMeals.length} disease-meal entries`);
        
        
        resolve();
      })
      .on("error", reject);                    // ← stream error handling :contentReference[oaicite:3]{index=3}
  });
}


function loadMealMacros(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase().replace(/\.[0-9]+$/, '') }))
      .on('data', (row) => {
        console.log("All Rows",[row])
        // Store by meal name instead of disease
        const storeMeal = (mealType: string) => {
          const mealName = row[`${mealType} suggestion`]?.trim();
          if (!mealName) return;
          console.log("Meal Type",mealName)

          mealMacros[mealName.toLowerCase()] = {
            calories: parseFloat(row[`${mealType} calories`] || '0'),
            protein: parseFloat(row[`${mealType} protein`] || '0'),
            fat: parseFloat(row[`${mealType} fats`] || '0'),
            carbs: parseFloat(row[`${mealType} carbohydrates`] || '0')
          };
        };

        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(storeMeal);
      })
      .on('end', () => {
        console.log(`Loaded ${Object.keys(mealMacros).length} meal macros`);
        resolve();
      })
      .on('error', reject);
  });

 

}


// export const getMacros = (mealName: string) => 
//   mealMacros[mealName.toLowerCase()] 
    

/** Safely fetch macros by meal name (guards against undefined) */
const defaultMacros: MealWithMacros = { calories: 0, protein: 0, fat: 0, carbs: 0 };
export function getMacros(mealName?: string): MealWithMacros {
  if (typeof mealName !== "string") return defaultMacros;
  return mealMacros[mealName.toLowerCase()] || defaultMacros;
}





// export async function getMealsByDisease(
//   restrictions: string[],
//   disease: string,
//   age: number,
//   gender: string,
//   activityLevel: string,
//   height: number,
//   weight: number
// ) {
//   const findBestDiseaseKey = (targetDisease: string) => {
//     const normalized = targetDisease.toLowerCase().trim();
//     return Object.keys(mealMacros).find(key => 
//       key.toLowerCase().includes(normalized)
//     );
//   };

//   // First try ML recommendation
//   const diseaseKey = findBestDiseaseKey(disease) || disease.toLowerCase().trim();
//   const mlRecommendation = await getMLRecommendation({
//     age,
//     gender: gender.toLowerCase(),
//     height,
//     weight,
//     diseases: [disease],
//   });


//   if (mlRecommendation) {
 
  
//     return {
//       disease,
//       dietaryRestrictions: restrictions,
//       recommendedMeals: {
//         breakfast: {
//           name: mlRecommendation.breakfast,
//           macros: getMacros(mlRecommendation.breakfast)
//         },
//         lunch: {
//           name: mlRecommendation.lunch,
//           macros: getMacros(mlRecommendation.lunch) 
//         },
//         supper: {
//           name: mlRecommendation.dinner,
//           macros: getMacros(mlRecommendation.dinner) 
//         }
//       }
//     };
//   }

//   // Fallback to existing rule-based system
//   console.log("Falling back to rule-based recommendation");
//   const candidates = diseaseMeals.filter(m =>
//     m.Disease.toLowerCase() === disease.toLowerCase()
//   );

//   // ... keep your existing score-based matching system ...

//     const scoredMatches = candidates.map(m => {
//     let score = 0;
    
//     // Demographic matching
//     if (m.Gender === gender.toLowerCase()) score += 3;
//     if (Math.abs(m.Age - age) <= 5) score += 2;
//     if (m.ActivityLevel === activityLevel.replace(/\s/g, '')) score += 2;

//     // Dietary restriction matching
//     const matchRate = restrictions.filter(r => 
//       m.Dietary_Restrictions.includes(r)
//     ).length / Math.max(1, restrictions.length); // Prevent division by zero
//     score += matchRate * 5;

//     return { match: m, score };
//   });

//   // Return rule-based recommendation
//   const bestMatch = scoredMatches.sort((a, b) => b.score - a.score)[0]?.match;
//   if (!bestMatch) return null;

//   const macrosForDisease = mealMacros[bestMatch.Disease] || {
//     breakfast: { calories: 0, protein: 0, fat: 0, carbs: 0 },
//     lunch: { calories: 0, protein: 0, fat: 0, carbs: 0 },
//     supper: { calories: 0, protein: 0, fat: 0, carbs: 0 }
//   };

//   return {
//     disease: bestMatch.Disease,
//     dietaryRestrictions: bestMatch.Dietary_Restrictions,
//     recommendedMeals: {
//       breakfast: {
//         name: bestMatch.Recommended_Breakfast,
//         macros:getMacros(bestMatch.Recommended_Breakfast)
//       },
//       lunch: {
//         name: bestMatch.Recommended_Lunch,
//         macros: getMacros(bestMatch.Recommended_Lunch)
//       },
//       supper: {
//         name: bestMatch.Recommended_Supper,
//         macros: getMacros(bestMatch.Recommended_Supper)
//       }
//     }
//   };
// }

export async function getMealsByDisease(
  restrictions: string[],
  diseases: string[],
  age: number,
  gender: string,
  activityLevel: string,
  height: number,
  weight: number
) {
  const findBestDiseaseKey = (targetDisease: string) => {
    const normalized = targetDisease.toLowerCase().trim();
    return Object.keys(mealMacros).find(key =>
      key.toLowerCase().includes(normalized)
    );
  };

  const results = [];

  for (const disease of diseases) {
    // Attempt ML recommendation
    const diseaseKey = findBestDiseaseKey(disease) || disease.toLowerCase().trim();
    const mlRecommendation = await getMLRecommendation({
      age,
      gender: gender.toLowerCase(),
      height,
      weight,
      diseases: [disease], // Send one disease at a time
    });

    if (mlRecommendation) {
      results.push({
        disease,
        dietaryRestrictions: restrictions,
        recommendedMeals: {
          breakfast: {
            name: mlRecommendation.breakfast,
            macros: getMacros(mlRecommendation.breakfast)
          },
          lunch: {
            name: mlRecommendation.lunch,
            macros: getMacros(mlRecommendation.lunch)
          },
          supper: {
            name: mlRecommendation.dinner,
            macros: getMacros(mlRecommendation.dinner)
          }
        }
      });
      continue; // Skip fallback if ML result exists
    }

    // Fallback to rule-based system
    console.log(`Falling back to rule-based recommendation for ${disease}`);
    const candidates = diseaseMeals.filter(m =>
      m.Disease.toLowerCase() === disease.toLowerCase()
    );

    const scoredMatches = candidates.map(m => {
      let score = 0;

      // Demographic match
      if (m.Gender === gender.toLowerCase()) score += 3;
      if (Math.abs(m.Age - age) <= 5) score += 2;
      if (m.ActivityLevel === activityLevel.replace(/\s/g, '')) score += 2;

      // Dietary match
      const matchRate = restrictions.filter(r =>
        m.Dietary_Restrictions.includes(r)
      ).length / Math.max(1, restrictions.length);
      score += matchRate * 5;

      return { match: m, score };
    });

    const bestMatch = scoredMatches.sort((a, b) => b.score - a.score)[0]?.match;

    if (bestMatch) {
      results.push({
        disease: bestMatch.Disease,
        dietaryRestrictions: bestMatch.Dietary_Restrictions,
        recommendedMeals: {
          breakfast: {
            name: bestMatch.Recommended_Breakfast,
            macros: getMacros(bestMatch.Recommended_Breakfast)
          },
          lunch: {
            name: bestMatch.Recommended_Lunch,
            macros: getMacros(bestMatch.Recommended_Lunch)
          },
          supper: {
            name: bestMatch.Recommended_Supper,
            macros: getMacros(bestMatch.Recommended_Supper)
          }
        }
      });
    } else {
      results.push({
        disease,
        dietaryRestrictions: restrictions,
        recommendedMeals: {
          breakfast: { name: null, macros: null },
          lunch: { name: null, macros: null },
          supper: { name: null, macros: null }
        },
        note: "No recommendation found"
      });
    }
  }

  return results;
}
