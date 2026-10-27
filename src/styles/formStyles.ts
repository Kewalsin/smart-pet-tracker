import { StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';

export const formStyles = StyleSheet.create({
  formGroup: {
    marginBottom: spacing.base,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 15,
  },
  textArea: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: spacing.xxs,
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
