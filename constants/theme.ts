import { Platform } from 'react-native';

// Theme Configuration
export const theme = {
  colors: {
    // Base colors
    background: '#0a0a0a',
    surface: '#141414',
    surfaceElevated: '#1c1c1c',
    surfaceHighlight: '#222222',
    border: '#282828',
    borderLight: '#333333',
    
    // Text colors
    text: '#f5f5f5',
    textSecondary: '#a8a8a8',
    textTertiary: '#707070',
    
    // Brand colors
    primary: '#00d4ff',
    primaryDark: '#0099cc',
    primaryLight: '#33ddff',
    accent: '#FFD700',
    accentLight: '#FFE44D',
    
    // Status colors
    success: '#00ff88',
    successDark: '#00cc6a',
    warning: '#ff9500',
    warningDark: '#cc7700',
    error: '#ff4444',
    errorDark: '#cc3333',
    info: '#00d4ff',
    
    // Feature indicators
    premium: '#FFD700',
    free: '#00ff88',
    
    // Gradients
    gradientStart: '#00d4ff',
    gradientEnd: '#0099cc',
  },
  
  fonts: {
    regular: 'System',
    mono: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  fontSizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 32,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};
