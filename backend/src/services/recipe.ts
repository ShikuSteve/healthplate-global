import axios from "axios";
import qs from "qs";
import { createClient } from "redis";

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
})();

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";
const CACHE_TTL = 3600; // 1 hour in seconds

const client = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// Helper function to generate cache keys
function generateCacheKey(endpoint: string, params: any): string {
  const paramString = qs.stringify(params, { arrayFormat: "repeat" });
  return `${endpoint}:${paramString}`;
}

const healthMap: Record<string, string> = {
  Vegetarian: "vegetarian",
  Vegan: "vegan",
  "Gluten-Free": "gluten-free",
  "Low-Sugar": "sugar-conscious",
  "Kidney-Friendly": "kidney-friendly",
  Pescatarian: "pescatarian",
  Mediterranean: "mediterranean",
  "Wheat-Free": "wheat-free",
  "Egg-Free": "egg-free",
  "Tree-Nut-Free": "tree-nut-free",
  "Fish-Free": "fish-free",
  "Shellfish-Free": "shellfish-free",
  "Pork-Free": "pork-free",
  "Red-Meat-Free": "red-meat-free",
  "Crustacean-Free": "crustacean-free",
  "Celery-Free": "celery-free",
  "Mustard-Free": "mustard-free",
  "Sesame-Free": "sesame-free",
  "Lupine-Free": "lupine-free",
  "Mollusk-Free": "mollusk-free",
  "Alcohol-Free": "alcohol-free",
  "Sulfite-Free": "sulfite-free",
  Kosher: "kosher",
};

const dietMap: Record<string, string> = {
  // Official Spoonacular diet types
  Vegetarian: "vegetarian",
  Vegan: "vegan",
  "Gluten-Free": "gluten free",
  Ketogenic: "ketogenic",
  "Lacto-Vegetarian": "lacto-vegetarian",
  "Ovo-Vegetarian": "ovo-vegetarian",
  Pescetarian: "pescetarian",
  Paleo: "paleo",
  Primal: "primal",
  "Low-FODMAP": "low fodmap",
  Whole30: "whole30",

  // Common nutritional approaches
  "High-Protein": "high-protein",
  "Low-Carb": "low-carb",
  Balanced: "balanced",

  // Special medical diets
  "Dairy-Free": "dairy free",
  "Low-Fat": "low fat",
  "Low-Sodium": "low sodium",
};

const intoleranceMap: Record<string, string> = {
  // Primary allergens
  Dairy: "dairy",
  Egg: "egg",
  Gluten: "gluten",
  Peanut: "peanut",
  Sesame: "sesame",
  Shellfish: "shellfish",
  Soy: "soy",
  Sulfite: "sulfite",
  "Tree-Nut": "tree nut",
  Wheat: "wheat",

  // Secondary intolerances
  Alcohol: "alcohol",
  Caffeine: "caffeine",
  Corn: "corn",
  Fish: "fish",
  Garlic: "garlic",
  Histamine: "histamine",
  Lupine: "lupine",
  Mustard: "mustard",
  Nightshade: "nightshade",
  Pork: "pork",
  "Red-Meat": "red meat",

  // Religious/cultural
  Halal: "halal",
  Kosher: "kosher",
};

function buildParams(
  query: string,
  restrictions: string[],
  calorieRange?: { min: number; max: number },
  mealType?: string
) {
  const params: any = {
    apiKey: process.env.SPOONACULAR_API_KEY,
    addRecipeInformation: true,
    addRecipeNutrition: false,
    fillIngredients: false,
    number: 5, // Reduced to conserve API calls
    instructionsRequired: true,
  };

  // Simplify query to main components
  // if (query) {
  //   params.query = query
  //     .replace(/with|and|served|plus/gi, ' ')
  //     .split(/,|\//)[0]
  //     .trim();
  // }

  if (query) {
    params.query = query
      .split(/\s|,|;/)[0] // First keyword only
      .replace(/[^a-zA-Z ]/g, "") // Remove special chars
      .trim();
  }

  // if (mealType) {
  //   params.type =
  //     mealType === 'breakfast' ? 'breakfast' :
  //     mealType === 'lunch'     ? 'main course' :
  //     mealType === 'supper'    ? 'main course' :
  //     undefined;
  // }

  // if (mealType) {
  //   const typeMap: Record<string, string> = {
  //     breakfast:  'breakfast',
  //     lunch:      'lunch',
  //     supper:     'main course',   // ← supper ⇒ main course
  //     dinner:     'main course',
  //     snack:      'snack',
  //     dessert:    'dessert'
  //     // add more if desired...
  //   };
  //   const key = mealType.toLowerCase();
  //   if (typeMap[key]) {
  //     params.type = typeMap[key];
  //   }
  // }

  // if (mealType) {
  //   params.mealType = mealType.toLowerCase(); // Use Spoonacular's mealType parameter
  //   params.tags = mealType.toLowerCase(); // Add tag filtering for better results
  // }

  if (mealType) {
    const typeMap: Record<string, string> = {
      breakfast: "breakfast",
      lunch: "main course", // ← map lunch → main course
      supper: "main course", // ← map supper → main course
      dinner: "main course",
      snack: "snack",
      dessert: "dessert",
    };
    const key = mealType.toLowerCase();
    if (typeMap[key]) {
      params.type = typeMap[key]; // ← this actually filters by meal category
    }
  }

  // Widen calorie ranges for better matches
  if (calorieRange) {
    if (mealType?.toLowerCase() === "supper") {
      // allow all mains, including low-calorie chilis
      params.minCalories = 0;
      params.maxCalories = Math.ceil(calorieRange.max * 1.2);
    } else {
      params.minCalories = Math.floor(calorieRange.min * 0.3);
      params.maxCalories = Math.ceil(calorieRange.max * 1.5);
    }
  }

  if (restrictions.includes("High-Protein")) {
    params.minProtein = 20;
  }

  if (restrictions.includes("Low-Carb")) {
    params.maxCarbs = 50;
  }

  // Diet filters (only take first match)
  const diet = restrictions.find((r) => dietMap[r]);
  if (diet) params.diet = dietMap[diet];

  // Intolerances
  const intolerances = restrictions
    .filter((r) => intoleranceMap[r])
    .map((r) => intoleranceMap[r]);
  if (intolerances.length) params.intolerances = intolerances.join(",");

  return params;
}

function extractMacros(nutrients: any[]) {
  const findAmt = (name: string) =>
    nutrients.find((n) => n.name.toLowerCase().includes(name.toLowerCase()))
      ?.amount || 0;

  return {
    calories: findAmt("calorie"),
    protein: findAmt("protein"),
    fat: findAmt("fat"),
    carbs: findAmt("carbohydrate"),
  };
}

client.interceptors.response.use(
  (response) => {
    console.log("[API Response]", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error(
      "[API Error]",
      error.config?.url,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);
function redisWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 5000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Redis timeout")), timeoutMs)
    ),
  ]);
}
export const fetchRecipes = async (
  query: string,
  restrictions: string[],
  calorieRange?: { min: number; max: number },
  mealType?: string
): Promise<any[]> => {
  const simplifiedQuery = query
    .replace(/with|and|served|plus/gi, " ")
    .split(/,|\//)[0]
    .trim();

  const params = buildParams(simplifiedQuery, restrictions,calorieRange,mealType);
  const cacheKey = generateCacheKey('complexSearch', params);

 console.log('🔑 Cache key:', cacheKey);
 console.log('📊 API params:', params);

  try {
   // Check cache first
    console.log('💾 Checking cache for key:', cacheKey);
   const cached = await redisClient.get(cacheKey);
    console.log('🔍 Cache result type:', typeof cached, 'Length:', cached?.length);
   if (cached) {
    //  console.log('Cache hit for search:', cacheKey);
    //  return JSON.parse(cached);
    console.log('✅ Cache HIT! Returning cached data for:', cacheKey);
      console.log('📄 Cached data preview:', cached.substring(0, 100) + '...');
      const parsed = JSON.parse(cached);
      console.log('📋 Parsed cached results count:', parsed?.length);
      return parsed;
   }

  console.log('❌ Cache miss, making API call...');

console.log('🌐 Making Spoonacular API request...');
    const searchResponse = await client.get(
      `${SPOONACULAR_BASE_URL}/complexSearch`,
      { params }
    );

    // Fallback to broader search if no results
    if (!searchResponse.data.results?.length) {
      return await broadFallbackSearch(params, simplifiedQuery, mealType);
    }

    // Process results
      console.log('⚙️ Processing recipe results...');
    const processed= await processRecipeResults(searchResponse.data.results,mealType);
     console.log('✅ Processed results count:', processed.length);

        // Cache with TTL
       
     await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(processed));
      console.log('🎉 fetchRecipes completed successfully');
    

    return processed;
    

  } catch (error:any) {
     console.error('❌ fetchRecipes ERROR occurred:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check specific error types
    if (error.code === 'ECONNREFUSED') {
      console.error('🔥 Redis connection refused');
    }
    if (error.response) {
      console.error('🌐 API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    return [];
  }
};
async function broadFallbackSearch(
  originalParams: any,
  query: string,
  mealType?: string
) {
  console.warn("No results, trying broader search...");

  const fallbackParams = {
    ...originalParams,
    query: query.split(" ")[0], // Use first word only
    minCalories: undefined,
    maxCalories: undefined,
    number: 5,
  };

  const response = await client.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
    params: fallbackParams,
  });

  return processRecipeResults(
    response.data.results?.slice(0, 3) || [],
    mealType
  );
}

async function processRecipeResults(results: any[], slot?: string) {
  console.log(
    `🔄 processRecipeResults called with ${results.length} recipes for slot: ${slot}`
  );

  if (!results || results.length === 0) {
    console.log("❌ No results to process, returning empty array");
    return [];
  }

  console.log(
    "📋 Recipe IDs to process:",
    results.map((r) => r.id)
  );

  try {
    const processedRecipes = await Promise.all(
      results.map(async (result, index) => {
        const recipeCacheKey = `recipe:${result.id}`;
        console.log(
          `🔍 Processing recipe ${index + 1}/${results.length}: ID ${result.id}`
        );

        try {
          // Skip Redis cache check for now to avoid hanging
          // const cachedRecipe = await redisClient.get(recipeCacheKey);
          // if (cachedRecipe) {
          //   console.log('Cache hit for recipe:', result.id);
          //   return JSON.parse(cachedRecipe);
          // }

          console.log(`🌐 Fetching detailed info for recipe ${result.id}...`);

          // Add timeout to the API call
          const detailResponse: any = await Promise.race([
            client.get(`${SPOONACULAR_BASE_URL}/${result.id}/information`, {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                includeNutrition: true,
              },
              timeout: 10000, // 10 second timeout
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error(`Timeout fetching recipe ${result.id}`)),
                12000
              )
            ),
          ]);

          console.log(
            `✅ Got details for recipe ${result.id}, status: ${detailResponse.status}`
          );

          const recipe = detailResponse.data;
          const formatted = formatRecipe(recipe, slot);

          console.log(`🎯 Formatted recipe: ${formatted?.label || "Unknown"}`);

          // Skip caching for now
          // await redisClient.setEx(recipeCacheKey, CACHE_TTL * 2, JSON.stringify(formatted));

          return formatted;
        } catch (recipeError: any) {
          console.error(
            `❌ Failed to process recipe ${result.id}:`,
            recipeError.message
          );
          console.error(`🔍 Recipe error details:`, recipeError);

          // Return a basic formatted version instead of null
          return {
            id: result.id,
            label: result.title || "Unknown Recipe",
            image: result.image || "",
            url: `https://spoonacular.com/recipes/${result.title?.replace(
              /\s+/g,
              "-"
            )}-${result.id}`,
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            error: true,
          };
        }
      })
    );

    // Filter out failed recipes
    const validRecipes = processedRecipes.filter((recipe) => recipe !== null);
    console.log(
      `🎉 processRecipeResults completed: ${validRecipes.length}/${results.length} recipes processed successfully`
    );
    console.log(
      `📋 Final recipe names:`,
      validRecipes.map((r) => r.label)
    );

    return validRecipes;
  } catch (error) {
    console.error("❌ processRecipeResults failed completely:", error);
    return [];
  }
}
function formatRecipe(recipe: any, mealType?: string) {
  return {
    id: recipe.id,
    label: recipe.title,
    mealType,
    ingredients: recipe.extendedIngredients.map((i: any) => i.original),
    instructions:
      recipe.analyzedInstructions[0]?.steps.map((s: any) => s.step) || [],
    macros: extractMacros(recipe.nutrition.nutrients),
    images: { REGULAR: { url: recipe.image } },
  };
}

export async function fetchRecipeByUri(
  spoonacularId: string | number
): Promise<ReturnType<typeof formatRecipe> | null> {
  if (!spoonacularId) {
    throw new Error("fetchRecipeByUri: spoonacularId is required");
  }

  const cacheKey = `recipe:${spoonacularId}`;

  try {
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Cache hit for recipe:", spoonacularId);
      return JSON.parse(cached);
    }

    // GET /recipes/{id}/information?includeNutrition=true&apiKey=...
    const response = await client.get(
      `${SPOONACULAR_BASE_URL}/${encodeURIComponent(
        spoonacularId
      )}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
        validateStatus: () => true,
      }
    );

    if (response.status === 404) {
      console.error(
        `[fetchRecipeByUri] Recipe ${spoonacularId} not found (404)`
      );
      return null;
    }
    if (response.status !== 200) {
      console.error(
        `[fetchRecipeByUri] Unexpected status ${response.status}`,
        response.data
      );
      throw new Error(`Spoonacular returned ${response.status}`);
    }

    const recipe = response.data;
    // Reuse your existing formatter to shape the payload
    const formatted = formatRecipe(recipe);

    // Cache the result
    await redisClient.setEx(cacheKey, CACHE_TTL * 2, JSON.stringify(formatted));

    return formatted;
  } catch (err: any) {
    console.error("[fetchRecipeByUri] Error fetching recipe:", err);
    return null;
  }
}
