/**
 * Placeholder screens for remaining features
 * These are minimal screens to complete the app structure
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Splash Screen
 */
export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Compass</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

/**
 * Service Detail Screen
 */
export function ServiceDetailScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Details</Text>
      <Text style={styles.subtitle}>Service ID: {route.params?.serviceId}</Text>
    </View>
  );
}

/**
 * Search Screen
 */
export function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Services</Text>
      <Text style={styles.subtitle}>Search functionality here</Text>
    </View>
  );
}

/**
 * Booking Screen
 */
export function BookingScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Booking</Text>
      <Text style={styles.subtitle}>Booking for service: {route.params?.serviceId}</Text>
    </View>
  );
}

/**
 * Messages Screen
 */
export function MessagesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>Direct messaging coming soon</Text>
    </View>
  );
}

/**
 * Bookings Management Screen
 */
export function BookingsManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>Your bookings and history</Text>
    </View>
  );
}

/**
 * Service List Screen (for providers)
 */
export function ServiceListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Services</Text>
      <Text style={styles.subtitle}>Manage your services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
