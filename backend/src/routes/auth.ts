import express, { Request, Response } from "express";
import {
  bookmarkedRecipes,
  bookmarkToggle,
  recipes,
  signin,
  signup,
  updateUser,
} from "../controller";
import axios from "axios";
import { upload } from "../middleware/multer.middleware";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.put("/update", upload.single("image"), updateUser);
// authRoute.put("/update",updateUser)
authRoute.post("/recommend", recipes);
authRoute.post("/bookmark", bookmarkToggle);
authRoute.get("/bookmarks", bookmarkedRecipes);

// Add endpoint to check API status
authRoute.get("/api-status", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(
      "https://api.spoonacular.com/food/ingredients/search",
      {
        timeout: 5000,
        params: {
          apiKey: "616572a845b44ce7b0592d5309c45f6b",
          query: "test",
          number: 1,
        },
      }
    );
    res.json({ status: "operational", spoonacularStatus: data.status || "OK" });
  } catch (err: any) {
    console.error("API Status Check Failed:", err.message);
    res.status(500).json({
      status: "unavailable",
      error: err.message,
    });
  }
});

export default authRoute;
