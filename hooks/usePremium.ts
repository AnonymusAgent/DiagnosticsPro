import { useState, useEffect } from 'react';
import * as PremiumService from '../services/premiumService';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPremiumStatus = async () => {
    setLoading(true);
    const status = await PremiumService.isPremium();
    setIsPremium(status);
    setLoading(false);
  };

  const activatePremium = async () => {
    await PremiumService.setPremium(true);
    setIsPremium(true);
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  return {
    isPremium,
    loading,
    activatePremium,
    refresh: checkPremiumStatus,
  };
}
