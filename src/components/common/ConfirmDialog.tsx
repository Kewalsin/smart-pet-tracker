import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogWrapper}>
              <AppCard padding="lg" shadow="lg" style={styles.card}>
                <AppText variant="title" style={styles.title}>
                  {title}
                </AppText>
                <AppText variant="body" color="secondary" style={styles.message}>
                  {message}
                </AppText>

                <View style={styles.buttonRow}>
                  <AppButton
                    title={cancelText}
                    onPress={onCancel}
                    variant="ghost"
                    size="md"
                    style={styles.button}
                  />
                  <AppButton
                    title={confirmText}
                    onPress={onConfirm}
                    variant={isDestructive ? 'danger' : 'primary'}
                    size="md"
                    style={styles.button}
                  />
                </View>
              </AppCard>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    width: '100%',
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 90,
  },
});
