/**
 * Service Detail Screen
 * Display detailed information about a service with option to add to cart
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useServicesStore } from '../../context/servicesContext';
import { useCartStore } from '../../context/cartContext';
import { colors, spacing, borderRadius } from '../../styles/theme';

const screenWidth = Dimensions.get('window').width;

export default function ServiceDetailScreen({ route, navigation }) {
  const { serviceId } = route.params || {};
  const { services, fetchServiceById, isLoading } = useServicesStore();
  const { addToCart } = useCartStore();

  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch service details
  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    try {
      // Try to get from context first
      let serviceData = services.find((s) => s._id === serviceId);

      if (!serviceData && fetchServiceById) {
        // Fetch from API if not found in context
        const response = await fetchServiceById(serviceId);
        serviceData = response?.data || response;
      }

      setService(serviceData);
    } catch (error) {
      console.error('Error loading service:', error);
      Alert.alert('Error', 'Failed to load service details');
    }
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!service) return;

    setAddingToCart(true);
    try {
      addToCart(service);
      Alert.alert(
        'Added to Cart',
        `${service.name} has been added to your cart`,
        [
          { text: 'Continue Shopping', onPress: () => {} },
          {
            text: 'View Cart',
            onPress: () => navigation.getParent()?.getParent()?.navigate('Cart'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading || !service) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        {/* Image Gallery */}
        <View
          style={{
            height: 300,
            backgroundColor: colors.gray[200],
            position: 'relative',
          }}
        >
          <Image
            source={{
              uri: service.images?.[selectedImage] || 'https://via.placeholder.com/400x300',
            }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />

          {/* Image Counter Badge */}
          {service.images && service.images.length > 1 && (
            <View
              style={{
                position: 'absolute',
                bottom: spacing.md,
                right: spacing.md,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.full,
              }}
            >
              <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
                {selectedImage + 1} / {service.images.length}
              </Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: spacing.md,
              left: spacing.md,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: borderRadius.full,
              padding: spacing.sm,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray[800]} />
          </TouchableOpacity>
        </View>

        {/* Image Thumbnails */}
        {service.images && service.images.length > 1 && (
          <View
            style={{
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              flexDirection: 'row',
              gap: spacing.sm,
            }}
          >
            {service.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: borderRadius.md,
                  borderWidth: selectedImage === index ? 2 : 0,
                  borderColor: colors.primary,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Service Info */}
        <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
          {/* Category Badge */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.primary + '20',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.full,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {service.category?.toUpperCase()}
            </Text>
          </View>

          {/* Service Name */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.gray[800],
              marginBottom: spacing.sm,
            }}
          >
            {service.name}
          </Text>

          {/* Rating and Reviews */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: spacing.md,
              }}
            >
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.gray[800],
                  marginLeft: spacing.xs,
                }}
              >
                {service.rating || '4.5'}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: colors.gray[600],
              }}
            >
              ({service.reviewCount || '128'} reviews)
            </Text>
          </View>

          {/* Price */}
          <View
            style={{
              backgroundColor: colors.gray[100],
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.gray[600],
                marginBottom: spacing.sm,
              }}
            >
              Starting From
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: colors.primary,
                }}
              >
                ₦{(service.basePrice || 0).toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.gray[600],
                }}
              >
                {service.unitType === 'per_person' && 'per person'}
                {service.unitType === 'per_hour' && 'per hour'}
                {service.unitType === 'per_day' && 'per day'}
                {service.unitType === 'flat_rate' && 'flat rate'}
                {service.unitType === 'per_event' && 'per event'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.gray[800],
              marginBottom: spacing.md,
            }}
          >
            About This Service
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.gray[600],
              lineHeight: 20,
              marginBottom: spacing.lg,
            }}
          >
            {service.description}
          </Text>

          {/* Service Provider */}
          {service.provider && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: colors.gray[800],
                  marginBottom: spacing.md,
                }}
              >
                Service Provider
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProviderProfile', {
                    providerId: service.providerId,
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray[200],
                  marginBottom: spacing.lg,
                }}
              >
                <Image
                  source={{
                    uri: service.provider?.profileImage || 'https://via.placeholder.com/50x50',
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: borderRadius.full,
                    marginRight: spacing.md,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.gray[800],
                    }}
                  >
                    {service.provider?.firstName} {service.provider?.lastName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray[600],
                    }}
                  >
                    {service.provider?.businessName}
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </>
          )}

          {/* Availability */}
          {service.availability && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: colors.gray[800],
                  marginBottom: spacing.md,
                }}
              >
                Availability
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                  marginBottom: spacing.lg,
                }}
              >
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                  <View
                    key={day}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.lg,
                      backgroundColor: service.availability[day]
                        ? colors.primary + '15'
                        : colors.gray[200],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: service.availability[day]
                          ? colors.primary
                          : colors.gray[600],
                      }}
                    >
                      {day.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Event Types */}
          {service.eventTypes && service.eventTypes.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: colors.gray[800],
                  marginBottom: spacing.md,
                }}
              >
                Suitable For
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                  marginBottom: spacing.lg,
                }}
              >
                {service.eventTypes.slice(0, 5).map((eventType, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.lg,
                      backgroundColor: colors.gray[100],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '500',
                        color: colors.gray[700],
                      }}
                    >
                      {eventType.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          paddingBottom: spacing.xl,
          backgroundColor: colors.white,
        }}
      >
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={addingToCart}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {addingToCart ? (
            <ActivityIndicator color={colors.white} style={{ marginRight: spacing.md }} />
          ) : (
            <MaterialIcons
              name="add-shopping-cart"
              size={20}
              color={colors.white}
              style={{ marginRight: spacing.md }}
            />
          )}
          <Text
            style={{
              color: colors.white,
              fontWeight: '700',
              fontSize: 16,
            }}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>

        {/* Book Now Alternative */}
        <TouchableOpacity
          onPress={() => {
            // Add to cart and go to checkout immediately
            addToCart(service);
            navigation.getParent()?.getParent()?.navigate('Checkout');
          }}
          style={{
            marginTop: spacing.md,
            paddingVertical: spacing.md,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: '600',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Book Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
