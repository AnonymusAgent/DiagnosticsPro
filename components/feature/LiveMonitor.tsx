import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { ProgressBar } from '../ui/ProgressBar';
import type { MonitoringSnapshot } from '../../types/hardware';

interface LiveMonitorProps {
  data: MonitoringSnapshot | null;
}

export function LiveMonitor({ data }: LiveMonitorProps) {
  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>No monitoring data</Text>
      </View>
    );
  }

  const getCpuColor = (usage: number) => {
    if (usage > 80) return theme.colors.error;
    if (usage > 60) return theme.colors.warning;
    return theme.colors.success;
  };

  const getTempColor = (temp: number) => {
    if (temp > 60) return theme.colors.error;
    if (temp > 45) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.metric}>
        <View style={styles.metricHeader}>
          <Text style={styles.label}>CPU Usage</Text>
          <Text style={styles.value}>{data.cpuUsage.toFixed(1)}%</Text>
        </View>
        <ProgressBar value={data.cpuUsage} color={getCpuColor(data.cpuUsage)} showPercentage={false} />
      </View>

      <View style={styles.metric}>
        <View style={styles.metricHeader}>
          <Text style={styles.label}>RAM Usage</Text>
          <Text style={styles.value}>{data.ramUsage.toFixed(1)}%</Text>
        </View>
        <ProgressBar value={data.ramUsage} color={theme.colors.info} showPercentage={false} />
      </View>

      {data.gpuUsage && (
        <View style={styles.metric}>
          <View style={styles.metricHeader}>
            <Text style={styles.label}>GPU Usage</Text>
            <Text style={styles.value}>{data.gpuUsage.toFixed(1)}%</Text>
          </View>
          <ProgressBar value={data.gpuUsage} color={theme.colors.accent} showPercentage={false} />
        </View>
      )}

      <View style={styles.metric}>
        <View style={styles.metricHeader}>
          <Text style={styles.label}>Temperature</Text>
          <Text style={styles.value}>{data.temperature.toFixed(1)}°C</Text>
        </View>
        <ProgressBar value={data.temperature} max={80} color={getTempColor(data.temperature)} showPercentage={false} />
      </View>

      <View style={styles.metric}>
        <View style={styles.metricHeader}>
          <Text style={styles.label}>Battery</Text>
          <Text style={styles.value}>{data.batteryLevel}%</Text>
        </View>
        <ProgressBar value={data.batteryLevel} color={theme.colors.success} showPercentage={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  metric: {
    gap: theme.spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
  },
  noData: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
