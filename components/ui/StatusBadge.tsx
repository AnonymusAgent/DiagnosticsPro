import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface StatusBadgeProps {
  status: 'passed' | 'failed' | 'warning' | 'Good' | 'Fair' | 'Poor';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getColor = () => {
    switch (status) {
      case 'passed':
      case 'Good':
        return theme.colors.success;
      case 'warning':
      case 'Fair':
        return theme.colors.warning;
      case 'failed':
      case 'Poor':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const color = getColor();
  
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>
        {label || status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  text: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
  },
});
