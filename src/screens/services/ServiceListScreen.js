import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles/theme';

export default function ServiceListScreen({ navigation }) {
  // Add header button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddService')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: spacing.md,
            gap: spacing.xs,
          }}
        >
          <MaterialIcons name="add" size={24} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      {/* Empty State */}
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
        <MaterialIcons name="shopping-bag" size={48} color={colors.gray[300]} />
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: spacing.lg, color: colors.gray[600] }}>
          No Services Yet
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: spacing.sm, textAlign: 'center' }}>
          Create your first service to start accepting bookings
        </Text>

        {/* Add Service Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AddService')}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: 8,
            marginTop: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
            Add Your First Service
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
