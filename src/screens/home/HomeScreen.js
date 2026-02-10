/**
 * Home Screen - Modern & Responsive
 * Main dashboard for users showing recent services and events
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useServicesStore } from '../../context/servicesContext';
import { useAuthStore } from '../../context/authContext';
import styles from '../../styles/homeStyles';
import { colors, spacing } from '../../styles/theme';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const { fetchServices, services, isLoading } = useServicesStore();
  const { user, logout } = useAuthStore();
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    // Determine grid columns based on screen width
    if (screenWidth < 375) {
      setNumColumns(1);
    } else if (screenWidth < 768) {
      setNumColumns(2);
    } else {
      setNumColumns(3);
    }
  }, []);

  useEffect(() => {
    // Fetch featured services on screen load
    const loadServices = async () => {
      try {
        await fetchServices({ limit: 10, sortBy: 'popularity' });
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    loadServices();
  }, []);

  /**
   * Render service card with modern design
   */
  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.serviceCard, { width: `${100 / numColumns}%` }]}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item._id })}
      activeOpacity={0.8}
    >
      {/* Service Image */}
      <Image
        source={{
          uri: item.images?.[0] || 'https://via.placeholder.com/200x150',
        }}
        style={styles.serviceImage}
      />

      {/* Featured Badge */}
      {item.isFeatured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Featured</Text>
        </View>
      )}

      {/* Rating Badge */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating?.toFixed(1) || 'N/A'}</Text>
      </View>

      {/* Service Info */}
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <Text style={styles.servicePrice}>₦{item.basePrice?.toLocaleString()}</Text>

        {/* Footer with review count */}
        <View style={[styles.serviceFooter, { marginTop: spacing.md }]}>
          <Text style={styles.reviewCount}>
            {item.reviewCount || 0} reviews
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Quick action card component
   */
  const handleLogout = () => {
    console.log('================================================');
    console.log('🔴 LOGOUT INITIATED IN HOMESCREEN');
    console.log('================================================');
    
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {
        console.log('⚪ Logout cancelled by user');
      }},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('🔴 User confirmed logout - calling logout()...');
            await logout();
            console.log('🟢 Logout completed successfully');
          } catch (error) {
            console.error('================================================');
            console.error('❌ LOGOUT FAILED IN HOMESCREEN');
            console.error('================================================');
            console.error('Error Message:', error?.message);
            console.error('Error Stack:', error?.stack);
            console.error('Full Error:', error);
            console.error('================================================');
            Alert.alert('Error', error?.message || 'Failed to logout');
          }
        },
      },
    ]);
  };

  const QuickActionCard = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionCardIcon}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>
            Hi, {user?.firstName || 'Guest'} 👋
          </Text>
          <Text style={styles.taglineText}>
            Discover amazing event services
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
        >
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 14 }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {user?.role === 'service_provider' && (
          <QuickActionCard
            icon="add-circle"
            label="Add Service"
            onPress={() => navigation.navigate('AddService')}
          />
        )}
        <QuickActionCard
          icon="search"
          label="Search"
          onPress={() => navigation.navigate('SearchTab')}
        />
        <QuickActionCard
          icon="calendar"
          label="Bookings"
          onPress={() => navigation.navigate('BookingsTab')}
        />
        <QuickActionCard
          icon="chatbubbles"
          label="Messages"
          onPress={() => navigation.navigate('MessagesTab')}
        />
      </View>

      {/* Featured Services Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
            <Text style={styles.seeAllLink}>See All →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: spacing.lg, color: colors.gray[500] }}>
              Loading services...
            </Text>
          </View>
        ) : services.length > 0 ? (
          <FlatList
            data={services.slice(0, 6)}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            scrollEnabled={false}
            columnWrapperStyle={[
              styles.columnWrapper,
              { marginHorizontal: -spacing.xs },
            ]}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.gray[400]} />
            <Text style={styles.emptyText}>No services available yet</Text>
          </View>
        )}
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          scrollEventThrottle={16}
        >
          {['Catering', 'Decoration', 'Entertainment', 'Venue', 'Photography', 'DJ Services'].map(
            (category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryTag}
                onPress={() =>
                  navigation.navigate('SearchTab', { category: category.toLowerCase() })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Trending Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
            <Text style={styles.seeAllLink}>View More →</Text>
          </TouchableOpacity>
        </View>
        {services.length > 3 && (
          <FlatList
            data={services.slice(3, 6)}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            scrollEnabled={false}
            columnWrapperStyle={[
              styles.columnWrapper,
              { marginHorizontal: -spacing.xs },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
}
