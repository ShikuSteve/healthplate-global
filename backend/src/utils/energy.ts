export function computeEnergyNeeds(params: {
  weightKg: number;
  // single number: feet.inches (e.g. 5.3 for 5′3″, 5.12 for 5′12″)
  heightFeet: number;
  age: number;
  gender: "male" | "female";
  activityLevel:
    | "Sedentary"
    | "LightlyActive"
    | "ModeratelyActive"
    | "VeryActive"
    | "ExtraActive";
}) {
  const { weightKg, heightFeet, age, gender, activityLevel } = params;

  // ─── Split feet vs inches from the numeric value ──────────────────────
  const feet = Math.floor(heightFeet);
  const decimalPart = heightFeet - feet;
  // grab the decimal digits as a string, e.g. "3" from 5.3 or "12" from 5.12
  const decimalStr = heightFeet.toString().split('.')[1] || '0';
  const inches = parseInt(decimalStr, 10);

  // sanity check
  if (inches >= 12) {
    throw new Error(
      `Invalid inches portion (${inches}). Inches must be between 0 and 11.`
    );
  }

  // Convert total to centimetres
  const totalInches = feet * 12 + inches;
  const heightCm = totalInches * 2.54;

  // ─── BMR & TDEE calculation ──────────────────────────────────────────
  const s = gender === "male" ? +5 : -161;
  const BMR = 10 * weightKg + 6.25 * heightCm - 5 * age + s;

  const activityFactors = {
    Sedentary: 1.2,
    LightlyActive: 1.375,
    ModeratelyActive: 1.55,
    VeryActive: 1.725,
    ExtraActive: 1.9,
  } as const;

  const TDEE = BMR * activityFactors[activityLevel];
  const perMeal = TDEE / 3;

  return { BMR, TDEE, perMeal };
}
