import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { 
  CPUInfo, 
  GPUInfo, 
  RAMInfo, 
  StorageInfo, 
  BatteryInfo, 
  NetworkInfo, 
  DisplayInfo,
  DeviceInfo 
} from '../types/hardware';

// Safe imports with fallback
let Battery: any = null;
let Network: any = null;

try {
  Battery = require('expo-battery');
} catch (e) {
  console.log('expo-battery not available, using mock data');
}

try {
  Network = require('expo-network');
} catch (e) {
  console.log('expo-network not available, using mock data');
}

// Mock CPU information (would use native module in production)
export async function getCPUInfo(): Promise<CPUInfo> {
  // In production, this would call a native module
  // For now, returning mock data based on device capabilities
  const cores = Platform.select({ ios: 6, android: 8, default: 4 });
  
  return {
    cores: cores!,
    architecture: Platform.select({ ios: 'ARM64', android: 'ARM64-v8a', default: 'ARM64' })!,
    frequency: 2840, // MHz
    usage: Array(cores).fill(0).map(() => Math.random() * 60 + 20),
    model: Platform.select({ 
      ios: 'Apple A15 Bionic', 
      android: 'Qualcomm Snapdragon 888', 
      default: 'Unknown' 
    })!,
  };
}

// Mock GPU information
export async function getGPUInfo(): Promise<GPUInfo> {
  return {
    model: Platform.select({ ios: 'Apple GPU (5-core)', android: 'Adreno 660', default: 'Unknown' })!,
    renderer: 'Hardware Accelerated',
    vendor: Platform.select({ ios: 'Apple', android: 'Qualcomm', default: 'Unknown' })!,
    usage: Math.random() * 40 + 10,
    temperature: Math.random() * 15 + 35,
  };
}

// Mock RAM information
export async function getRAMInfo(): Promise<RAMInfo> {
  const total = Platform.select({ ios: 6144, android: 8192, default: 4096 })!; // MB
  const used = Math.random() * total * 0.5 + total * 0.3;
  
  return {
    total,
    used,
    free: total - used,
    usagePercent: (used / total) * 100,
  };
}

// Mock Storage information
export async function getStorageInfo(): Promise<StorageInfo> {
  const total = 128; // GB
  const used = Math.random() * 60 + 40;
  
  return {
    type: Platform.select({ ios: 'NVMe', android: 'UFS 3.1', default: 'eMMC' })!,
    total,
    used,
    free: total - used,
    health: 'Good',
  };
}

// Battery information with fallback
export async function getBatteryInfo(): Promise<BatteryInfo> {
  try {
    if (Battery) {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      
      return {
        level: Math.round(level * 100),
        health: 'Good',
        temperature: Math.random() * 10 + 30,
        voltage: 3.7 + Math.random() * 0.5,
        technology: 'Li-Po',
        chargeCycles: Math.floor(Math.random() * 200 + 50),
        capacity: Platform.select({ ios: 3095, android: 4500, default: 4000 }),
        isCharging: state === Battery?.BatteryState?.CHARGING,
      };
    }
  } catch (e) {
    console.log('Battery API error, using mock data');
  }
  
  // Fallback mock data
  return {
    level: 75,
    health: 'Good',
    temperature: 35,
    voltage: 4.0,
    technology: 'Li-Po',
    chargeCycles: 150,
    capacity: Platform.select({ ios: 3095, android: 4500, default: 4000 }),
    isCharging: false,
  };
}

// Network information with fallback
export async function getNetworkInfo(): Promise<NetworkInfo> {
  try {
    if (Network) {
      const networkState = await Network.getNetworkStateAsync();
      const ipAddress = await Network.getIpAddressAsync();
      
      return {
        type: networkState.type === Network.NetworkStateType.WIFI ? 'WiFi' 
              : networkState.type === Network.NetworkStateType.CELLULAR ? 'Cellular' 
              : 'None',
        ssid: networkState.type === Network.NetworkStateType.WIFI ? 'WiFi Network' : undefined,
        signalStrength: networkState.type !== Network.NetworkStateType.NONE ? -50 - Math.random() * 30 : undefined,
        ipAddress,
        downloadSpeed: Math.random() * 100 + 50,
        uploadSpeed: Math.random() * 50 + 20,
        latency: Math.random() * 30 + 10,
      };
    }
  } catch (e) {
    console.log('Network API error, using mock data');
  }
  
  // Fallback mock data
  return {
    type: 'WiFi',
    ssid: 'Demo Network',
    signalStrength: -60,
    ipAddress: '192.168.1.100',
    downloadSpeed: 85.5,
    uploadSpeed: 35.2,
    latency: 15.8,
  };
}

// Mock Display information
export async function getDisplayInfo(): Promise<DisplayInfo> {
  return {
    width: 1080,
    height: 2400,
    dpi: 420,
    refreshRate: Platform.select({ ios: 120, android: 90, default: 60 })!,
    colorDepth: 24,
    hdr: true,
  };
}

// Real Device information using Expo Device
export async function getDeviceInfo(): Promise<DeviceInfo> {
  return {
    manufacturer: Device.manufacturer || 'Unknown',
    model: Device.modelName || 'Unknown',
    osVersion: Device.osVersion || 'Unknown',
    buildNumber: Device.osBuildId || 'Unknown',
    deviceId: Device.modelId || 'Unknown',
  };
}

// Get all sensors available
export async function getAvailableSensors() {
  // Mock sensor data - would use expo-sensors in production
  return [
    { name: 'Accelerometer', type: 'Motion', available: true },
    { name: 'Gyroscope', type: 'Motion', available: true },
    { name: 'Magnetometer', type: 'Position', available: true },
    { name: 'Barometer', type: 'Environment', available: true },
    { name: 'Proximity', type: 'Position', available: true },
    { name: 'Light Sensor', type: 'Environment', available: true },
    { name: 'Fingerprint', type: 'Biometric', available: Platform.OS !== 'web' },
    { name: 'Face ID', type: 'Biometric', available: Platform.OS === 'ios' },
  ];
}

// Real-time monitoring
export function startMonitoring(callback: (data: any) => void): () => void {
  const interval = setInterval(async () => {
    const cpu = await getCPUInfo();
    const ram = await getRAMInfo();
    const battery = await getBatteryInfo();
    const gpu = await getGPUInfo();
    
    callback({
      timestamp: Date.now(),
      cpuUsage: cpu.usage.reduce((a, b) => a + b, 0) / cpu.usage.length,
      ramUsage: ram.usagePercent,
      temperature: battery.temperature,
      batteryLevel: battery.level,
      gpuUsage: gpu.usage,
    });
  }, 1000);
  
  return () => clearInterval(interval);
}
