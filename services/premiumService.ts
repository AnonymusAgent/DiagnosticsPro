import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@premium_status';
const TRIAL_USAGE_KEY = '@trial_usage';

export interface TrialUsage {
  cpuTests: number;
  gpuTests: number;
  ramTests: number;
  batteryTests: number;
  lastReset: number;
}

const TRIAL_LIMITS = {
  cpuTests: 2,
  gpuTests: 2,
  ramTests: 2,
  batteryTests: 2,
};

export async function isPremium(): Promise<boolean> {
  const status = await AsyncStorage.getItem(PREMIUM_KEY);
  return status === 'true';
}

export async function setPremium(value: boolean): Promise<void> {
  await AsyncStorage.setItem(PREMIUM_KEY, value.toString());
}

export async function getTrialUsage(): Promise<TrialUsage> {
  const data = await AsyncStorage.getItem(TRIAL_USAGE_KEY);
  if (!data) {
    return {
      cpuTests: 0,
      gpuTests: 0,
      ramTests: 0,
      batteryTests: 0,
      lastReset: Date.now(),
    };
  }
  return JSON.parse(data);
}

export async function incrementTrialUsage(testType: 'cpu' | 'gpu' | 'ram' | 'battery'): Promise<void> {
  const usage = await getTrialUsage();
  
  switch (testType) {
    case 'cpu':
      usage.cpuTests++;
      break;
    case 'gpu':
      usage.gpuTests++;
      break;
    case 'ram':
      usage.ramTests++;
      break;
    case 'battery':
      usage.batteryTests++;
      break;
  }
  
  await AsyncStorage.setItem(TRIAL_USAGE_KEY, JSON.stringify(usage));
}

export async function canRunTest(testType: 'cpu' | 'gpu' | 'ram' | 'battery'): Promise<{ allowed: boolean; remaining: number }> {
  const premium = await isPremium();
  if (premium) {
    return { allowed: true, remaining: -1 }; // Unlimited
  }
  
  const usage = await getTrialUsage();
  
  let used = 0;
  let limit = 0;
  
  switch (testType) {
    case 'cpu':
      used = usage.cpuTests;
      limit = TRIAL_LIMITS.cpuTests;
      break;
    case 'gpu':
      used = usage.gpuTests;
      limit = TRIAL_LIMITS.gpuTests;
      break;
    case 'ram':
      used = usage.ramTests;
      limit = TRIAL_LIMITS.ramTests;
      break;
    case 'battery':
      used = usage.batteryTests;
      limit = TRIAL_LIMITS.batteryTests;
      break;
  }
  
  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
  };
}

export function getPremiumFeatures() {
  return [
    { name: 'Unlimited Stress Tests', free: false },
    { name: 'Advanced Real-Time Graphs', free: false },
    { name: 'Historical Data Tracking', free: false },
    { name: 'Exportable Reports (PDF)', free: false },
    { name: 'Extended Test Duration (up to 30min)', free: false },
    { name: 'Ad-Free Experience', free: false },
    { name: 'Priority Support', free: false },
  ];
}

export const PREMIUM_PRICE = '$4.99';
