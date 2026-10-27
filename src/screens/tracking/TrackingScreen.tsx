import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../../store';
import { useTrackingStore } from '../../store/trackingStore';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { AppIcon } from '../../components/common/AppIcon';
import { TrackingMapCanvas } from '../../components/tracking/TrackingMapCanvas';
import { TrackingStatsBar } from '../../components/tracking/TrackingStatsBar';
import { formatTime } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/calculations';

export const TrackingScreen: React.FC = () => {
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const trackerDevices = useAppStore((state) => state.trackerDevices);
  const distanceUnit = useAppStore((state) => state.settings.distanceUnit);
  const addActivityRecord = useAppStore((state) => state.addActivityRecord);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const tracker = activePet ? trackerDevices[activePet.id] : null;

  const {
    currentSession,
    status,
    history,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    resetTracking,
  } = useTrackingStore();

  const [usePhoneGps, setUsePhoneGps] = useState(false);
  const [gpsPermissionRequested, setGpsPermissionRequested] = useState(false);

  const isTracking = status === 'tracking';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';
  const isIdle = status === 'idle';

  const handleStart = () => {
    if (activePet) {
      startTracking(activePet.id);
    }
  };

  const handleStop = async () => {
    const finishedSession = stopTracking();
    if (finishedSession && finishedSession.totalDistanceKm > 0) {
      // Save this walk session as an activity record
      await addActivityRecord({
        petId: activePet.id,
        date: new Date().toISOString().split('T')[0],
        steps: Math.round(finishedSession.totalDistanceKm * 1400),
        distanceKm: finishedSession.totalDistanceKm,
        activeMinutes: Math.max(1, Math.round(finishedSession.durationSeconds / 60)),
        calories: Math.round(finishedSession.totalDistanceKm * 65),
        restingMinutes: 0,
      });
    }
  };

  const togglePhoneGpsMode = () => {
    setGpsPermissionRequested(true);
    setUsePhoneGps(!usePhoneGps);
  };

  const currentCoord = currentSession?.coordinates[currentSession.coordinates.length - 1] || null;

  return (
    <ScreenContainer>
      <AppHeader
        title="Live Tracker"
        subtitle={activePet ? `Monitoring ${activePet.name}` : undefined}
        showBackButton
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Mode & Demo Notice Banner */}
        <AppCard
          style={[
            styles.disclosureCard,
            { backgroundColor: theme.colors.primaryUltraLight },
          ]}
          padding="sm"
        >
          <View style={styles.disclosureRow}>
            <AppIcon name="information-circle" size={20} color={theme.colors.primary} />
            <View style={styles.disclosureText}>
              <AppText variant="captionBold" color="brand">
                PORTFOLIO DEMO MODE
              </AppText>
              <AppText variant="caption" color="secondary">
                Coordinates are simulated using realistic dog-walk telemetry to preserve battery & privacy.
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Map Canvas with animated path */}
        <TrackingMapCanvas
          coordinates={currentSession?.coordinates || []}
          currentCoordinate={currentCoord}
          isSimulating={!usePhoneGps}
          status={status}
        />

        {/* Stats bar (duration, distance, speed, battery) */}
        <TrackingStatsBar
          durationSeconds={currentSession?.durationSeconds || 0}
          distanceKm={currentSession?.totalDistanceKm || 0}
          speedKmh={currentSession?.currentSpeedKmh || 0}
          batteryLevel={tracker?.batteryLevel || 88}
        />

        {/* Main Control Buttons */}
        <View style={styles.controlsRow}>
          {isIdle && (
            <AppButton
              title="Start Live Walk"
              onPress={handleStart}
              variant="primary"
              size="lg"
              leftIcon="play"
              style={styles.fullBtn}
            />
          )}

          {isTracking && (
            <>
              <AppButton
                title="Pause"
                onPress={pauseTracking}
                variant="secondary"
                size="md"
                leftIcon="pause"
                style={styles.halfBtn}
              />
              <AppButton
                title="Finish Walk"
                onPress={handleStop}
                variant="danger"
                size="md"
                leftIcon="stop"
                style={styles.halfBtn}
              />
            </>
          )}

          {isPaused && (
            <>
              <AppButton
                title="Resume"
                onPress={resumeTracking}
                variant="primary"
                size="md"
                leftIcon="play"
                style={styles.halfBtn}
              />
              <AppButton
                title="Finish Walk"
                onPress={handleStop}
                variant="danger"
                size="md"
                leftIcon="stop"
                style={styles.halfBtn}
              />
            </>
          )}

          {isStopped && (
            <>
              <AppButton
                title="New Session"
                onPress={resetTracking}
                variant="primary"
                size="md"
                leftIcon="refresh"
                style={styles.halfBtn}
              />
              <AppButton
                title="Reset View"
                onPress={resetTracking}
                variant="ghost"
                size="md"
                style={styles.halfBtn}
              />
            </>
          )}
        </View>

        {/* Phone GPS Mode Toggle Box */}
        <AppCard style={styles.phoneGpsCard} padding="md">
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <AppText variant="bodyBold">Use Phone GPS Sensor</AppText>
              <AppText variant="caption" color="secondary">
                Explicitly uses device sensor for human phone position, not actual pet collar hardware.
              </AppText>
            </View>
            <TouchableOpacity
              onPress={togglePhoneGpsMode}
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: usePhoneGps ? theme.colors.primary : theme.colors.cardAlt,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  usePhoneGps && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {gpsPermissionRequested && usePhoneGps && (
            <View style={[styles.permNotice, { backgroundColor: theme.colors.cardAlt }]}>
              <AppIcon name="phone-portrait-outline" size={16} color={theme.colors.info} />
              <AppText variant="caption" color="secondary" style={styles.permText}>
                Phone GPS active. Note: This tracks this phone's coordinates.
              </AppText>
            </View>
          )}
        </AppCard>

        {/* Location History Logs */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Telemetry History</AppText>
          <AppText variant="caption" color="muted">
            {history.length} pings recorded
          </AppText>
        </View>

        {history.length > 0 ? (
          history.slice(0, 6).map((coord, idx) => (
            <AppCard key={idx} style={styles.historyCard} padding="sm">
              <View style={styles.historyRow}>
                <View style={styles.pingDot} />
                <View style={styles.historyCol}>
                  <AppText variant="bodyMedium">
                    {coord.latitude.toFixed(5)}° N, {Math.abs(coord.longitude).toFixed(5)}° W
                  </AppText>
                  <AppText variant="caption" color="muted">
                    Speed: {coord.speedKmh ? `${coord.speedKmh} km/h` : 'Moving'} • {formatTime(coord.timestamp)}
                  </AppText>
                </View>
                <AppText variant="captionBold" color="brand">
                  Waypoint #{history.length - idx}
                </AppText>
              </View>
            </AppCard>
          ))
        ) : (
          <AppCard padding="md" style={styles.emptyHistory}>
            <AppText variant="caption" color="secondary" align="center">
              Start a walk to record live coordinates.
            </AppText>
          </AppCard>
        )}
      </AppScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  disclosureCard: {
    marginBottom: 8,
  },
  disclosureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disclosureText: {
    flex: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  fullBtn: {
    flex: 1,
  },
  halfBtn: {
    flex: 1,
  },
  phoneGpsCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 12,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  permNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
  },
  permText: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyCard: {
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  historyCol: {
    flex: 1,
  },
  emptyHistory: {
    paddingVertical: 16,
  },
});
