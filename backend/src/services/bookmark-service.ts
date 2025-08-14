import { prisma } from "../utils/init"

// export async function listBookmarkUris(userId:number):Promise<string[]> {

//     if(!userId){
//         throw new Error("User ID is required")
//     }

//     const bookmark=await prisma.bookmark.findMany({
//         where:{userId},
//         select:{recipeUri:true}
//     })
//     console.log('Bookmarks from DB:', bookmark);
//     return bookmark.map((b: { recipeUri: any; })=>b.recipeUri)


// }


export async function listBookmarkUris(userId: number) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { recipeUri: true }
  });
  
  // This returns [{ recipeUri: 715446 }, { recipeUri: 123456 }]
  return bookmarks;
}