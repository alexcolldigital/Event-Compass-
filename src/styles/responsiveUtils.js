/**
 * Responsive UI Utilities
 * Helper functions and components for responsive design
 */

import { Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = () => {
  if (screenWidth < 375) return spacing.md;
  if (screenWidth < 425) return spacing.lg;
  return spacing.xl;
};

/**
 * Get number of grid columns based on screen width
 */
export const getGridColumns = () => {
  if (screenWidth < 375) return 1;
  if (screenWidth < 768) return 2;
  return 3;
};

/**
 * Get responsive font size
 */
export const getResponsiveFontSize = (baseSize) => {
  const scale = screenWidth / 375;
  const newSize = baseSize * scale;
  
  // Clamp between 80% and 120% of base size
  if (newSize < baseSize * 0.8) return baseSize * 0.8;
  if (newSize > baseSize * 1.2) return baseSize * 1.2;
  
  return Math.round(newSize);
};

/**
 * Create responsive shadow based on screen size
 */
export const getResponsiveShadow = (level = 'md') => {
  return shadows[level] || shadows.md;
};

/**
 * Common button styles
 */
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  secondary: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
};

/**
 * Common input styles
 */
export const inputStyles = {
  container: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gray[100],
    minHeight: 48,
  },
  containerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  containerError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
};

/**
 * Common card styles
 */
export const cardStyles = {
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  containerSmall: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  compact: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
};

/**
 * Check if device is in portrait orientation
 */
export const isPortrait = () => screenHeight > screenWidth;

/**
 * Check if device is tablet
 */
export const isTablet = () => screenWidth > 768;

/**
 * Check if device is small screen (mobile)
 */
export const isSmallScreen = () => screenWidth < 375;

/**
 * Get safe area padding for notched devices
 */
export const getSafeAreaPadding = () => {
  return {
    paddingTop: screenHeight > 800 ? spacing.xl : spacing.lg,
    paddingBottom: screenHeight > 800 ? spacing.xl : spacing.lg,
  };
};

export default {
  getResponsivePadding,
  getGridColumns,
  getResponsiveFontSize,
  getResponsiveShadow,
  buttonStyles,
  inputStyles,
  cardStyles,
  isPortrait,
  isTablet,
  isSmallScreen,
  getSafeAreaPadding,
};
