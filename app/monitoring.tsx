import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useMonitoring } from '../hooks/useMonitoring';
import { LiveMonitor } from '../components/feature/LiveMonitor';

export default function MonitoringScreen() {
  const insets = useSafeAreaInsets();
  const { isMonitoring, currentData, history, startMonitoring, stopMonitoring } = useMonitoring();

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Real-Time Monitoring',
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
          {/* Control Panel */}
          <View style={styles.controlPanel}>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: isMonitoring ? theme.colors.success : theme.colors.textTertiary }]} />
                <Text style={styles.statusText}>
                  {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
                </Text>
              </View>
              <Pressable
                style={[styles.controlButton, isMonitoring && styles.stopButton]}
                onPress={isMonitoring ? stopMonitoring : startMonitoring}
              >
                <MaterialIcons 
                  name={isMonitoring ? 'stop' : 'play-arrow'} 
                  size={20} 
                  color={theme.colors.text} 
                />
                <Text style={styles.controlButtonText}>
                  {isMonitoring ? 'Stop' : 'Start'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Live Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Metrics</Text>
            <LiveMonitor data={currentData} />
          </View>

          {/* Historical Data Info */}
          {history.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Statistics</Text>
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Data Points</Text>
                  <Text style={styles.statValue}>{history.length}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{Math.floor(history.length / 60)}m {history.length % 60}s</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Avg CPU</Text>
                  <Text style={styles.statValue}>
                    {(history.reduce((acc, d) => acc + d.cpuUsage, 0) / history.length).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Avg RAM</Text>
                  <Text style={styles.statValue}>
                    {(history.reduce((acc, d) => acc + d.ramUsage, 0) / history.length).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Monitoring captures real-time performance data. For advanced historical graphs and extended tracking, upgrade to Premium.
            </Text>
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
  controlPanel: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text,
    fontWeight: '500',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
  },
  controlButtonText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '600',
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
  statsCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text,
    fontWeight: '600',
    fontFamily: theme.fonts.mono,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.info + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.info + '40',
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
