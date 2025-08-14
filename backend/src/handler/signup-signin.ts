import {
  emailValidator,
  generateToken,
  hashedPassword,
  passwordStrength,
  passwordValidate,
} from "../utils/auth";
import { prisma } from "../utils/init";
import { SigninData, SignupData } from "../utils/types";

export const signupHandler = async ({
  email,
  fullName,
  password,
  imageUrl,
}: SignupData) => {
  if (!email || !fullName || !password) {
    throw new Error("The user input is incomplete");
  }

  if (!emailValidator(email)) {
    throw new Error("Invalid Email format");
  }

  if (!passwordStrength(password)) {
    throw new Error(
      "Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
    );
  }

  const exitingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (exitingUser) {
    throw new Error("User with the provided email already exist");
  }

  const hashPassword = await hashedPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      password: hashPassword,
      imageUrl,
    },
  });

  const { accessToken, refreshToken } = generateToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl,
    },
    accessToken,
    refreshToken,
  };
};

export const signinHandler = async ({ email, password }: SigninData) => {
  if (!email || !password) {
    throw new Error("Email and password are required for user login");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User with the provided email does not exist");
  }

  const isValid = await passwordValidate(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = generateToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      dietaryRestrictions: user.dietaryRestrictions || [],
      healthConditions: user.healthConditions || [],
      activityLevel: user.activityLevel,
      age: user.age,
      country: user.country,
      city: user.city,
      phoneNumber: user.phoneNumber,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
    },
    accessToken,
    refreshToken,
  };
};
