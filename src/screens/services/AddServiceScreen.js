/**
 * Add Service Screen - Service Provider
 * Allows service providers to list their services with complete details
 * Supports equipment, location, pricing, working hours, and media uploads
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Switch,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../context/authContext';
import apiClient from '../../utils/apiClient';
import { colors, spacing } from '../../styles/theme';

const SERVICE_CATEGORIES = [
  'event_planner',
  'event_manager',
  'event_services_provider',
  'event_vendor',
  'event_facilitator',
  'event_agent',
  'special_events_host',
  'special_events_organizer',
  'venue_owner',
  'venue_manager',
  'venue_decorator',
  'makeup_artist',
  'usher_service',
  'bouncer_service',
  'facilities_rental_hiring',
  'ice_chilling_service',
  'refrigerated_van_provider',
  'cooling_van_provider',
  'caterer',
  'food_supplier',
  'drinks_supplier',
  'dj_service',
  'live_performance',
  'mc_service',
  'comedian',
  'entertainer',
];

const EVENT_TYPES = [
  'birthday_party', 'wedding', 'traditional_marriage', 'anniversary', 'baby_shower',
  'bridal_shower', 'graduation_party', 'naming_ceremony', 'thanksgiving_party',
  'cocktail_party', 'funeral', 'memorial_service', 'wake', 'conference',
  'seminar', 'workshop', 'business_meeting', 'product_launch', 'award_ceremony',
  'networking_event', 'trade_fair', 'festival', 'carnival', 'cultural_day',
  'religious_gathering', 'town_hall_meeting', 'concert', 'movie_night',
  'theatre_performance', 'comedy_show', 'game_night', 'club_party',
  'football_match', 'athletic_competition', 'marathon', 'school_sports_day',
  'sports_tournament', 'lecture', 'training_program', 'academic_symposium',
  'career_fair', 'charity_event', 'fundraiser', 'volunteer_outreach',
];

const NIGERIAN_STATES = [
  'Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo',
];

const LGA_BY_STATE = {
  'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South'],
  'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South'],
  'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Eza'],
  'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South'],
  'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte Mbaise', 'Ideato North'],
};

export default function AddServiceScreen({ navigation }) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showLgaPicker, setShowLgaPicker] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    currency: 'NGN',
    pricePerUnit: '',
    unitType: 'per_event',
    eventTypes: [],
    capacity: { min: '', max: '' },
    inclusions: [],
    exclusions: [],
    location: {
      state: '',
      lga: '',
      community: '',
      address: '',
      googleMapsUrl: '',
    },
    workingHours: {
      mon: { open: '09:00', close: '17:00', available: true },
      tue: { open: '09:00', close: '17:00', available: true },
      wed: { open: '09:00', close: '17:00', available: true },
      thu: { open: '09:00', close: '17:00', available: true },
      fri: { open: '09:00', close: '17:00', available: true },
      sat: { open: '10:00', close: '18:00', available: true },
      sun: { open: '10:00', close: '18:00', available: false },
    },
    tags: [],
  });

  // Handle image picker
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.cancelled) {
        setImages([...images, ...result.assets]);
        Alert.alert('Success', `${result.assets.length} image(s) selected`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  // Handle video picker
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
      });

      if (!result.cancelled && result.assets[0]) {
        setVideoUrl(result.assets[0].uri);
        Alert.alert('Success', 'Video selected');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  // Add equipment
  const addEquipment = () => {
    const newEquipment = {
      id: Date.now(),
      name: '',
      description: '',
      quantity: 1,
      condition: 'good',
      pricePerUnit: '',
    };
    setEquipment([...equipment, newEquipment]);
  };

  // Update equipment
  const updateEquipment = (id, field, value) => {
    setEquipment(
      equipment.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Remove equipment
  const removeEquipment = (id) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  // Toggle event type
  const toggleEventType = (eventType) => {
    setFormData({
      ...formData,
      eventTypes: formData.eventTypes.includes(eventType)
        ? formData.eventTypes.filter(t => t !== eventType)
        : [...formData.eventTypes, eventType],
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        Alert.alert('Error', 'Service name is required');
        return;
      }
      if (!formData.description.trim()) {
        Alert.alert('Error', 'Service description is required');
        return;
      }
      if (!formData.category) {
        Alert.alert('Error', 'Service category is required');
        return;
      }
      if (!formData.basePrice) {
        Alert.alert('Error', 'Base price is required');
        return;
      }
      if (formData.eventTypes.length === 0) {
        Alert.alert('Error', 'Select at least one event type');
        return;
      }
      if (!formData.location.state || !formData.location.lga || !formData.location.address) {
        Alert.alert('Error', 'Location details are required');
        return;
      }

      setIsLoading(true);

      // Prepare upload data
      const uploadData = new FormData();
      
      // Add images
      images.forEach((image, index) => {
        uploadData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `service_image_${index}.jpg`,
        });
      });

      // Upload images if any
      let uploadedImages = [];
      if (images.length > 0) {
        const uploadResponse = await apiClient.post('/upload/images', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedImages = uploadResponse.data.data.images.map(img => img.url);
      }

      // Prepare service data
      const serviceData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        capacity: {
          min: formData.capacity.min ? parseInt(formData.capacity.min) : null,
          max: formData.capacity.max ? parseInt(formData.capacity.max) : null,
        },
        equipment: equipment.filter(e => e.name.trim()),
        images: uploadedImages,
        videoUrl: videoUrl || undefined,
      };

      // Create service
      const response = await apiClient.post('/services', serviceData);

      if (response.data.success) {
        Alert.alert('Success', 'Service created successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.white, marginTop: spacing.md }}>
          Add New Service
        </Text>
        <Text style={{ color: colors.light, marginTop: spacing.sm }}>
          Step {currentStep} of 5
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={{ height: 4, backgroundColor: colors.border, margin: spacing.md }}>
        <View 
          style={{
            height: '100%',
            backgroundColor: colors.success,
            width: `${(currentStep / 5) * 100}%`,
          }}
        />
      </View>

      {/* Form Content */}
      <View style={{ padding: spacing.lg }}>
        {currentStep === 1 && (
          <>
            {/* Basic Information */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md }}>
              Basic Information
            </Text>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Service Name *</Text>
            <TextInput
              placeholder="e.g., Wedding Catering"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
              }}
            />

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Description *</Text>
            <TextInput
              placeholder="Describe your service in detail..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={5}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
                textAlignVertical: 'top',
              }}
            />

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Category *</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(true)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{formData.category || 'Select category'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* Category Picker Modal */}
            <Modal visible={showCategoryPicker} animationType="slide">
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
                  <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                    <Ionicons name="close" size={28} color={colors.white} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginTop: spacing.md }}>
                    Select Category
                  </Text>
                </View>
                <FlatList
                  data={SERVICE_CATEGORIES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData({ ...formData, category: item });
                        setShowCategoryPicker(false);
                      }}
                      style={{
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: formData.category === item ? colors.light : colors.white,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>
                        {item.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Pricing & Pricing Model */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md }}>
              Pricing
            </Text>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Base Price *</Text>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
              <TextInput
                placeholder="Price"
                value={formData.basePrice}
                onChangeText={(text) => setFormData({ ...formData, basePrice: text })}
                keyboardType="decimal-pad"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                }}
              />
              <View style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                justifyContent: 'center',
              }}>
                <Text style={{ fontWeight: '600' }}>{formData.currency}</Text>
              </View>
            </View>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Unit Type *</Text>
            <View style={{ marginBottom: spacing.lg }}>
              {['per_event', 'per_person', 'per_hour', 'per_day', 'flat_rate'].map(unit => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => setFormData({ ...formData, unitType: unit })}
                  style={{
                    paddingVertical: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                  }}
                >
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    backgroundColor: formData.unitType === unit ? colors.primary : colors.white,
                  }} />
                  <Text>{unit.replace(/_/g, ' ').toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Event Types */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.lg }}>
              Suitable Event Types *
            </Text>
            <TouchableOpacity
              onPress={() => setShowEventTypePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <Text style={{ color: colors.text }}>
                {formData.eventTypes.length > 0 
                  ? `${formData.eventTypes.length} selected`
                  : 'Select event types'
                }
              </Text>
            </TouchableOpacity>

            {/* Event Types Modal */}
            <Modal visible={showEventTypePicker} animationType="slide">
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
                  <TouchableOpacity onPress={() => setShowEventTypePicker(false)}>
                    <Ionicons name="close" size={28} color={colors.white} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginTop: spacing.md }}>
                    Select Event Types
                  </Text>
                </View>
                <FlatList
                  data={EVENT_TYPES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => toggleEventType(item)}
                      style={{
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                      }}
                    >
                      <MaterialIcons
                        name={formData.eventTypes.includes(item) ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={{ fontSize: 16 }}>
                        {item.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Location */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md }}>
              Location
            </Text>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>State *</Text>
            <TouchableOpacity
              onPress={() => setShowStatePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{formData.location.state || 'Select state'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* State Picker Modal */}
            <Modal visible={showStatePicker} animationType="slide">
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
                  <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                    <Ionicons name="close" size={28} color={colors.white} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginTop: spacing.md }}>
                    Select State
                  </Text>
                </View>
                <FlatList
                  data={NIGERIAN_STATES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData({
                          ...formData,
                          location: { ...formData.location, state: item, lga: '' }
                        });
                        setShowStatePicker(false);
                      }}
                      style={{
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: formData.location.state === item ? colors.light : colors.white,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>LGA *</Text>
            <TouchableOpacity
              onPress={() => setShowLgaPicker(true)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{formData.location.lga || 'Select LGA'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* LGA Picker Modal */}
            <Modal visible={showLgaPicker} animationType="slide">
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ backgroundColor: colors.primary, padding: spacing.lg, paddingTop: spacing.xl }}>
                  <TouchableOpacity onPress={() => setShowLgaPicker(false)}>
                    <Ionicons name="close" size={28} color={colors.white} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginTop: spacing.md }}>
                    Select LGA
                  </Text>
                </View>
                <FlatList
                  data={LGA_BY_STATE[formData.location.state] || []}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData({
                          ...formData,
                          location: { ...formData.location, lga: item }
                        });
                        setShowLgaPicker(false);
                      }}
                      style={{
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: formData.location.lga === item ? colors.light : colors.white,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Community</Text>
            <TextInput
              placeholder="Enter your community"
              value={formData.location.community}
              onChangeText={(text) => setFormData({
                ...formData,
                location: { ...formData.location, community: text }
              })}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
              }}
            />

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Business Address *</Text>
            <TextInput
              placeholder="Enter your business address"
              value={formData.location.address}
              onChangeText={(text) => setFormData({
                ...formData,
                location: { ...formData.location, address: text }
              })}
              multiline
              numberOfLines={2}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
                textAlignVertical: 'top',
              }}
            />

            <Text style={{ marginBottom: spacing.sm, fontWeight: '600' }}>Google Maps URL</Text>
            <TextInput
              placeholder="Paste Google Maps link (optional)"
              value={formData.location.googleMapsUrl}
              onChangeText={(text) => setFormData({
                ...formData,
                location: { ...formData.location, googleMapsUrl: text }
              })}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                marginBottom: spacing.lg,
              }}
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            {/* Equipment */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md }}>
              Equipment (Optional)
            </Text>

            {equipment.length > 0 && (
              <View style={{ marginBottom: spacing.lg }}>
                {equipment.map((item) => (
                  <View key={item.id} style={{
                    backgroundColor: colors.light,
                    borderRadius: 8,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                      <Text style={{ fontWeight: '600' }}>Equipment #{equipment.indexOf(item) + 1}</Text>
                      <TouchableOpacity onPress={() => removeEquipment(item.id)}>
                        <MaterialIcons name="delete" size={24} color={colors.danger} />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      placeholder="Equipment name"
                      value={item.name}
                      onChangeText={(text) => updateEquipment(item.id, 'name', text)}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        marginBottom: spacing.md,
                      }}
                    />

                    <TextInput
                      placeholder="Quantity"
                      value={String(item.quantity)}
                      onChangeText={(text) => updateEquipment(item.id, 'quantity', parseInt(text) || 1)}
                      keyboardType="number-pad"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        marginBottom: spacing.md,
                      }}
                    />

                    <TextInput
                      placeholder="Price per unit (optional)"
                      value={item.pricePerUnit}
                      onChangeText={(text) => updateEquipment(item.id, 'pricePerUnit', text)}
                      keyboardType="decimal-pad"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      }}
                    />
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              onPress={addEquipment}
              style={{
                backgroundColor: colors.light,
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 8,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.lg,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: spacing.md,
              }}
            >
              <MaterialIcons name="add" size={24} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Add Equipment</Text>
            </TouchableOpacity>

            {/* Media */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.lg }}>
              Media (Optional)
            </Text>

            <TouchableOpacity
              onPress={pickImages}
              style={{
                backgroundColor: colors.light,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.primary,
                borderRadius: 8,
                paddingVertical: spacing.lg,
                alignItems: 'center',
                marginBottom: spacing.lg,
                gap: spacing.md,
              }}
            >
              <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Add Service Photos</Text>
              <Text style={{ fontSize: 12, color: colors.gray }}>
                {images.length > 0 ? `${images.length} selected` : 'Max 10 images'}
              </Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <View style={{ marginBottom: spacing.lg }}>
                <Text style={{ marginBottom: spacing.md, fontWeight: '600' }}>Selected Images:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
                  {images.map((img, idx) => (
                    <View key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                      <Image
                        source={{ uri: img.uri }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                      />
                      <TouchableOpacity
                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: colors.danger,
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: colors.white }}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={pickVideo}
              style={{
                backgroundColor: colors.light,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.primary,
                borderRadius: 8,
                paddingVertical: spacing.lg,
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <MaterialIcons name="videocam" size={32} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Add Service Video</Text>
              {videoUrl && <Text style={{ fontSize: 12, color: colors.success }}>Video selected</Text>}
            </TouchableOpacity>
          </>
        )}

        {currentStep === 5 && (
          <>
            {/* Review & Submit */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md }}>
              Review Your Service
            </Text>

            <View style={{
              backgroundColor: colors.light,
              borderRadius: 8,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: spacing.md }}>{formData.name}</Text>
              <View style={{ gap: spacing.md }}>
                <View><Text style={{ color: colors.gray }}>Category</Text><Text style={{ fontWeight: '600' }}>{formData.category}</Text></View>
                <View><Text style={{ color: colors.gray }}>Base Price</Text><Text style={{ fontWeight: '600' }}>{formData.currency} {formData.basePrice}</Text></View>
                <View><Text style={{ color: colors.gray }}>Location</Text><Text style={{ fontWeight: '600' }}>{formData.location.lga}, {formData.location.state}</Text></View>
                <View><Text style={{ color: colors.gray }}>Event Types</Text><Text style={{ fontWeight: '600' }}>{formData.eventTypes.length} selected</Text></View>
                <View><Text style={{ color: colors.gray }}>Equipment</Text><Text style={{ fontWeight: '600' }}>{equipment.filter(e => e.name).length} items</Text></View>
                <View><Text style={{ color: colors.gray }}>Images</Text><Text style={{ fontWeight: '600' }}>{images.length} photos</Text></View>
              </View>
            </View>

            <View style={{
              backgroundColor: colors.warning + '20',
              borderRadius: 8,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              flexDirection: 'row',
              gap: spacing.md,
            }}>
              <MaterialIcons name="info" size={24} color={colors.warning} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: spacing.sm }}>Before You Submit</Text>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  • Service images and details will be reviewed by admin• You'll be notified once verified• Pricing is in {formData.currency}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.xl }}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => setCurrentStep(currentStep - 1)}
              style={{
                flex: 1,
                paddingVertical: spacing.lg,
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              paddingVertical: spacing.lg,
              backgroundColor: colors.primary,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>
                {currentStep < 5 ? 'Next' : 'Submit Service'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
