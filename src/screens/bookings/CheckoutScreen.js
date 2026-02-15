/**
 * Checkout Screen
 * Complete event details and confirm booking
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '../../context/cartContext';
import { useBookingStore } from '../../context/bookingContext';
import { useAuthStore } from '../../context/authContext';
import { colors, spacing, borderRadius } from '../../styles/theme';

const EVENT_TYPES = [
  'birthday_party',
  'wedding',
  'traditional_marriage',
  'anniversary',
  'baby_shower',
  'corporate_event',
  'conference',
  'concert',
  'exhibition',
  'festival',
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: 'account-balance' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'wallet' },
];

export default function CheckoutScreen({ navigation }) {
  const { cartItems, cartTotal, clearCart } = useCartStore();
  const { createBooking, isLoading: bookingLoading } = useBookingStore();
  const { user } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow by default
    eventEndDate: new Date(Date.now() + 25 * 60 * 60 * 1000),
    eventType: EVENT_TYPES[0],
    guestCount: '50',
    specialRequests: '',
    state: '',
    lga: '',
    community: '',
    address: '',
    budgetAmount: cartTotal.toString(),
    downPayment: (cartTotal * 0.3).toString(), // 30% down payment
    paymentMethod: 'card',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState('eventDate');
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please add items to your cart before checkout',
        [{ text: 'OK', onPress: () => navigation.replace('Cart') }]
      );
    }
  }, [cartItems, navigation]);

  /**
   * Handle date input change
   */
  const handleDateChange = (dateString, field) => {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        setFormData({
          ...formData,
          [field]: date,
        });
      }
    } catch (error) {
      console.error('Invalid date:', error);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventType) newErrors.eventType = 'Please select event type';
    if (!formData.guestCount || parseInt(formData.guestCount) <= 0) {
      newErrors.guestCount = 'Please enter valid guest count';
    }
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.lga) newErrors.lga = 'LGA is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      newErrors.budgetAmount = 'Budget amount is required';
    }
    if (!formData.downPayment || parseFloat(formData.downPayment) <= 0) {
      newErrors.downPayment = 'Down payment is required';
    }
    if (
      parseFloat(formData.downPayment) > parseFloat(formData.budgetAmount)
    ) {
      newErrors.downPayment = 'Down payment cannot exceed budget amount';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Select payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle checkout submission
   */
  const handleCheckout = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data - Create separate bookings for each service/equipment
      // If quantity > 1, create multiple bookings for the same service
      const bookingPromises = cartItems.flatMap((item) => {
        const quantity = item.quantity || 1;
        const bookingsForItem = [];
        
        for (let i = 0; i < quantity; i++) {
          bookingsForItem.push(
            createBooking({
              serviceId: item._id,
              eventDate: formData.eventDate.toISOString(),
              eventEndDate: formData.eventEndDate.toISOString(),
              eventType: formData.eventType,
              eventLocation: {
                state: formData.state,
                lga: formData.lga,
                community: formData.community,
                address: formData.address,
              },
              guestCount: parseInt(formData.guestCount),
              specialRequests: formData.specialRequests,
              budgetAmount: parseFloat(formData.budgetAmount),
              downPayment: parseFloat(formData.downPayment),
              paymentMethod: formData.paymentMethod,
            })
          );
        }
        
        return bookingsForItem;
      });

      await Promise.all(bookingPromises);

      // Clear cart after successful booking
      clearCart();

      // Show success message
      Alert.alert(
        'Booking Confirmed!',
        'Your bookings have been created successfully. Service providers will confirm shortly.',
        [
          {
            text: 'View Bookings',
            onPress: () => navigation.getParent()?.getParent()?.replace('ClientTabs', { screen: 'BookingsTab' }),
          },
          {
            text: 'Home',
            onPress: () => navigation.getParent()?.getParent()?.replace('ClientTabs', { screen: 'HomeTab' }),
          },
        ]
      );

      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Booking Failed',
        error.response?.data?.message || 'Unable to create booking. Please try again.'
      );
    }
  };

  /**
   * Render error message
   */
  const renderError = (field) => {
    if (errors[field]) {
      return (
        <View
          style={{
            backgroundColor: colors.danger + '15',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            marginTop: spacing.xs,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="alert-circle"
            size={16}
            color={colors.danger}
            style={{ marginRight: spacing.sm }}
          />
          <Text style={{ color: colors.danger, fontSize: 12 }}>
            {errors[field]}
          </Text>
        </View>
      );
    }
    return null;
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      >
        {/* Order Summary */}
        <View
          style={{
            backgroundColor: colors.gray[100],
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: colors.gray[800],
              marginBottom: spacing.md,
            }}
          >
            Order Summary
          </Text>

          {cartItems.map((item, index) => (
            <View
              key={item.cartItemId}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: index < cartItems.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray[300],
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: colors.gray[700],
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name} x{item.quantity || 1}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.gray[800],
                }}
              >
                ₦{((item.basePrice || 0) * (item.quantity || 1)).toLocaleString()}
              </Text>
            </View>
          ))}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacing.md,
              paddingTop: spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.gray[300],
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.gray[800],
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              ₦{cartTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Event Details Section */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.gray[800],
            marginBottom: spacing.md,
          }}
        >
          Event Details
        </Text>

        {/* Event Type */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Event Type
          </Text>
          <TouchableOpacity
            onPress={() => setShowEventTypeModal(true)}
            style={{
              borderWidth: 1,
              borderColor: errors.eventType ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              floatingDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.white,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: formData.eventType ? colors.gray[800] : colors.gray[500],
              }}
            >
              {formData.eventType?.replace(/_/g, ' ').toUpperCase()}
            </Text>
            <MaterialIcons name="expand-more" size={20} color={colors.gray[500]} />
          </TouchableOpacity>
          {renderError('eventType')}
        </View>

        {/* Guest Count */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Expected Guest Count
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.guestCount ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="e.g., 50"
            placeholderTextColor={colors.gray[500]}
            keyboardType="numeric"
            value={formData.guestCount}
            onChangeText={(text) =>
              setFormData({ ...formData, guestCount: text })
            }
          />
          {renderError('guestCount')}
        </View>

        {/* Event Date */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Event Date
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[500]}
            value={formatDate(formData.eventDate)}
            onChangeText={(text) =>
              handleDateChange(text, 'eventDate')
            }
          />
        </View>

        {/* Event End Date */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Event End Date
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[500]}
            value={formatDate(formData.eventEndDate)}
            onChangeText={(text) =>
              handleDateChange(text, 'eventEndDate')
            }
          />
        </View>

        {/* Location Section */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.gray[800],
            marginTop: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          Event Location
        </Text>

        {/* State */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            State
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.state ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="State"
            placeholderTextColor={colors.gray[500]}
            value={formData.state}
            onChangeText={(text) =>
              setFormData({ ...formData, state: text })
            }
          />
          {renderError('state')}
        </View>

        {/* LGA */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Local Government Area (LGA)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.lga ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="LGA"
            placeholderTextColor={colors.gray[500]}
            value={formData.lga}
            onChangeText={(text) =>
              setFormData({ ...formData, lga: text })
            }
          />
          {renderError('lga')}
        </View>

        {/* Community */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Community (Optional)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="Community"
            placeholderTextColor={colors.gray[500]}
            value={formData.community}
            onChangeText={(text) =>
              setFormData({ ...formData, community: text })
            }
          />
        </View>

        {/* Address */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Address
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.address ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
              minHeight: 80,
            }}
            placeholder="Full address"
            placeholderTextColor={colors.gray[500]}
            value={formData.address}
            onChangeText={(text) =>
              setFormData({ ...formData, address: text })
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {renderError('address')}
        </View>

        {/* Special Requests */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Special Requests (Optional)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
              minHeight: 80,
            }}
            placeholder="Any special requests or requirements"
            placeholderTextColor={colors.gray[500]}
            value={formData.specialRequests}
            onChangeText={(text) =>
              setFormData({ ...formData, specialRequests: text })
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Section */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.gray[800],
            marginTop: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          Payment Details
        </Text>

        {/* Budget Amount */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Total Budget
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.budgetAmount ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="Total budget"
            placeholderTextColor={colors.gray[500]}
            keyboardType="numeric"
            value={formData.budgetAmount}
            onChangeText={(text) =>
              setFormData({ ...formData, budgetAmount: text })
            }
          />
          {renderError('budgetAmount')}
        </View>

        {/* Down Payment */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Down Payment (30%)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.downPayment ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: 14,
              color: colors.gray[800],
            }}
            placeholder="Down payment"
            placeholderTextColor={colors.gray[500]}
            keyboardType="numeric"
            value={formData.downPayment}
            onChangeText={(text) =>
              setFormData({ ...formData, downPayment: text })
            }
          />
          {renderError('downPayment')}
        </View>

        {/* Payment Method */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.sm,
            }}
          >
            Payment Method
          </Text>
          <TouchableOpacity
            onPress={() => setShowPaymentModal(true)}
            style={{
              borderWidth: 1,
              borderColor: errors.paymentMethod ? colors.danger : colors.gray[300],
              borderRadius: borderRadius.md,
              padding: spacing.md,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.white,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: formData.paymentMethod ? colors.gray[800] : colors.gray[500],
              }}
            >
              {PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)?.label}
            </Text>
            <MaterialIcons name="expand-more" size={20} color={colors.gray[500]} />
          </TouchableOpacity>
          {renderError('paymentMethod')}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          backgroundColor: colors.white,
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={isSubmitting || bookingLoading}
          style={{
            backgroundColor:
              isSubmitting || bookingLoading ? colors.gray[400] : colors.primary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isSubmitting || bookingLoading ? (
            <ActivityIndicator color={colors.white} style={{ marginRight: spacing.md }} />
          ) : (
            <Ionicons
              name="checkmark"
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
            {isSubmitting || bookingLoading ? 'Processing...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {/* Removed - using TextInput for dates */}

      {/* Event Type Modal */}
      <Modal
        visible={showEventTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEventTypeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              padding: spacing.lg,
              maxHeight: '80%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.gray[800],
                }}
              >
                Select Event Type
              </Text>
              <TouchableOpacity
                onPress={() => setShowEventTypeModal(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={EVENT_TYPES}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setFormData({ ...formData, eventType: item });
                    setShowEventTypeModal(false);
                  }}
                  style={{
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray[200],
                    backgroundColor:
                      formData.eventType === item
                        ? colors.primary + '15'
                        : colors.white,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight:
                        formData.eventType === item ? '700' : '500',
                      color: colors.gray[800],
                    }}
                  >
                    {item.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              scrollEnabled
              nestedScrollEnabled
            />
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              padding: spacing.lg,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.gray[800],
                }}
              >
                Select Payment Method
              </Text>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            </View>

            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setFormData({ ...formData, paymentMethod: method.id });
                  setShowPaymentModal(false);
                }}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray[200],
                  backgroundColor:
                    formData.paymentMethod === method.id
                      ? colors.primary + '15'
                      : colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons
                  name={method.icon}
                  size={24}
                  color={
                    formData.paymentMethod === method.id
                      ? colors.primary
                      : colors.gray[600]
                  }
                  style={{ marginRight: spacing.md }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight:
                      formData.paymentMethod === method.id ? '700' : '500',
                    color: colors.gray[800],
                  }}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
