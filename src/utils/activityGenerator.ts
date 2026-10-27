import { ActivityRecord } from '../types';

/**
 * Deterministic pseudo-random number generator using seed
 */
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

/**
 * Generates realistic historical activity records from 2023 up to current date
 */
export const generateHistoricalActivities = (
  petId: string,
  species: 'dog' | 'cat' | 'other' = 'dog',
  startYear = 2023
): ActivityRecord[] => {
  const records: ActivityRecord[] = [];
  const startDate = new Date(`${startYear}-01-01T00:00:00Z`);
  const endDate = new Date(); // current date in 2026

  let currentDate = new Date(startDate);
  let daySeed = petId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 100);

  const isDog = species === 'dog';
  const baseStepTarget = isDog ? 9000 : 4000;

  while (currentDate <= endDate) {
    daySeed++;
    const rand = pseudoRandom(daySeed);
    const dayOfWeek = currentDate.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const month = currentDate.getUTCMonth(); // 0 - 11

    // Weekend multiplier (longer walks on weekends)
    const weekendBonus = dayOfWeek === 0 || dayOfWeek === 6 ? 1.25 : 1.0;

    // Seasonal variation (summer = higher outdoor activity, winter = slightly lower)
    const seasonalFactor = month >= 4 && month <= 8 ? 1.15 : month >= 11 || month <= 1 ? 0.85 : 1.0;

    // 5% chance of a rest / lazy day
    const isRestDay = rand < 0.05;

    let steps = 0;
    if (isRestDay) {
      steps = Math.floor(baseStepTarget * (isDog ? 0.35 : 0.4) + rand * 1000);
    } else {
      const variation = 0.7 + rand * 0.7; // 0.7x to 1.4x
      steps = Math.floor(baseStepTarget * variation * weekendBonus * seasonalFactor);
    }

    const distanceKm = Number((steps * (isDog ? 0.00075 : 0.0005)).toFixed(2));
    const activeMinutes = Math.min(180, Math.max(20, Math.floor(steps / (isDog ? 110 : 80))));
    const calories = Math.floor(distanceKm * (isDog ? 55 : 30) + activeMinutes * 1.5);
    const restingMinutes = 1440 - activeMinutes - Math.floor(steps / 60);

    const dateStr = currentDate.toISOString().split('T')[0];

    records.push({
      id: `act-${petId}-${dateStr}`,
      petId,
      date: dateStr,
      steps,
      distanceKm,
      activeMinutes,
      calories,
      restingMinutes: Math.max(400, restingMinutes),
    });

    // Advance 1 day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  // Return sorted newest first
  return records.reverse();
};

export type HeatIntensity = 0 | 1 | 2 | 3;

/**
 * Calculates heatmap green color intensity:
 * 0: Under 30% goal (light neutral / inactive)
 * 1: 30% - 65% goal (Light Green)
 * 2: 65% - 99% goal (Medium Green)
 * 3: 100%+ goal (Deep Dark Forest Green)
 */
export const getActivityHeatLevel = (steps: number, goal = 8000): HeatIntensity => {
  const ratio = steps / goal;
  if (ratio < 0.3) return 0;
  if (ratio < 0.65) return 1;
  if (ratio < 1.0) return 2;
  return 3;
};

export const getHeatColor = (level: HeatIntensity, isDark = false): string => {
  if (isDark) {
    switch (level) {
      case 3:
        return '#2D6A4F'; // Dark Forest Green accent
      case 2:
        return '#1E5631'; // Forest medium
      case 1:
        return '#143826'; // Deep forest light
      case 0:
      default:
        return '#1B221E'; // Neutral dark grid tile
    }
  }

  switch (level) {
    case 3:
      return '#1B4332'; // Deepest forest green
    case 2:
      return '#40916C'; // Medium rich green
    case 1:
      return '#95D5B2'; // Vibrant light green
    case 0:
    default:
      return '#E5E7EB'; // Muted soft gray
  }
};

export interface YearlyStats {
  totalSteps: number;
  totalDistanceKm: number;
  activeDaysCount: number;
  goalMetDays: number;
  currentStreak: number;
  longestStreak: number;
}

export const calculateYearlyStats = (records: ActivityRecord[], year: number, goal = 8000): YearlyStats => {
  const yearStr = `${year}`;
  const yearRecords = records.filter((r) => r.date.startsWith(yearStr));

  let totalSteps = 0;
  let totalDistanceKm = 0;
  let activeDaysCount = 0;
  let goalMetDays = 0;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Process chronologically (oldest to newest)
  const chrono = [...yearRecords].reverse();

  chrono.forEach((rec) => {
    totalSteps += rec.steps;
    totalDistanceKm += rec.distanceKm;
    if (rec.steps > 0) activeDaysCount++;

    if (rec.steps >= goal) {
      goalMetDays++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  // Current streak from the end
  let streakCheck = 0;
  for (let i = 0; i < yearRecords.length; i++) {
    if (yearRecords[i].steps >= goal) {
      streakCheck++;
    } else {
      break;
    }
  }
  currentStreak = streakCheck;

  return {
    totalSteps,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    activeDaysCount,
    goalMetDays,
    currentStreak,
    longestStreak,
  };
};
