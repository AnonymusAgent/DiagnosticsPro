import type { StressTestResult } from '../types/hardware';

export interface StressTestConfig {
  duration: number; // seconds
  intensity: 'low' | 'medium' | 'high';
  safetyLimits: {
    maxTemp: number;
    maxCpuUsage: number;
  };
}

// CPU Stress Test
export async function runCPUStressTest(
  config: StressTestConfig,
  onProgress: (progress: number, metrics: any) => void,
  onSafetyStop: () => void
): Promise<StressTestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const metrics = {
      avgCpuUsage: 0,
      maxTemp: 0,
      throttlingDetected: false,
      crashes: 0,
    };
    
    let iterations = 0;
    const maxIterations = config.duration * 10; // 10 updates per second
    
    const interval = setInterval(() => {
      iterations++;
      const progress = (iterations / maxIterations) * 100;
      
      // Simulate CPU load
      const currentCpuUsage = 70 + Math.random() * 30;
      const currentTemp = 45 + (iterations / maxIterations) * 30;
      
      metrics.avgCpuUsage = ((metrics.avgCpuUsage * (iterations - 1)) + currentCpuUsage) / iterations;
      metrics.maxTemp = Math.max(metrics.maxTemp, currentTemp);
      
      // Safety check
      if (currentTemp > config.safetyLimits.maxTemp) {
        clearInterval(interval);
        onSafetyStop();
        resolve({
          testType: 'CPU',
          status: 'warning',
          duration: (Date.now() - startTime) / 1000,
          metrics,
          timestamp: Date.now(),
        });
        return;
      }
      
      // Detect throttling
      if (currentCpuUsage < 50 && iterations > maxIterations * 0.3) {
        metrics.throttlingDetected = true;
      }
      
      onProgress(progress, {
        cpuUsage: currentCpuUsage,
        temperature: currentTemp,
        throttling: metrics.throttlingDetected,
      });
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        resolve({
          testType: 'CPU',
          status: metrics.throttlingDetected ? 'warning' : 'passed',
          duration: config.duration,
          metrics,
          timestamp: Date.now(),
        });
      }
    }, 100);
  });
}

// GPU Stress Test
export async function runGPUStressTest(
  config: StressTestConfig,
  onProgress: (progress: number, metrics: any) => void,
  onSafetyStop: () => void
): Promise<StressTestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const metrics = {
      avgGpuUsage: 0,
      maxTemp: 0,
      throttlingDetected: false,
      crashes: 0,
    };
    
    let iterations = 0;
    const maxIterations = config.duration * 10;
    
    const interval = setInterval(() => {
      iterations++;
      const progress = (iterations / maxIterations) * 100;
      
      const currentGpuUsage = 80 + Math.random() * 20;
      const currentTemp = 50 + (iterations / maxIterations) * 25;
      
      metrics.avgGpuUsage = ((metrics.avgGpuUsage || 0) * (iterations - 1) + currentGpuUsage) / iterations;
      metrics.maxTemp = Math.max(metrics.maxTemp, currentTemp);
      
      if (currentTemp > config.safetyLimits.maxTemp) {
        clearInterval(interval);
        onSafetyStop();
        resolve({
          testType: 'GPU',
          status: 'warning',
          duration: (Date.now() - startTime) / 1000,
          metrics,
          timestamp: Date.now(),
        });
        return;
      }
      
      onProgress(progress, {
        gpuUsage: currentGpuUsage,
        temperature: currentTemp,
      });
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        resolve({
          testType: 'GPU',
          status: 'passed',
          duration: config.duration,
          metrics,
          timestamp: Date.now(),
        });
      }
    }, 100);
  });
}

// RAM Stress Test
export async function runRAMStressTest(
  config: StressTestConfig,
  onProgress: (progress: number, metrics: any) => void
): Promise<StressTestResult> {
  return new Promise((resolve) => {
    const metrics = {
      memoryLeaks: false,
      maxMemoryUsed: 0,
    };
    
    let iterations = 0;
    const maxIterations = config.duration * 10;
    const memoryBlocks: number[][] = [];
    
    const interval = setInterval(() => {
      iterations++;
      const progress = (iterations / maxIterations) * 100;
      
      // Allocate memory
      const blockSize = config.intensity === 'high' ? 1000000 : 500000;
      memoryBlocks.push(new Array(blockSize).fill(Math.random()));
      
      const currentMemoryUsage = 60 + (iterations / maxIterations) * 30;
      metrics.maxMemoryUsed = Math.max(metrics.maxMemoryUsed || 0, currentMemoryUsage);
      
      onProgress(progress, {
        memoryUsage: currentMemoryUsage,
        blocksAllocated: memoryBlocks.length,
      });
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Clean up
        memoryBlocks.length = 0;
        
        resolve({
          testType: 'RAM',
          status: 'passed',
          duration: config.duration,
          metrics,
          timestamp: Date.now(),
        });
      }
    }, 100);
  });
}

// Battery Stress Test
export async function runBatteryStressTest(
  config: StressTestConfig,
  onProgress: (progress: number, metrics: any) => void
): Promise<StressTestResult> {
  return new Promise((resolve) => {
    const startBatteryLevel = 85; // Mock
    const metrics = {
      drainRate: 0,
      avgTemp: 0,
    };
    
    let iterations = 0;
    const maxIterations = config.duration * 10;
    
    const interval = setInterval(() => {
      iterations++;
      const progress = (iterations / maxIterations) * 100;
      
      const currentBatteryLevel = startBatteryLevel - (iterations / maxIterations) * 5;
      const currentTemp = 38 + (iterations / maxIterations) * 12;
      
      metrics.drainRate = ((startBatteryLevel - currentBatteryLevel) / (iterations / 10)) * 3600;
      metrics.avgTemp = ((metrics.avgTemp * (iterations - 1)) + currentTemp) / iterations;
      
      onProgress(progress, {
        batteryLevel: currentBatteryLevel,
        temperature: currentTemp,
        drainRate: metrics.drainRate,
      });
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        resolve({
          testType: 'Battery',
          status: 'passed',
          duration: config.duration,
          metrics,
          timestamp: Date.now(),
        });
      }
    }, 100);
  });
}
