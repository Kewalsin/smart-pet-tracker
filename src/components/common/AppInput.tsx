import React from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';
import { AppIcon, IconName } from './AppIcon';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const borderColor = error
    ? theme.colors.error
    : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="captionBold" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor,
          },
        ]}
      >
        {leftIcon && (
          <AppIcon
            name={leftIcon}
            size={20}
            color={theme.colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
            },
            props.multiline && styles.multiline,
            style,
          ]}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <AppIcon name={rightIcon} size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <AppText variant="caption" color="error" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 4,
  },
});
