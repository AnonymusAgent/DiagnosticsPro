import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = theme.colors.primary, 
  showPercentage = true,
  height = 8 
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: color,
              height 
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  track: {
    flex: 1,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  percentage: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
    minWidth: 40,
    textAlign: 'right',
  },
});
