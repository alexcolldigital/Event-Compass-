/**
 * Profile Styles - Modern & Responsive
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },

  headerSection: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...shadows.sm,
  },

  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray[300],
  },

  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },

  fullName: {
    ...typography.h4,
    color: colors.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },

  email: {
    ...typography.bodySmall,
    color: colors.gray[600],
    textAlign: 'center',
  },

  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    width: '100%',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    ...typography.h5,
    color: colors.primary,
  },

  statLabel: {
    ...typography.caption,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },

  editButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...shadows.sm,
  },

  editButtonText: {
    color: colors.white,
    ...typography.button,
    marginLeft: spacing.md,
  },

  infoSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },

  sectionTitle: {
    ...typography.h5,
    color: colors.black,
    marginBottom: spacing.lg,
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

  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    minHeight: 44,
    ...shadows.sm,
  },

  cancelButton: {
    backgroundColor: colors.gray[200],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minHeight: 44,
  },

  buttonText: {
    color: colors.white,
    ...typography.button,
  },

  cancelButtonText: {
    color: colors.gray[700],
    ...typography.button,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  infoIcon: {
    marginRight: spacing.lg,
  },

  infoText: {
    ...typography.body,
    color: colors.gray[600],
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.lg,
  },

  businessSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },

  businessTitle: {
    ...typography.h5,
    color: colors.black,
    marginBottom: spacing.lg,
  },

  businessInfo: {
    marginBottom: spacing.lg,
  },

  businessLabel: {
    ...typography.bodySmall,
    color: colors.gray[600],
  },

  businessText: {
    ...typography.body,
    color: colors.black,
    marginTop: spacing.xs,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  ratingText: {
    ...typography.bodySmall,
    color: colors.gray[600],
    marginLeft: spacing.md,
    fontWeight: '600',
  },

  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  actionButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  actionButtonText: {
    ...typography.h6,
    color: colors.black,
    marginLeft: spacing.lg,
  },

  logoutButton: {
    backgroundColor: '#FFF5F5',
  },

  logoutButtonText: {
    color: colors.error,
  },

  actionButtonIcon: {
    color: colors.gray[700],
  },

  logoutButtonIcon: {
    color: colors.error,
  },
});
