import { prisma } from "../utils/init";
import { SignupData } from "../utils/types";

export async function userUpdateHandler(data: SignupData) {
  const {
    email,
    fullName,
    activityLevel,
    age,
    dietaryRestrictions,
    healthConditions,
    gender,
    height,
    imageUrl,
    weight,
    phoneNumber,
    country,
    city,
  } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User with the provided email not found");
  }

  const updateData = {
    fullName: fullName || undefined,
    imageUrl: imageUrl ?? null,
    age: age !== undefined ? Number(age) : undefined,
    height: height !== undefined ? Number(height) : undefined,
    weight: weight !== undefined ? Number(weight) : undefined,
    phoneNumber: phoneNumber ?? undefined,
    country: country ?? undefined,
    city: city ?? undefined,
    gender: gender !== undefined ? { set: gender } : undefined,
    activityLevel:
      activityLevel !== undefined ? { set: activityLevel } : undefined,
    dietaryRestrictions: Array.isArray(dietaryRestrictions)
      ? { set: dietaryRestrictions }
      : dietaryRestrictions
      ? { set: [dietaryRestrictions] }
      : undefined,
    healthConditions: Array.isArray(healthConditions)
      ? { set: healthConditions }
      : healthConditions
      ? { set: [healthConditions] }
      : undefined,
  };

  const updatedUser = await prisma.user.update({
    where: { email },
    data: updateData,
  });

  return updatedUser;
}
