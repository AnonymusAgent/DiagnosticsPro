import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StressTestResult, MonitoringSnapshot } from '../types/hardware';

const TEST_RESULTS_KEY = '@test_results';
const MONITORING_HISTORY_KEY = '@monitoring_history';

export async function saveTestResult(result: StressTestResult): Promise<void> {
  const existing = await getTestResults();
  const updated = [result, ...existing].slice(0, 50); // Keep last 50 results
  await AsyncStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(updated));
}

export async function getTestResults(): Promise<StressTestResult[]> {
  const data = await AsyncStorage.getItem(TEST_RESULTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveMonitoringSnapshot(snapshot: MonitoringSnapshot): Promise<void> {
  const existing = await getMonitoringHistory();
  const updated = [snapshot, ...existing].slice(0, 1000); // Keep last 1000 snapshots
  await AsyncStorage.setItem(MONITORING_HISTORY_KEY, JSON.stringify(updated));
}

export async function getMonitoringHistory(limit?: number): Promise<MonitoringSnapshot[]> {
  const data = await AsyncStorage.getItem(MONITORING_HISTORY_KEY);
  const history = data ? JSON.parse(data) : [];
  return limit ? history.slice(0, limit) : history;
}

export async function clearMonitoringHistory(): Promise<void> {
  await AsyncStorage.setItem(MONITORING_HISTORY_KEY, JSON.stringify([]));
}

export async function getTestResultsByType(type: string): Promise<StressTestResult[]> {
  const results = await getTestResults();
  return results.filter(r => r.testType === type);
}
