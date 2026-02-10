import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { usePremium } from '../hooks/usePremium';
import { useAlert } from '../template';
import { PREMIUM_PRICE, getPremiumFeatures } from '../services/premiumService';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium, activatePremium } = usePremium();
  const { showAlert } = useAlert();

  const handleUpgrade = () => {
    showAlert(
      'Upgrade to Premium',
      `Unlock all features for ${PREMIUM_PRICE}. This is a demo app, so this button simulates the upgrade.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate Purchase', 
          onPress: () => {
            activatePremium();
            showAlert('Success', 'Premium activated! All features unlocked.');
          }
        },
      ]
    );
  };

  const features = getPremiumFeatures();

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Status */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <MaterialIcons 
                name={isPremium ? 'stars' : 'lock'} 
                size={32} 
                color={isPremium ? theme.colors.premium : theme.colors.textSecondary} 
              />
              <Text style={styles.statusTitle}>
                {isPremium ? 'Premium Active' : 'Free Version'}
              </Text>
            </View>
            {!isPremium && (
              <Text style={styles.statusDescription}>
                Upgrade to unlock unlimited stress tests, advanced analytics, and export features.
              </Text>
            )}
          </View>

          {/* Premium Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Features</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <MaterialIcons 
                  name={isPremium || feature.free ? 'check-circle' : 'lock'} 
                  size={20} 
                  color={isPremium || feature.free ? theme.colors.success : theme.colors.textTertiary} 
                />
                <Text style={styles.featureName}>{feature.name}</Text>
              </View>
            ))}
          </View>

          {/* Upgrade Button */}
          {!isPremium && (
            <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
              <MaterialIcons name="stars" size={20} color={theme.colors.background} />
              <Text style={styles.upgradeButtonText}>Upgrade to Premium - {PREMIUM_PRICE}</Text>
            </Pressable>
          )}

          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>Hardware Diagnostics Pro</Text>
              <Text style={styles.infoSubtext}>Version 1.0.0</Text>
              <Text style={styles.infoSubtext}>Professional device diagnostics and stress testing</Text>
            </View>
          </View>

          <View style={{ height: insets.bottom + 16 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  statusCard: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statusDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  featureName: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.premium,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  upgradeButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '700',
    color: theme.colors.background,
  },
  infoCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  infoText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoSubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
