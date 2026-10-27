import { StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  screenHeader: {
    marginBottom: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  safeArea: {
    flex: 1,
  },
});
