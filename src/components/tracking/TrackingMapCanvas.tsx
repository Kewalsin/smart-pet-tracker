import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Line,
  G,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Coordinate } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../common/AppText';
import { AppIcon } from '../common/AppIcon';

interface TrackingMapCanvasProps {
  coordinates: Coordinate[];
  currentCoordinate: Coordinate | null;
  isSimulating: boolean;
  status: 'idle' | 'tracking' | 'paused' | 'stopped';
}

export const TrackingMapCanvas: React.FC<TrackingMapCanvasProps> = ({
  coordinates,
  currentCoordinate,
  isSimulating,
  status,
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const mapWidth = screenWidth - 32;
  const mapHeight = 320;

  // Coordinate normalizer for map viewport
  // Simulated bounding box around Central Park coords
  const minLat = 40.782;
  const maxLat = 40.788;
  const minLon = -73.968;
  const maxLon = -73.962;

  const latToY = (lat: number) => {
    const norm = (lat - minLat) / (maxLat - minLat);
    return mapHeight - 30 - norm * (mapHeight - 60);
  };

  const lonToX = (lon: number) => {
    const norm = (lon - minLon) / (maxLon - minLon);
    return 30 + norm * (mapWidth - 60);
  };

  // Generate SVG path string for breadcrumbs
  const pathD = coordinates.reduce((acc, coord, idx) => {
    const x = lonToX(coord.longitude);
    const y = latToY(coord.latitude);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const currX = currentCoordinate ? lonToX(currentCoordinate.longitude) : mapWidth / 2;
  const currY = currentCoordinate ? latToY(currentCoordinate.latitude) : mapHeight / 2;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.dark ? '#131A15' : '#EAF2EC',
        },
      ]}
    >
      {/* Simulation Badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: isSimulating ? theme.colors.primary : theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                status === 'tracking'
                  ? '#10B981'
                  : status === 'paused'
                  ? '#F59E0B'
                  : '#9CA3AF',
            },
          ]}
        />
        <AppText
          variant="badge"
          customColor={isSimulating ? '#FFFFFF' : theme.colors.textPrimary}
        >
          {status === 'tracking' ? 'LIVE DEMO SIMULATION' : 'SIMULATION READY'}
        </AppText>
      </View>

      <Svg width={mapWidth} height={mapHeight}>
        <Defs>
          <LinearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primaryLight} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Decorative Park Paths & Map Grid */}
        <Line x1={0} y1={80} x2={mapWidth} y2={80} stroke={theme.dark ? '#1E2822' : '#D5E5D8'} strokeWidth={1} strokeDasharray="6,6" />
        <Line x1={0} y1={160} x2={mapWidth} y2={160} stroke={theme.dark ? '#1E2822' : '#D5E5D8'} strokeWidth={1} strokeDasharray="6,6" />
        <Line x1={0} y1={240} x2={mapWidth} y2={240} stroke={theme.dark ? '#1E2822' : '#D5E5D8'} strokeWidth={1} strokeDasharray="6,6" />
        <Line x1={mapWidth * 0.33} y1={0} x2={mapWidth * 0.33} y2={mapHeight} stroke={theme.dark ? '#1E2822' : '#D5E5D8'} strokeWidth={1} strokeDasharray="6,6" />
        <Line x1={mapWidth * 0.66} y1={0} x2={mapWidth * 0.66} y2={mapHeight} stroke={theme.dark ? '#1E2822' : '#D5E5D8'} strokeWidth={1} strokeDasharray="6,6" />

        {/* Park features: Pond area */}
        <Rect
          x={mapWidth * 0.65}
          y={40}
          width={65}
          height={50}
          rx={20}
          fill={theme.dark ? '#182C38' : '#CFE4F7'}
        />
        <SvgText
          x={mapWidth * 0.65 + 32}
          y={70}
          fontSize="9"
          fill={theme.dark ? '#4F829E' : '#4682B4'}
          textAnchor="middle"
        >
          Meadow Lake
        </SvgText>

        {/* Trail path polyline */}
        {pathD ? (
          <>
            <Path
              d={pathD}
              stroke={theme.colors.primary}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Start marker */}
            <Circle
              cx={lonToX(coordinates[0].longitude)}
              cy={latToY(coordinates[0].latitude)}
              r={6}
              fill="#3B82F6"
            />
          </>
        ) : null}

        {/* Current Active Pet Marker */}
        {currentCoordinate && (
          <G>
            {/* Outer pulsating radar ring */}
            <Circle
              cx={currX}
              cy={currY}
              r={20}
              fill={theme.colors.primary}
              opacity={0.2}
            />
            <Circle
              cx={currX}
              cy={currY}
              r={12}
              fill={theme.colors.primaryLight}
              opacity={0.4}
            />
            {/* Main pet marker dot */}
            <Circle
              cx={currX}
              cy={currY}
              r={8}
              fill={theme.colors.primary}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </G>
        )}
      </Svg>

      {/* Floating GPS coords pill */}
      {currentCoordinate && (
        <View
          style={[
            styles.coordsOverlay,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AppIcon name="navigate" size={14} color={theme.colors.primary} />
          <AppText variant="caption" color="secondary" style={styles.coordsText}>
            {currentCoordinate.latitude.toFixed(4)}° N, {Math.abs(currentCoordinate.longitude).toFixed(4)}° W
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  coordsOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  coordsText: {
    fontSize: 11,
  },
});
