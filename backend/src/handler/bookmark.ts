import { listBookmarkUris } from "../services/bookmark-service";
import { fetchRecipeByUri } from "../services/recipe";
import { prisma } from "../utils/init";
import { ToggleBookmarkResult } from "../utils/types";

export async function toggleBookmark(
  userId: number,
  recipeUri: number
): Promise<ToggleBookmarkResult> {
  if (!userId || !recipeUri) {
    throw new Error("The userId or the recipeUri is missing");
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_recipeUri: { userId, recipeUri } },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_recipeUri: { userId, recipeUri } },
    });
    return { removed: true };
  } else {
    const bookmark = await prisma.bookmark.create({
      data: { userId, recipeUri },
    });
    return { removed: false, bookmark };
  }
}

// export async function getBookmarkedRecipes(userId: number) {
//     const uris = await listBookmarkUris(userId);
//     console.log("Bookmarks from DB:", uris);

//     const recipes = await Promise.all(
//       uris.map(async uri => {
//         try {
//           return await fetchRecipeByUri( userId);
//         } catch (error) {
//           console.error(`Failed to fetch ${uri}:`, error);
//           return null;
//         }
//       })
//     );

//     return recipes.filter(Boolean);
//   }

export async function getBookmarkedRecipes(userId: number) {
  const bookmarks = await listBookmarkUris(userId);
  console.log("✅ Bookmarks from DB:", bookmarks); // Should be 6 items

  const recipes = await Promise.all(
    bookmarks.map(async (bookmark) => {
      try {
        const recipe = await fetchRecipeByUri(bookmark.recipeUri);
        console.log("✅ Fetched recipe:", recipe);
        return recipe;
      } catch (error) {
        console.error(`❌ Failed to fetch ${bookmark.recipeUri}:`, error);
        return null;
      }
    })
  );

  const filtered = recipes.filter(Boolean);
  console.log("✅ Final recipe list:", filtered); // Check how many are returned
  return filtered;
}
