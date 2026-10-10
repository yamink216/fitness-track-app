/**
 * FitTrack Pro — Calculation Service
 * Centralized, pure calculation utility functions.
 * Note: These formulas provide general fitness guidelines and do not replace medical advice.
 */

/**
 * Calculate BMI given weight in kilograms and height in centimeters
 * @param {number} weightKg 
 * @param {number} heightCm 
 * @returns {{ bmi: number, category: string }}
 */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: "Unknown" };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  return { bmi, category };
}

/**
 * Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
 * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {string} gender 'Male' | 'Female' | 'Other'
 * @returns {number} Estimated daily resting calories
 */
function calculateBMR(weightKg, heightCm, age, gender = "Male") {
  if (!weightKg || !heightCm || !age) return 2000;
  const s = gender === "Female" ? -161 : 5;
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + s;
  return Math.round(Math.max(1200, bmr));
}

/**
 * Calculate suggested daily hydration target in milliliters based on bodyweight
 * General guideline: 35ml per kg body weight, clamped between 2000ml and 4000ml.
 * @param {number} weightKg
 * @returns {number} Target in ml
 */
function calculateHydrationTarget(weightKg) {
  if (!weightKg || weightKg <= 0) return 2500;
  const target = Math.round(weightKg * 35);
  return Math.max(2000, Math.min(4000, target));
}

/**
 * Calculate consecutive workout streak from a list of workout date objects
 * @param {Array<Date|string>} dates
 * @returns {number} Consecutive active days
 */
function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  const uniqueDateStrings = Array.from(
    new Set(
      dates.map((d) => new Date(d).toISOString().split("T")[0])
    )
  ).sort().reverse();

  if (uniqueDateStrings.length === 0) return 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // If user has not worked out today or yesterday, streak is broken
  if (!uniqueDateStrings.includes(todayStr) && !uniqueDateStrings.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let cursorDate = new Date();

  // If didn't work out today, start walking back from yesterday
  if (!uniqueDateStrings.includes(todayStr)) {
    cursorDate = new Date(Date.now() - 86400000);
  }

  while (true) {
    const iso = cursorDate.toISOString().split("T")[0];
    if (uniqueDateStrings.includes(iso)) {
      streak += 1;
      cursorDate.setDate(cursorDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate percentage progress towards a goal weight
 * @param {number} startingWeight
 * @param {number} currentWeight
 * @param {number} targetWeight
 * @returns {number} Progress from 0 to 100
 */
function calculateGoalWeightProgress(startingWeight, currentWeight, targetWeight) {
  if (currentWeight == null || targetWeight == null) return 0;
  if (startingWeight == null || startingWeight === targetWeight) {
    return currentWeight === targetWeight ? 100 : 50;
  }

  // Weight Loss Goal
  if (startingWeight > targetWeight) {
    if (currentWeight <= targetWeight) return 100;
    if (currentWeight >= startingWeight) return 0;
    const progress = ((startingWeight - currentWeight) / (startingWeight - targetWeight)) * 100;
    return Math.round(Math.min(100, Math.max(0, progress)));
  }

  // Muscle Gain / Weight Gain Goal
  if (startingWeight < targetWeight) {
    if (currentWeight >= targetWeight) return 100;
    if (currentWeight <= startingWeight) return 0;
    const progress = ((currentWeight - startingWeight) / (targetWeight - startingWeight)) * 100;
    return Math.round(Math.min(100, Math.max(0, progress)));
  }

  return 0;
}

module.exports = {
  calculateBMI,
  calculateBMR,
  calculateHydrationTarget,
  calculateStreak,
  calculateGoalWeightProgress
};
