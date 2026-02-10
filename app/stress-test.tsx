import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { PremiumBadge } from '../components/ui/PremiumBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { usePremium } from '../hooks/usePremium';
import { useAlert } from '../template';
import * as StressTestService from '../services/stressTestService';
import * as PremiumService from '../services/premiumService';
import * as StorageService from '../services/storageService';
import type { StressTestResult } from '../types/hardware';

type TestType = 'cpu' | 'gpu' | 'ram' | 'battery';

export default function StressTestScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremium();
  const { showAlert } = useAlert();
  
  const [activeTest, setActiveTest] = useState<TestType | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testMetrics, setTestMetrics] = useState<any>(null);
  const [testResult, setTestResult] = useState<StressTestResult | null>(null);

  const runTest = async (type: TestType) => {
    // Check trial limit
    const { allowed, remaining } = await PremiumService.canRunTest(type);
    
    if (!allowed && !isPremium) {
      showAlert(
        'Trial Limit Reached',
        `You have used all your free ${type.toUpperCase()} stress tests. Upgrade to Premium for unlimited testing.`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => {/* Navigate to premium screen */} },
        ]
      );
      return;
    }

    setActiveTest(type);
    setTestProgress(0);
    setTestMetrics(null);
    setTestResult(null);

    const config: StressTestService.StressTestConfig = {
      duration: isPremium ? 60 : 30, // Premium gets longer tests
      intensity: 'high',
      safetyLimits: {
        maxTemp: 80,
        maxCpuUsage: 100,
      },
    };

    const onProgress = (progress: number, metrics: any) => {
      setTestProgress(progress);
      setTestMetrics(metrics);
    };

    const onSafetyStop = () => {
      showAlert('Safety Stop', 'Test stopped due to temperature limit');
    };

    try {
      let result: StressTestResult;
      
      switch (type) {
        case 'cpu':
          result = await StressTestService.runCPUStressTest(config, onProgress, onSafetyStop);
          break;
        case 'gpu':
          result = await StressTestService.runGPUStressTest(config, onProgress, onSafetyStop);
          break;
        case 'ram':
          result = await StressTestService.runRAMStressTest(config, onProgress);
          break;
        case 'battery':
          result = await StressTestService.runBatteryStressTest(config, onProgress);
          break;
      }

      setTestResult(result);
      await StorageService.saveTestResult(result);
      
      // Increment trial usage
      if (!isPremium) {
        await PremiumService.incrementTrialUsage(type);
      }
      
      showAlert('Test Complete', `${type.toUpperCase()} stress test finished with status: ${result.status.toUpperCase()}`);
    } catch (error) {
      showAlert('Test Error', 'An error occurred during testing');
    } finally {
      setActiveTest(null);
    }
  };

  const TestCard = ({ 
    type, 
    icon, 
    title, 
    description 
  }: { 
    type: TestType; 
    icon: keyof typeof MaterialIcons.glyphMap; 
    title: string; 
    description: string;
  }) => {
    const [canRun, setCanRun] = useState(true);
    const [remaining, setRemaining] = useState(0);

    React.useEffect(() => {
      PremiumService.canRunTest(type).then(({ allowed, remaining }) => {
        setCanRun(allowed);
        setRemaining(remaining);
      });
    }, []);

    return (
      <View style={styles.testCard}>
        <View style={styles.testHeader}>
          <View style={styles.testTitleRow}>
            <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
            <Text style={styles.testTitle}>{title}</Text>
          </View>
          {!isPremium && <PremiumBadge />}
        </View>
        <Text style={styles.testDescription}>{description}</Text>
        
        {!isPremium && (
          <Text style={styles.trialInfo}>
            {canRun ? `${remaining} free test${remaining !== 1 ? 's' : ''} remaining` : 'No free tests remaining'}
          </Text>
        )}
        
        <Pressable
          style={[styles.testButton, !canRun && !isPremium && styles.testButtonDisabled]}
          onPress={() => runTest(type)}
          disabled={activeTest !== null}
        >
          <Text style={styles.testButtonText}>
            {activeTest === type ? 'Testing...' : 'Run Test'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Stress Testing',
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
          {/* Active Test Display */}
          {activeTest && (
            <View style={styles.activeTestPanel}>
              <Text style={styles.activeTestTitle}>
                {activeTest.toUpperCase()} Stress Test Running
              </Text>
              <ProgressBar value={testProgress} height={12} />
              
              {testMetrics && (
                <View style={styles.metricsDisplay}>
                  {Object.entries(testMetrics).map(([key, value]) => (
                    <View key={key} style={styles.metricRow}>
                      <Text style={styles.metricLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                      <Text style={styles.metricValue}>
                        {typeof value === 'number' ? value.toFixed(1) : String(value)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Test Result */}
          {testResult && !activeTest && (
            <View style={styles.resultPanel}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Test Result</Text>
                <StatusBadge status={testResult.status} />
              </View>
              <View style={styles.resultMetrics}>
                <Text style={styles.resultText}>Test Type: {testResult.testType}</Text>
                <Text style={styles.resultText}>Duration: {testResult.duration.toFixed(0)}s</Text>
                {Object.entries(testResult.metrics).map(([key, value]) => (
                  <Text key={key} style={styles.resultText}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}: {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Test Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Tests</Text>
            
            <TestCard
              type="cpu"
              icon="memory"
              title="CPU Stress Test"
              description="Tests processor performance under maximum load across all cores. Monitors for throttling and thermal limits."
            />
            
            <TestCard
              type="gpu"
              icon="videogame-asset"
              title="GPU Stress Test"
              description="Renders intensive graphics workload to test graphics processor stability and thermal performance."
            />
            
            <TestCard
              type="ram"
              icon="storage"
              title="RAM Stress Test"
              description="Allocates and tests memory to detect errors, leaks, and stability issues under load."
            />
            
            <TestCard
              type="battery"
              icon="battery-charging-full"
              title="Battery Stress Test"
              description="Measures battery drain rate and thermal behavior under sustained high load conditions."
            />
          </View>

          {/* Safety Info */}
          <View style={styles.safetyCard}>
            <MaterialIcons name="shield" size={20} color={theme.colors.success} />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Safety Features</Text>
              <Text style={styles.safetyText}>
                • Automatic temperature monitoring{'\n'}
                • Test termination at safety limits{'\n'}
                • No permanent hardware damage{'\n'}
                • Real-time thermal protection
              </Text>
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  testCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  testTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  testTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  testDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  trialInfo: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  testButtonDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  },
  testButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  activeTestPanel: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  activeTestTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  metricsDisplay: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  metricRow: {
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
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
  },
  resultPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
    marginBottom: theme.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  resultMetrics: {
    gap: theme.spacing.xs,
  },
  resultText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
    textTransform: 'capitalize',
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.success + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.success + '40',
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  safetyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
