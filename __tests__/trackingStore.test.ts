import { useTrackingStore } from '../src/store/trackingStore';

describe('Tracking Store Simulation Tests', () => {
  beforeEach(() => {
    useTrackingStore.getState().resetTracking();
  });

  afterEach(() => {
    useTrackingStore.getState().resetTracking();
  });

  it('starts tracking session with initial coordinates and status', () => {
    useTrackingStore.getState().startTracking('pet-01');

    const state = useTrackingStore.getState();
    expect(state.status).toBe('tracking');
    expect(state.currentSession).not.toBeNull();
    expect(state.currentSession?.petId).toBe('pet-01');
    expect(state.currentSession?.coordinates.length).toBeGreaterThan(0);
    expect(state.history.length).toBeGreaterThan(0);
  });

  it('pauses tracking and pauses interval correctly', () => {
    useTrackingStore.getState().startTracking('pet-01');
    useTrackingStore.getState().pauseTracking();

    const state = useTrackingStore.getState();
    expect(state.status).toBe('paused');
    expect(state.currentSession?.status).toBe('paused');
    expect(state.timerIntervalId).toBeNull();
  });

  it('resumes tracking session', () => {
    useTrackingStore.getState().startTracking('pet-01');
    useTrackingStore.getState().pauseTracking();
    useTrackingStore.getState().resumeTracking();

    const state = useTrackingStore.getState();
    expect(state.status).toBe('tracking');
    expect(state.currentSession?.status).toBe('tracking');
    expect(state.timerIntervalId).not.toBeNull();
  });

  it('stops tracking and returns completed session', () => {
    useTrackingStore.getState().startTracking('pet-01');
    const session = useTrackingStore.getState().stopTracking();

    expect(session).not.toBeNull();
    expect(session?.status).toBe('stopped');
    expect(session?.endTime).toBeDefined();
    expect(useTrackingStore.getState().status).toBe('stopped');
  });

  it('resets tracking back to idle state and clears session', () => {
    useTrackingStore.getState().startTracking('pet-01');
    useTrackingStore.getState().resetTracking();

    const state = useTrackingStore.getState();
    expect(state.status).toBe('idle');
    expect(state.currentSession).toBeNull();
    expect(state.history.length).toBe(0);
  });
});
