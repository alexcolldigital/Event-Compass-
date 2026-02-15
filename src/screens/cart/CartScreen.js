/**
 * Cart Screen
 * Display cart items and allow users to proceed to checkout
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCartStore } from '../../context/cartContext';
import { colors, spacing, borderRadius } from '../../styles/theme';

const screenWidth = Dimensions.get('window').width;

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  // Calculate cart summary
  const cartSummary = useMemo(() => {
    return {
      itemCount: cartItems.length,
      totalQuantity: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
      subtotal: cartTotal,
      tax: cartTotal * 0.075, // 7.5% tax
      total: cartTotal * 1.075,
    };
  }, [cartItems, cartTotal]);

  /**
   * Handle remove item
   */
  const handleRemoveItem = (cartItemId, itemName) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${itemName} from cart?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => removeFromCart(cartItemId),
          style: 'destructive',
        },
      ]
    );
  };

  /**
   * Handle clear cart
   */
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => clearCart(),
          style: 'destructive',
        },
      ]
    );
  };

  /**
   * Render cart item
   */
  const renderCartItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.gray[100],
        borderRadius: borderRadius.lg,
        alignItems: 'center',
      }}
    >
      {/* Product Image */}
      <Image
        source={{
          uri: item.images?.[0] || 'https://via.placeholder.com/80x80',
        }}
        style={{
          width: 80,
          height: 80,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
        }}
      />

      {/* Product Details */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.gray[800],
            marginBottom: spacing.xs,
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: colors.gray[600],
            marginBottom: spacing.sm,
          }}
          numberOfLines={1}
        >
          {item.category}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.primary,
          }}
        >
          ₦{(item.basePrice || 0).toLocaleString()}
        </Text>
      </View>

      {/* Quantity Control */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
          borderWidth: 1,
          borderColor: colors.gray[300],
        }}
      >
        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.cartItemId, (item.quantity || 1) - 1)
          }
          style={{ padding: spacing.xs }}
        >
          <MaterialIcons name="remove" size={18} color={colors.gray[600]} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.gray[800],
            minWidth: 30,
            textAlign: 'center',
          }}
        >
          {item.quantity || 1}
        </Text>

        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.cartItemId, (item.quantity || 1) + 1)
          }
          style={{ padding: spacing.xs }}
        >
          <MaterialIcons name="add" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() =>
          handleRemoveItem(item.cartItemId, item.name)
        }
        style={{ padding: spacing.sm }}
      >
        <Ionicons name="trash" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[200],
          backgroundColor: colors.gray[100],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.gray[800],
            }}
          >
            Shopping Cart
          </Text>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={{ color: colors.danger, fontWeight: '600' }}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {cartItems.length === 0 ? (
        // Empty Cart
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.lg,
          }}
        >
          <MaterialIcons
            name="shopping-cart"
            size={64}
            color={colors.gray[300]}
            style={{ marginBottom: spacing.lg }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.gray[700],
              marginBottom: spacing.md,
              textAlign: 'center',
            }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.gray[600],
              marginBottom: spacing.lg,
              textAlign: 'center',
            }}
          >
            Add services and equipment to get started
          </Text>
          <TouchableOpacity
            onPress={() => navigation.getParent()?.getParent()?.navigate('ClientTabs', { screen: 'HomeTab' })}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.lg,
              marginTop: spacing.lg,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cartItemId}
            scrollEnabled={false}
            style={{ padding: spacing.lg, flex: 1 }}
          />

          {/* Cart Summary */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.gray[200],
              backgroundColor: colors.gray[50],
              padding: spacing.lg,
            }}
          >
            {/* Subtotal */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.gray[600],
                }}
              >
                Subtotal ({cartSummary.totalQuantity} items)
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.gray[800],
                }}
              >
                ₦{cartSummary.subtotal.toLocaleString()}
              </Text>
            </View>

            {/* Tax */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
                paddingBottom: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.gray[200],
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.gray[600],
                }}
              >
                Tax (7.5%)
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.gray[800],
                }}
              >
                ₦{cartSummary.tax.toLocaleString()}
              </Text>
            </View>

            {/* Total */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing.lg,
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
                ₦{cartSummary.total.toLocaleString()}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Checkout')}
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
              <Text
                style={{
                  color: colors.white,
                  fontWeight: '700',
                  fontSize: 16,
                }}
              >
                Proceed to Checkout
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={colors.white}
                style={{ marginLeft: spacing.md }}
              />
            </TouchableOpacity>

            {/* Continue Shopping */}
            <TouchableOpacity
              onPress={() => navigation.getParent()?.getParent()?.navigate('ClientTabs', { screen: 'HomeTab' })}
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
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
