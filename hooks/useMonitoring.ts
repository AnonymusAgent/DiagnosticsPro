import { useState, useEffect, useRef } from 'react';
import * as HardwareService from '../services/hardwareService';
import * as StorageService from '../services/storageService';
import type { MonitoringSnapshot } from '../types/hardware';

export function useMonitoring(autoStart = false) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentData, setCurrentData] = useState<MonitoringSnapshot | null>(null);
  const [history, setHistory] = useState<MonitoringSnapshot[]>([]);
  const stopMonitoringRef = useRef<(() => void) | null>(null);

  const startMonitoring = () => {
    if (stopMonitoringRef.current) {
      stopMonitoringRef.current();
    }

    setIsMonitoring(true);
    setHistory([]);

    const stop = HardwareService.startMonitoring((data) => {
      setCurrentData(data);
      setHistory((prev) => [...prev, data].slice(-60)); // Keep last 60 seconds
      
      // Save to storage for long-term tracking
      StorageService.saveMonitoringSnapshot(data);
    });

    stopMonitoringRef.current = stop;
  };

  const stopMonitoring = () => {
    if (stopMonitoringRef.current) {
      stopMonitoringRef.current();
      stopMonitoringRef.current = null;
    }
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => {
      if (stopMonitoringRef.current) {
        stopMonitoringRef.current();
      }
    };
  }, [autoStart]);

  return {
    isMonitoring,
    currentData,
    history,
    startMonitoring,
    stopMonitoring,
  };
}
