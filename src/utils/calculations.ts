import { Coordinate, DistanceUnit, WeightUnit, ActivityRecord } from '../types';

/**
 * Converts kilometers to miles if unit is 'mi'
 */
export const convertDistance = (km: number, unit: DistanceUnit): number => {
  if (unit === 'mi') {
    return km * 0.621371;
  }
  return km;
};

export const formatDistance = (km: number, unit: DistanceUnit, decimals = 2): string => {
  const converted = convertDistance(km, unit);
  return `${converted.toFixed(decimals)} ${unit}`;
};

/**
 * Converts kilograms to pounds if unit is 'lbs'
 */
export const convertWeight = (kg: number, unit: WeightUnit): number => {
  if (unit === 'lbs') {
    return kg * 2.20462;
  }
  return kg;
};

export const formatWeight = (kg: number, unit: WeightUnit, decimals = 1): string => {
  const converted = convertWeight(kg, unit);
  return `${converted.toFixed(decimals)} ${unit}`;
};

/**
 * Calculates Great-Circle distance using Haversine formula (returns kilometers)
 */
export const calculateDistanceBetweenCoordinates = (
  coord1: Coordinate,
  coord2: Coordinate
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates total cumulative distance of a path of coordinates
 */
export const calculateTotalDistance = (coordinates: Coordinate[]): number => {
  if (coordinates.length < 2) return 0;
  let totalKm = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalKm += calculateDistanceBetweenCoordinates(coordinates[i - 1], coordinates[i]);
  }
  return totalKm;
};

/**
 * Aggregates weekly totals and averages
 */
export const calculateWeeklyTotals = (records: ActivityRecord[]) => {
  const totalSteps = records.reduce((sum, r) => sum + r.steps, 0);
  const totalDistanceKm = records.reduce((sum, r) => sum + r.distanceKm, 0);
  const totalActiveMinutes = records.reduce((sum, r) => sum + r.activeMinutes, 0);
  const totalCalories = records.reduce((sum, r) => sum + r.calories, 0);

  const count = records.length || 1;
  const avgSteps = Math.round(totalSteps / count);
  const avgDistanceKm = totalDistanceKm / count;
  const avgActiveMinutes = Math.round(totalActiveMinutes / count);

  return {
    totalSteps,
    totalDistanceKm,
    totalActiveMinutes,
    totalCalories,
    avgSteps,
    avgDistanceKm,
    avgActiveMinutes,
  };
};
