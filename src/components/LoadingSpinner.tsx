import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {useTheme} from '../context';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[styles.message, {color: colors.textSecondary}]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
});

