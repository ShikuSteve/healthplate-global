import express, { Request, Response, NextFunction } from "express";
import { signinHandler, signupHandler } from "../handler/signup-signin";
import { recommendationHandler } from "../handler/meal-recommendation";
import { userUpdateHandler } from "../handler/user-update";
import { getBookmarkedRecipes, toggleBookmark } from "../handler/bookmark";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fullName, password } = req.body;

  try {
    const result = await signupHandler({ email, fullName, password });
    res.status(201).json(result);
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const result = await signinHandler({ email, password });
    res.status(201).json(result);
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
};

export const recipes=async(req:Request,res:Response,next:NextFunction)=>{
  const {userId,disease,restrictions}=req.body
  console.log(".,.,idehdueu")
  const uid = Number.parseInt(userId, 10); 
try{
  const result=await recommendationHandler(disease,uid,restrictions)
  res.status(201).json(result);

}catch(error:any){
  console.log(error);
if (error instanceof Error) {
res.status(400).json({ error: error.message });
next(error);
} else {
res.status(400).json({ error: "An unknown error occurred" });
next(new Error("An unknown error occurred"));
}
}

}


export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    fullName,
    activityLevel,
    age,
    dietaryRestrictions,
    healthConditions,
    gender,
    height,
    weight,
    phoneNumber,
    country,
    city,
  } = req.body;
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.imageUrl;
  console.log("Received imageUrl:", imageUrl);

  try {
    const result = await userUpdateHandler({
      email,
      fullName,
      activityLevel,
      age,
      dietaryRestrictions,
      healthConditions,
      gender,
      height,
      imageUrl,
      password: "",
      weight,
      phoneNumber,
      country,
      city,
    });
    res.status(201).json(result);
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
};

export const bookmarkToggle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, recipeUri } = req.body;

  try {
    const result = await toggleBookmark(Number(userId), recipeUri);
    res.status(201).json(result);
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
};

export const bookmarkedRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("yoooooooh");
  try {
    const userId = Number(req.query.userId);
    const result = await getBookmarkedRecipes(userId);
    console.log("Fetched recipes:", result);
    res.json({ count: result.length, result });
  } catch (error: any) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
};
