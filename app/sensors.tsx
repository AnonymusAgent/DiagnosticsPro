import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useHardwareInfo } from '../hooks/useHardwareInfo';

export default function SensorsScreen() {
  const insets = useSafeAreaInsets();
  const { sensors } = useHardwareInfo();

  const getSensorIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
    switch (type.toLowerCase()) {
      case 'motion': return 'directions-run';
      case 'position': return 'gps-fixed';
      case 'environment': return 'wb-sunny';
      case 'biometric': return 'fingerprint';
      default: return 'sensors';
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Sensors',
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
          <Text style={styles.description}>
            This device has the following sensors available for use by applications.
          </Text>

          {sensors.map((sensor, index) => (
            <View key={index} style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <MaterialIcons 
                  name={getSensorIcon(sensor.type)} 
                  size={24} 
                  color={sensor.available ? theme.colors.success : theme.colors.textTertiary} 
                />
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorName}>{sensor.name}</Text>
                  <Text style={styles.sensorType}>{sensor.type}</Text>
                </View>
                <View style={[
                  styles.availabilityBadge,
                  { backgroundColor: sensor.available ? theme.colors.success + '20' : theme.colors.border }
                ]}>
                  <Text style={[
                    styles.availabilityText,
                    { color: sensor.available ? theme.colors.success : theme.colors.textTertiary }
                  ]}>
                    {sensor.available ? 'Available' : 'Not Available'}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Sensor availability depends on device hardware. Not all sensors may be accessible due to platform restrictions or permissions.
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
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  sensorCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sensorType: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  availabilityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  availabilityText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.info + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.info + '40',
    marginTop: theme.spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
