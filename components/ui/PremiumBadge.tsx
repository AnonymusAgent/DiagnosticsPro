import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export function PremiumBadge() {
  return (
    <View style={styles.badge}>
      <MaterialIcons name="stars" size={14} color={theme.colors.premium} />
      <Text style={styles.text}>PRO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.premium + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.premium,
    gap: 4,
  },
  text: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
    color: theme.colors.premium,
  },
});
