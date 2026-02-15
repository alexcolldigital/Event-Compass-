/**
 * Bookings Management Screen - Modern & Responsive
 * View and manage user bookings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../context/bookingContext';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme';

const darkColor = '#1A1A1A';

export default function BookingsManagementScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { bookings, isLoading, fetchUserBookings, error } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      await fetchUserBookings();
    } catch (err) {
      console.log('Error loading bookings:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return '#FCA311';
      case 'cancelled':
        return colors.error;
      case 'completed':
        return colors.primary;
      default:
        return colors.gray[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status?.toLowerCase() === filterStatus.toLowerCase());

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookingScreen', { bookingId: item._id })}
      style={styles.bookingCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Ionicons name={getStatusIcon(item.status)} size={20} color={getStatusColor(item.status)} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {item.serviceName || 'Service'}
            </Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>₦{item.totalAmount?.toLocaleString()}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color={colors.gray[500]} />
          <Text style={styles.infoText}>{formatDate(item.bookingDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={colors.gray[500]} />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.location || 'Location TBD'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color={colors.gray[500]} />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.provider?.firstName || 'Service Provider'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={60} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptySubtitle}>Start by booking a service</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => {
          const root = navigation.getParent()?.getParent();
          if (!root) return;
          if (user?.role === 'service_provider') {
            root.navigate('ProviderDashboard', { screen: 'ServicesTab' });
          } else {
            root.navigate('ClientTabs', { screen: 'SearchTab' });
          }
        }}
      >
        <Text style={styles.exploreButtonText}>Explore Services</Text>
      </TouchableOpacity>
    </View>
  );

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status)}
            style={[
              styles.filterChip,
              filterStatus === status && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === status && styles.filterTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      {isLoading && bookings.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  filterScroll: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  filterTextActive: {
    color: 'white',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: darkColor,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  cardBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoText: {
    fontSize: 13,
    color: colors.gray[600],
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '10',
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: darkColor,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.sm,
  },
  exploreButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
};
