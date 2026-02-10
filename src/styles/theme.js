/**
 * Modern Design Theme System
 * Centralized theme configuration for consistent, modern design
 */

import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const colors = {
  // Primary colors
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#6EE7B7',
  
  // Secondary colors (modern blue accent)
  secondary: '#3A6FF2',
  secondaryLight: '#7B9FFF',
  
  // Neutral colors
  white: '#FFFFFF',
  light: '#F8F9FA',
  black: '#0F0F0F',
  gray: {
    100: '#F8F9FA',
    200: '#F0F2F5',
    300: '#E4E6EB',
    400: '#CED0D4',
    500: '#999999',
    600: '#666666',
    700: '#333333',
    800: '#1A1A1A',
  },
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gradients (for modern look)
  gradient: {
    primary: ['#10B981', '#059669'],
    blue: ['#3A6FF2', '#1F47A5'],
    warm: ['#6EE7B7', '#34D399'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmallerSmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  
  // Captions
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  captionSmall: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Button
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },
};

export const responsive = {
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 425,
  isLargeScreen: screenWidth >= 425,
  screenWidth,
  screenHeight,
  // Dynamic padding based on screen size
  containerPaddingHorizontal: screenWidth < 375 ? 12 : 16,
  containerPaddingVertical: 16,
};

// Helper function for responsive font sizes
export const responsiveFontSize = (baseSize) => {
  const scale = screenWidth / 375;
  const newSize = baseSize * scale;
  
  if (newSize < baseSize * 0.8) return baseSize * 0.8;
  if (newSize > baseSize * 1.2) return baseSize * 1.2;
  
  return newSize;
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  responsive,
  responsiveFontSize,
};
