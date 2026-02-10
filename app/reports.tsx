import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PremiumBadge } from '../components/ui/PremiumBadge';
import * as StorageService from '../services/storageService';
import type { StressTestResult } from '../types/hardware';

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [testResults, setTestResults] = useState<StressTestResult[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const results = await StorageService.getTestResults();
    setTestResults(results);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Test Reports',
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
          {/* Export Banner */}
          <View style={styles.exportBanner}>
            <View style={styles.exportContent}>
              <PremiumBadge />
              <Text style={styles.exportTitle}>Export Reports as PDF</Text>
              <Text style={styles.exportDescription}>
                Generate professional diagnostic reports with charts and detailed metrics
              </Text>
            </View>
            <Pressable style={styles.exportButton}>
              <MaterialIcons name="file-download" size={20} color={theme.colors.text} />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </Pressable>
          </View>

          {/* Test History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test History</Text>
            
            {testResults.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="assessment" size={48} color={theme.colors.textTertiary} />
                <Text style={styles.emptyText}>No test results yet</Text>
                <Text style={styles.emptySubtext}>Run stress tests to see results here</Text>
              </View>
            ) : (
              testResults.map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultTitleRow}>
                      <Text style={styles.resultTitle}>{result.testType} Stress Test</Text>
                      <StatusBadge status={result.status} />
                    </View>
                    <Text style={styles.resultDate}>{formatDate(result.timestamp)}</Text>
                  </View>
                  
                  <View style={styles.resultMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Duration</Text>
                      <Text style={styles.metricValue}>{result.duration.toFixed(0)}s</Text>
                    </View>
                    {Object.entries(result.metrics).map(([key, value]) => (
                      <View key={key} style={styles.metricItem}>
                        <Text style={styles.metricLabel}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>
                        <Text style={styles.metricValue}>
                          {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
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
  exportBanner: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.premium + '40',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  exportContent: {
    marginBottom: theme.spacing.md,
  },
  exportTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  exportDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.premium,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  exportButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.background,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
  resultCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  resultHeader: {
    marginBottom: theme.spacing.md,
  },
  resultTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  resultDate: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.mono,
  },
  resultMetrics: {
    gap: theme.spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
  },
});
