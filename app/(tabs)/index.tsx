import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { useHardwareInfo } from '../../hooks/useHardwareInfo';
import { MetricCard } from '../../components/ui/MetricCard';
import { HardwareCard } from '../../components/feature/HardwareCard';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { loading, cpu, gpu, ram, storage, battery, network, display, device, sensors, refresh } = useHardwareInfo();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Scanning Hardware...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Hardware Diagnostics</Text>
            <Text style={styles.subtitle}>{device?.manufacturer} {device?.model}</Text>
          </View>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <MaterialIcons name="settings" size={24} color={theme.colors.textSecondary} />
          </Pressable>
        </View>

        {/* Quick Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <MetricCard
              icon="memory"
              label="CPU Usage"
              value={`${cpu?.usage[0].toFixed(1)}%`}
              subtitle={`${cpu?.cores} cores @ ${cpu?.frequency}MHz`}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.metricItem}>
            <MetricCard
              icon="storage"
              label="RAM"
              value={`${ram?.usagePercent.toFixed(0)}%`}
              subtitle={`${(ram?.used || 0 / 1024).toFixed(1)}GB / ${(ram?.total || 0 / 1024).toFixed(1)}GB`}
              color={theme.colors.info}
            />
          </View>
          <View style={styles.metricItem}>
            <MetricCard
              icon="battery-charging-full"
              label="Battery"
              value={`${battery?.level}%`}
              subtitle={`${battery?.temperature.toFixed(1)}°C`}
              color={theme?.level && battery.level > 20 ? theme.colors.success : theme.colors.warning}
            />
          </View>
          <View style={styles.metricItem}>
            <MetricCard
              icon="storage"
              label="Storage"
              value={`${storage?.free.toFixed(0)}GB`}
              subtitle={`${storage?.used.toFixed(0)}GB used of ${storage?.total}GB`}
              color={theme.colors.accent}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable style={styles.actionButton} onPress={() => router.push('/monitoring')}>
              <MaterialIcons name="show-chart" size={28} color={theme.colors.primary} />
              <Text style={styles.actionLabel}>Monitor</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => router.push('/stress-test')}>
              <MaterialIcons name="speed" size={28} color={theme.colors.warning} />
              <Text style={styles.actionLabel}>Stress Test</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => router.push('/sensors')}>
              <MaterialIcons name="sensors" size={28} color={theme.colors.success} />
              <Text style={styles.actionLabel}>Sensors</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => router.push('/reports')}>
              <MaterialIcons name="assessment" size={28} color={theme.colors.info} />
              <Text style={styles.actionLabel}>Reports</Text>
            </Pressable>
          </View>
        </View>

        {/* Detailed Hardware Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hardware Details</Text>
          
          {/* CPU */}
          <HardwareCard title="Processor" icon="memory">
            <InfoRow label="Model" value={cpu?.model || 'Unknown'} />
            <InfoRow label="Architecture" value={cpu?.architecture || 'Unknown'} mono />
            <InfoRow label="Cores" value={cpu?.cores.toString() || '0'} mono />
            <InfoRow label="Frequency" value={`${cpu?.frequency} MHz`} mono />
          </HardwareCard>

          {/* GPU */}
          <HardwareCard title="Graphics" icon="videogame-asset">
            <InfoRow label="Model" value={gpu?.model || 'Unknown'} />
            <InfoRow label="Renderer" value={gpu?.renderer || 'Unknown'} />
            <InfoRow label="Vendor" value={gpu?.vendor || 'Unknown'} />
            {gpu?.usage !== undefined && <InfoRow label="Usage" value={`${gpu.usage.toFixed(1)}%`} mono />}
          </HardwareCard>

          {/* Battery */}
          <HardwareCard title="Battery" icon="battery-charging-full">
            <InfoRow label="Level" value={`${battery?.level}%`} mono />
            <InfoRow label="Health" value={battery?.health || 'Unknown'} />
            <InfoRow label="Temperature" value={`${battery?.temperature.toFixed(1)}°C`} mono />
            <InfoRow label="Voltage" value={`${battery?.voltage.toFixed(2)}V`} mono />
            {battery?.chargeCycles && <InfoRow label="Charge Cycles" value={battery.chargeCycles.toString()} mono />}
            <InfoRow label="Status" value={battery?.isCharging ? 'Charging' : 'Discharging'} />
          </HardwareCard>

          {/* Storage */}
          <HardwareCard title="Storage" icon="storage">
            <InfoRow label="Type" value={storage?.type || 'Unknown'} />
            <InfoRow label="Total Capacity" value={`${storage?.total}GB`} mono />
            <InfoRow label="Used Space" value={`${storage?.used.toFixed(1)}GB`} mono />
            <InfoRow label="Free Space" value={`${storage?.free.toFixed(1)}GB`} mono />
            <View style={styles.healthRow}>
              <Text style={styles.healthLabel}>Health</Text>
              <StatusBadge status={storage?.health || 'Good'} />
            </View>
          </HardwareCard>

          {/* Display */}
          <HardwareCard title="Display" icon="smartphone">
            <InfoRow label="Resolution" value={`${display?.width} × ${display?.height}`} mono />
            <InfoRow label="DPI" value={display?.dpi.toString() || '0'} mono />
            <InfoRow label="Refresh Rate" value={`${display?.refreshRate}Hz`} mono />
            <InfoRow label="Color Depth" value={`${display?.colorDepth}-bit`} mono />
            <InfoRow label="HDR Support" value={display?.hdr ? 'Yes' : 'No'} />
          </HardwareCard>

          {/* Network */}
          <HardwareCard title="Network" icon="wifi">
            <InfoRow label="Connection" value={network?.type || 'None'} />
            {network?.ssid && <InfoRow label="Network" value={network.ssid} />}
            {network?.ipAddress && <InfoRow label="IP Address" value={network.ipAddress} mono />}
            {network?.signalStrength && <InfoRow label="Signal" value={`${network.signalStrength.toFixed(0)} dBm`} mono />}
          </HardwareCard>

          {/* Device Info */}
          <HardwareCard title="Device Information" icon="phone-android">
            <InfoRow label="Manufacturer" value={device?.manufacturer || 'Unknown'} />
            <InfoRow label="Model" value={device?.model || 'Unknown'} />
            <InfoRow label="OS Version" value={device?.osVersion || 'Unknown'} mono />
            <InfoRow label="Build Number" value={device?.buildNumber || 'Unknown'} mono />
          </HardwareCard>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  loadingText: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  metricItem: {
    flex: 1,
    minWidth: '47%',
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  actionLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  healthLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});
