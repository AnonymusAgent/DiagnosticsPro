import { useState, useEffect } from 'react';
import * as HardwareService from '../services/hardwareService';
import type { CPUInfo, GPUInfo, RAMInfo, StorageInfo, BatteryInfo, NetworkInfo, DisplayInfo, DeviceInfo, SensorInfo } from '../types/hardware';

export function useHardwareInfo() {
  const [loading, setLoading] = useState(true);
  const [cpu, setCpu] = useState<CPUInfo | null>(null);
  const [gpu, setGpu] = useState<GPUInfo | null>(null);
  const [ram, setRam] = useState<RAMInfo | null>(null);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [display, setDisplay] = useState<DisplayInfo | null>(null);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [sensors, setSensors] = useState<SensorInfo[]>([]);

  const loadHardwareInfo = async () => {
    setLoading(true);
    try {
      const [cpuData, gpuData, ramData, storageData, batteryData, networkData, displayData, deviceData, sensorsData] = await Promise.all([
        HardwareService.getCPUInfo(),
        HardwareService.getGPUInfo(),
        HardwareService.getRAMInfo(),
        HardwareService.getStorageInfo(),
        HardwareService.getBatteryInfo(),
        HardwareService.getNetworkInfo(),
        HardwareService.getDisplayInfo(),
        HardwareService.getDeviceInfo(),
        HardwareService.getAvailableSensors(),
      ]);

      setCpu(cpuData);
      setGpu(gpuData);
      setRam(ramData);
      setStorage(storageData);
      setBattery(batteryData);
      setNetwork(networkData);
      setDisplay(displayData);
      setDevice(deviceData);
      setSensors(sensorsData);
    } catch (error) {
      console.error('Error loading hardware info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHardwareInfo();
  }, []);

  return {
    loading,
    cpu,
    gpu,
    ram,
    storage,
    battery,
    network,
    display,
    device,
    sensors,
    refresh: loadHardwareInfo,
  };
}
