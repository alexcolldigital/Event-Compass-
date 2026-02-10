/**
 * Auth Styles - Modern & Responsive
 * Styling for authentication screens with modern design
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },

  title: {
    ...typography.h2,
    color: colors.black,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    ...typography.bodySmall,
    color: colors.gray[600],
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: spacing.lg,
  },

  label: {
    ...typography.h6,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    backgroundColor: colors.gray[100],
    color: colors.black,
  },

  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },

  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },

  errorMessage: {
    ...typography.captionSmall,
    color: colors.error,
    marginTop: spacing.xs,
  },

  errorAlert: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },

  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 0,
  },

  passwordInputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: colors.black,
  },

  showPassword: {
    paddingHorizontal: spacing.lg,
    color: colors.primary,
    fontWeight: '600',
    ...typography.buttonSmall,
  },

  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },

  forgotPassword: {
    color: colors.primary,
    fontWeight: '600',
    ...typography.bodySmall,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    minHeight: 48,
    ...shadows.sm,
  },

  primaryButtonActive: {
    backgroundColor: colors.primaryDark,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: colors.white,
    ...typography.button,
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  secondaryButtonText: {
    color: colors.primary,
    ...typography.button,
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  signUpText: {
    color: colors.gray[600],
    ...typography.bodySmall,
  },

  signUpLink: {
    color: colors.primary,
    fontWeight: '700',
    ...typography.bodySmall,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },

  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.gray[500],
    ...typography.bodySmall,
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
  },

  socialButtonText: {
    marginLeft: spacing.sm,
    ...typography.bodySmall,
    color: colors.black,
  },

  successAlert: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },

  successText: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
});
