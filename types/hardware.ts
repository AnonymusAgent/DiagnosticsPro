export interface CPUInfo {
  cores: number;
  architecture: string;
  frequency: number; // MHz
  usage: number[]; // Per-core usage percentage
  model: string;
}

export interface GPUInfo {
  model: string;
  renderer: string;
  vendor: string;
  usage?: number; // Percentage
  temperature?: number; // Celsius
}

export interface RAMInfo {
  total: number; // MB
  used: number; // MB
  free: number; // MB
  usagePercent: number;
}

export interface StorageInfo {
  type: string; // e.g., "eMMC", "UFS 3.1"
  total: number; // GB
  used: number; // GB
  free: number; // GB
  health: 'Good' | 'Fair' | 'Poor';
}

export interface BatteryInfo {
  level: number; // Percentage
  health: 'Good' | 'Fair' | 'Poor' | 'Dead';
  temperature: number; // Celsius
  voltage: number; // Volts
  technology: string;
  chargeCycles?: number;
  capacity?: number; // mAh
  isCharging: boolean;
}

export interface NetworkInfo {
  type: 'WiFi' | 'Cellular' | 'None';
  ssid?: string;
  signalStrength?: number; // dBm
  ipAddress?: string;
  downloadSpeed?: number; // Mbps
  uploadSpeed?: number; // Mbps
  latency?: number; // ms
}

export interface SensorInfo {
  name: string;
  type: string;
  available: boolean;
  data?: any;
}

export interface DisplayInfo {
  width: number;
  height: number;
  dpi: number;
  refreshRate: number; // Hz
  colorDepth: number; // bits
  hdr: boolean;
}

export interface DeviceInfo {
  manufacturer: string;
  model: string;
  osVersion: string;
  buildNumber: string;
  deviceId: string;
}

export interface StressTestResult {
  testType: 'CPU' | 'GPU' | 'RAM' | 'Battery' | 'Thermal';
  status: 'passed' | 'failed' | 'warning';
  duration: number; // seconds
  metrics: {
    avgCpuUsage?: number;
    maxTemp?: number;
    memoryLeaks?: boolean;
    throttlingDetected?: boolean;
    crashes?: number;
  };
  timestamp: number;
}

export interface MonitoringSnapshot {
  timestamp: number;
  cpuUsage: number;
  gpuUsage?: number;
  ramUsage: number;
  temperature: number;
  batteryLevel: number;
  fps?: number;
}
