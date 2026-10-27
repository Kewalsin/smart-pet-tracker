import { create } from 'zustand';
import { Coordinate, TrackingSession, TrackingStatus } from '../types';
import { SIMULATED_GPS_COORDINATES } from '../constants/mockData';
import { calculateDistanceBetweenCoordinates } from '../utils/calculations';

interface TrackingState {
  currentSession: TrackingSession | null;
  status: TrackingStatus;
  currentIndex: number;
  timerIntervalId: any;
  history: Coordinate[];

  startTracking: (petId: string) => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => TrackingSession | null;
  resetTracking: () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  currentSession: null,
  status: 'idle',
  currentIndex: 0,
  timerIntervalId: null,
  history: [],

  startTracking: (petId: string) => {
    // Clear any active interval
    const existingInterval = get().timerIntervalId;
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const startCoord = {
      ...SIMULATED_GPS_COORDINATES[0],
      timestamp: Date.now(),
    };

    const newSession: TrackingSession = {
      id: `session-${Date.now()}`,
      petId,
      startTime: Date.now(),
      durationSeconds: 0,
      coordinates: [startCoord],
      totalDistanceKm: 0,
      averageSpeedKmh: startCoord.speedKmh || 4.5,
      currentSpeedKmh: startCoord.speedKmh || 4.5,
      status: 'tracking',
      isSimulation: true,
    };

    set({
      currentSession: newSession,
      status: 'tracking',
      currentIndex: 0,
      history: [startCoord],
    });

    const interval = setInterval(() => {
      const state = get();
      if (state.status !== 'tracking' || !state.currentSession) return;

      const nextIndex = (state.currentIndex + 1) % SIMULATED_GPS_COORDINATES.length;
      const rawCoord = SIMULATED_GPS_COORDINATES[nextIndex];
      const newCoord: Coordinate = {
        ...rawCoord,
        timestamp: Date.now(),
      };

      const prevCoord = state.currentSession.coordinates[state.currentSession.coordinates.length - 1];
      const legDist = calculateDistanceBetweenCoordinates(prevCoord, newCoord);
      const newTotalDist = state.currentSession.totalDistanceKm + legDist;
      const newDuration = state.currentSession.durationSeconds + 2;
      const avgSpeed = newDuration > 0 ? (newTotalDist / (newDuration / 3600)) : (rawCoord.speedKmh || 5);

      const updatedSession: TrackingSession = {
        ...state.currentSession,
        durationSeconds: newDuration,
        coordinates: [...state.currentSession.coordinates, newCoord],
        totalDistanceKm: Number(newTotalDist.toFixed(3)),
        currentSpeedKmh: rawCoord.speedKmh || 5.0,
        averageSpeedKmh: Number(avgSpeed.toFixed(1)),
      };

      set({
        currentSession: updatedSession,
        currentIndex: nextIndex,
        history: [newCoord, ...state.history],
      });
    }, 2000);

    set({ timerIntervalId: interval });
  },

  pauseTracking: () => {
    const { timerIntervalId, currentSession } = get();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    if (currentSession) {
      set({
        status: 'paused',
        timerIntervalId: null,
        currentSession: { ...currentSession, status: 'paused' },
      });
    }
  },

  resumeTracking: () => {
    const state = get();
    if (!state.currentSession || state.status !== 'paused') return;

    set({
      status: 'tracking',
      currentSession: { ...state.currentSession, status: 'tracking' },
    });

    const interval = setInterval(() => {
      const s = get();
      if (s.status !== 'tracking' || !s.currentSession) return;

      const nextIndex = (s.currentIndex + 1) % SIMULATED_GPS_COORDINATES.length;
      const rawCoord = SIMULATED_GPS_COORDINATES[nextIndex];
      const newCoord: Coordinate = {
        ...rawCoord,
        timestamp: Date.now(),
      };

      const prevCoord = s.currentSession.coordinates[s.currentSession.coordinates.length - 1];
      const legDist = calculateDistanceBetweenCoordinates(prevCoord, newCoord);
      const newTotalDist = s.currentSession.totalDistanceKm + legDist;
      const newDuration = s.currentSession.durationSeconds + 2;
      const avgSpeed = newDuration > 0 ? (newTotalDist / (newDuration / 3600)) : (rawCoord.speedKmh || 5);

      const updatedSession: TrackingSession = {
        ...s.currentSession,
        durationSeconds: newDuration,
        coordinates: [...s.currentSession.coordinates, newCoord],
        totalDistanceKm: Number(newTotalDist.toFixed(3)),
        currentSpeedKmh: rawCoord.speedKmh || 5.0,
        averageSpeedKmh: Number(avgSpeed.toFixed(1)),
      };

      set({
        currentSession: updatedSession,
        currentIndex: nextIndex,
        history: [newCoord, ...s.history],
      });
    }, 2000);

    set({ timerIntervalId: interval });
  },

  stopTracking: () => {
    const { timerIntervalId, currentSession } = get();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }

    if (currentSession) {
      const completedSession: TrackingSession = {
        ...currentSession,
        endTime: Date.now(),
        status: 'stopped',
      };

      set({
        currentSession: completedSession,
        status: 'stopped',
        timerIntervalId: null,
      });

      return completedSession;
    }
    return null;
  },

  resetTracking: () => {
    const { timerIntervalId } = get();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    set({
      currentSession: null,
      status: 'idle',
      currentIndex: 0,
      timerIntervalId: null,
      history: [],
    });
  },
}));
