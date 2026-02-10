/**
 * Home Styles - Modern & Responsive
 * Dashboard styling with modern design and responsive grid
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows, responsive } from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },

  welcomeSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },

  welcomeTextContainer: {
    marginBottom: spacing.md,
  },

  welcomeText: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },

  taglineText: {
    ...typography.bodySmall,
    color: colors.primaryLight,
  },

  userGreeting: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },

  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...shadows.md,
  },

  actionCardIcon: {
    marginBottom: spacing.md,
  },

  actionLabel: {
    ...typography.buttonSmall,
    color: colors.gray[700],
    textAlign: 'center',
  },

  sectionContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.h5,
    color: colors.black,
  },

  seeAllLink: {
    color: colors.primary,
    ...typography.buttonSmall,
  },

  // Service Grid Cards
  serviceCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  serviceImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray[300],
  },

  ratingBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    ...shadows.md,
  },

  ratingText: {
    color: '#FFD700',
    marginLeft: spacing.xs,
    ...typography.captionSmall,
    fontWeight: '600',
  },

  serviceInfo: {
    padding: spacing.md,
  },

  serviceName: {
    ...typography.h6,
    color: colors.black,
    marginBottom: spacing.xs,
  },

  serviceCategory: {
    ...typography.caption,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },

  servicePrice: {
    ...typography.h6,
    color: colors.primary,
    marginTop: spacing.sm,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  loadingContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },

  categoriesScroll: {
    marginBottom: spacing.lg,
  },

  categoryTag: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginRight: spacing.lg,
    ...shadows.sm,
  },

  categoryTagActive: {
    backgroundColor: colors.primaryDark,
  },

  categoryText: {
    color: colors.white,
    ...typography.buttonSmall,
  },

  // Empty state
  emptyContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    ...typography.body,
    color: colors.gray[500],
    textAlign: 'center',
  },

  // Featured badge
  featuredBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },

  featuredBadgeText: {
    color: colors.white,
    ...typography.captionSmall,
    fontWeight: '600',
  },

  // Service card footer with CTA
  serviceFooter: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reviewCount: {
    ...typography.caption,
    color: colors.gray[600],
  },

  viewButton: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },

  viewButtonText: {
    color: colors.primary,
    ...typography.captionSmall,
    fontWeight: '600',
  },
});
