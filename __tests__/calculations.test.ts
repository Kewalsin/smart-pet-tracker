import {
  convertDistance,
  formatDistance,
  convertWeight,
  formatWeight,
  calculateDistanceBetweenCoordinates,
  calculateTotalDistance,
  calculateWeeklyTotals,
} from '../src/utils/calculations';
import { ActivityRecord, Coordinate } from '../src/types';

describe('Calculations Utility Tests', () => {
  describe('Distance Conversions & Formatting', () => {
    it('converts km to miles accurately', () => {
      const km = 10;
      const miles = convertDistance(km, 'mi');
      expect(miles).toBeCloseTo(6.21371, 4);
    });

    it('keeps km unchanged when unit is km', () => {
      expect(convertDistance(15.5, 'km')).toBe(15.5);
    });

    it('formats distance string properly with unit label', () => {
      expect(formatDistance(5.245, 'km', 2)).toBe('5.25 km');
      expect(formatDistance(5, 'mi', 1)).toBe('3.1 mi');
    });
  });

  describe('Weight Conversions & Formatting', () => {
    it('converts kg to pounds accurately', () => {
      const kg = 10;
      const lbs = convertWeight(kg, 'lbs');
      expect(lbs).toBeCloseTo(22.0462, 3);
    });

    it('keeps kg unchanged when unit is kg', () => {
      expect(convertWeight(28.5, 'kg')).toBe(28.5);
    });

    it('formats weight string properly with unit label', () => {
      expect(formatWeight(28.5, 'kg', 1)).toBe('28.5 kg');
      expect(formatWeight(10, 'lbs', 1)).toBe('22.0 lbs');
    });
  });

  describe('GPS Coordinate Distance Calculations', () => {
    it('calculates 0 distance for identical coordinates', () => {
      const point: Coordinate = { latitude: 40.7829, longitude: -73.9654, timestamp: 0 };
      expect(calculateDistanceBetweenCoordinates(point, point)).toBe(0);
    });

    it('calculates accurate distance between two New York coordinates', () => {
      const p1: Coordinate = { latitude: 40.7829, longitude: -73.9654, timestamp: 0 };
      const p2: Coordinate = { latitude: 40.7851, longitude: -73.9632, timestamp: 10 };
      const dist = calculateDistanceBetweenCoordinates(p1, p2);
      expect(dist).toBeGreaterThan(0.2);
      expect(dist).toBeLessThan(0.4);
    });

    it('calculates total distance for empty or single coordinate as 0', () => {
      expect(calculateTotalDistance([])).toBe(0);
      expect(calculateTotalDistance([{ latitude: 0, longitude: 0, timestamp: 0 }])).toBe(0);
    });

    it('accumulates cumulative distance across a path', () => {
      const path: Coordinate[] = [
        { latitude: 40.7829, longitude: -73.9654, timestamp: 0 },
        { latitude: 40.7838, longitude: -73.9644, timestamp: 10 },
        { latitude: 40.7851, longitude: -73.9632, timestamp: 20 },
      ];
      const total = calculateTotalDistance(path);
      expect(total).toBeGreaterThan(0.2);
    });
  });

  describe('Weekly Totals Aggregation', () => {
    const mockRecords: ActivityRecord[] = [
      { id: '1', petId: 'p1', date: '2026-10-20', steps: 8000, distanceKm: 5.0, activeMinutes: 60, calories: 300, restingMinutes: 700 },
      { id: '2', petId: 'p1', date: '2026-10-21', steps: 10000, distanceKm: 7.0, activeMinutes: 80, calories: 400, restingMinutes: 680 },
    ];

    it('calculates totals and averages correctly', () => {
      const result = calculateWeeklyTotals(mockRecords);
      expect(result.totalSteps).toBe(18000);
      expect(result.totalDistanceKm).toBe(12.0);
      expect(result.totalActiveMinutes).toBe(140);
      expect(result.totalCalories).toBe(700);
      expect(result.avgSteps).toBe(9000);
      expect(result.avgDistanceKm).toBe(6.0);
      expect(result.avgActiveMinutes).toBe(70);
    });
  });
});
