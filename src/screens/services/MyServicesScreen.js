/**
 * My Services Screen - Service Provider
 * Displays all services created by the logged-in service provider
 * Allows editing and viewing of service details
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '../../context/authContext';
import apiClient from '../../utils/apiClient';
import { colors, spacing } from '../../styles/theme';

export default function MyServicesScreen({ navigation }) {
  const { user } = useAuthStore();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/services/provider/${user._id}`);
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [services, searchQuery, filterStatus]);

  // Delete service
  const handleDeleteService = (serviceId) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await apiClient.delete(`/services/${serviceId}`);
              setServices(services.filter(s => s._id !== serviceId));
              Alert.alert('Success', 'Service deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  // Render service card
  const ServiceCard = ({ service }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
      style={{
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Service Image */}
      {service.images && service.images.length > 0 && (
        <Image
          source={{ uri: service.images[0] }}
          style={{ width: '100%', height: 160 }}
        />
      )}

      {/* Service Info */}
      <View style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>
              {service.name}
            </Text>
            <Text style={{ color: colors.gray, fontSize: 14, marginTop: spacing.sm }}>
              {service.category.replace(/_/g, ' ')}
            </Text>
          </View>
          <View style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            backgroundColor: service.status === 'available' ? colors.success + '20' : colors.warning + '20',
            borderRadius: 6,
          }}>
            <Text style={{
              color: service.status === 'available' ? colors.success : colors.warning,
              fontSize: 12,
              fontWeight: '600',
            }}>
              {service.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={{ marginBottom: spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
            {service.currency} {service.basePrice.toFixed(2)}
          </Text>
          <Text style={{ color: colors.gray, fontSize: 12 }}>
            {service.unitType.replace(/_/g, ' ').toLowerCase()}
          </Text>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <MaterialIcons name="star" size={16} color={colors.warning} />
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {service.rating || 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <MaterialIcons name="bookmark" size={16} color={colors.primary} />
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {service.totalBookings || 0} bookings
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <MaterialIcons name="place" size={16} color={colors.danger} />
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {service.location.lga}
            </Text>
          </View>
        </View>

        {/* Event Types */}
        {service.eventTypes && service.eventTypes.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ fontSize: 12, color: colors.gray, marginBottom: spacing.sm }}>
              Suitable for {service.eventTypes.length} event types
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {service.eventTypes.slice(0, 3).map((type, idx) => (
                <View key={idx} style={{
                  backgroundColor: colors.light,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 11, color: colors.primary }}>
                    {type.replace(/_/g, ' ')}
                  </Text>
                </View>
              ))}
              {service.eventTypes.length > 3 && (
                <View style={{
                  backgroundColor: colors.light,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 11, color: colors.primary }}>
                    +{service.eventTypes.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Equipment */}
        {service.equipment && service.equipment.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{ fontSize: 12, color: colors.gray }}>
              ⚙️ {service.equipment.length} equipment items available
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditService', { serviceId: service._id })}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing.md,
              backgroundColor: colors.light,
              borderRadius: 8,
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="edit" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteService(service._id)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing.md,
              backgroundColor: colors.danger + '20',
              borderRadius: 8,
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="delete" size={16} color={colors.danger} />
            <Text style={{ color: colors.danger, fontWeight: '600' }}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing.md,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: colors.white, fontWeight: '600' }}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.white, flex: 1 }}>
            My Services
          </Text>
        </View>

        {/* Search */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          marginBottom: spacing.lg,
        }}>
          <Ionicons name="search" size={20} color={colors.gray} />
          <TextInput
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              color: colors.text,
            }}
          />
        </View>

        {/* Filter Buttons */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {['all', 'available', 'booked', 'unavailable'].map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                backgroundColor: filterStatus === status ? colors.white : 'rgba(255,255,255,0.2)',
                borderRadius: 6,
              }}
            >
              <Text style={{
                color: filterStatus === status ? colors.primary : colors.white,
                fontWeight: '600',
                fontSize: 12,
              }}>
                {status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Services List */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ServiceCard service={item} />}
          contentContainerStyle={{ padding: spacing.lg }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
          <MaterialIcons name="no-accounts" size={64} color={colors.gray} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginTop: spacing.lg, textAlign: 'center' }}>
            {searchQuery ? 'No services found' : "You haven't added any services yet"}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddService')}
              style={{
                marginTop: spacing.lg,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                backgroundColor: colors.primary,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <MaterialIcons name="add" size={24} color={colors.white} />
              <Text style={{ color: colors.white, fontWeight: '600' }}>Add Your First Service</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Add Service Button */}
      {filteredServices.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddService')}
          style={{
            position: 'absolute',
            bottom: spacing.xl,
            right: spacing.lg,
            width: 60,
            height: 60,
            backgroundColor: colors.primary,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <MaterialIcons name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}
