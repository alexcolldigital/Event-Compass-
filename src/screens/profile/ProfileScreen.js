/**
 * Profile Screen - Modern & Responsive
 * User profile display and management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../context/authContext';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme';

const darkColor = '#1A1A1A';

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, isLoading, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    // Update edit data when user changes
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings are coming soon');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings page is coming soon');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help page is coming soon');
  };

  const handleLogout = async () => {
    console.log('================================================');
    console.log('🔴 LOGOUT INITIATED IN PROFILESCREEN');
    console.log('================================================');
    
    // On web, use window.confirm; on mobile, use Alert
    const isWeb = typeof window !== 'undefined';
    const confirmed = isWeb 
      ? window.confirm('Are you sure you want to logout?')
      : await new Promise(resolve => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Logout', onPress: () => resolve(true), style: 'destructive' },
            ],
            { cancelable: false }
          );
        });

    if (!confirmed) {
      console.log('⚪ Logout cancelled by user');
      return;
    }

    try {
      console.log('🔴 USER CONFIRMED LOGOUT - Calling logout()...');
      console.log('   Logout function type:', typeof logout);
      await logout();
      console.log('🟢 Logout completed successfully');
    } catch (error) {
      console.error('================================================');
      console.error('❌ LOGOUT FAILED IN PROFILESCREEN');
      console.error('================================================');
      console.error('Error Message:', error?.message);
      console.error('Error Stack:', error?.stack);
      console.error('Full Error:', error);
      console.error('================================================');
      Alert.alert('Error', error?.message || 'Failed to logout');
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerSection}>
        <View style={styles.profileImageContainer}>
          {user?.profileImage ? (
            <Image
              source={{
                uri: user.profileImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={60} color="white" />
            </View>
          )}
          <TouchableOpacity style={styles.editImageButton} activeOpacity={0.7}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.fullName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.role}>
          {user?.role === 'service_provider' ? '💼 Service Provider' : '👤 Client'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Location */}
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text style={styles.locationText}>{user?.lga}, {user?.state}</Text>
        </View>
      </View>

      {/* Edit Mode Toggle */}
      {!isEditing && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* Profile Information */}
      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>Edit Your Profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={18} color={colors.gray[500]} />
              <TextInput
                style={styles.input}
                value={editData.firstName}
                onChangeText={(text) => setEditData({ ...editData, firstName: text })}
                placeholder="First name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={18} color={colors.gray[500]} />
              <TextInput
                style={styles.input}
                value={editData.lastName}
                onChangeText={(text) => setEditData({ ...editData, lastName: text })}
                placeholder="Last name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={18} color={colors.gray[500]} />
              <TextInput
                style={styles.input}
                value={editData.phone}
                onChangeText={(text) => setEditData({ ...editData, phone: text })}
                keyboardType="phone-pad"
                placeholder="Phone number"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <View style={[styles.inputContainer, styles.bioContainer]}>
              <Ionicons name="document-text" size={18} color={colors.gray[500]} />
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editData.bio}
                onChangeText={(text) => setEditData({ ...editData, bio: text })}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Save/Cancel Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="white" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color={colors.gray[700]} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* User Information Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="call" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user?.lga}, {user?.state}</Text>
              </View>
            </View>

            {user?.bio && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>About</Text>
                    <Text style={styles.infoValue}>{user.bio}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Service Provider Section */}
          {user?.role === 'service_provider' && (
            <View style={styles.businessSection}>
              <View style={styles.businessHeader}>
                <Ionicons name="briefcase" size={24} color={colors.primary} />
                <Text style={styles.businessSectionTitle}>Business Information</Text>
              </View>

              <View style={styles.businessItem}>
                <Text style={styles.businessLabel}>Business Name</Text>
                <Text style={styles.businessValue}>{user?.businessName || 'Not provided'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.businessItem}>
                <Text style={styles.businessLabel}>Category</Text>
                <Text style={styles.businessValue}>{user?.businessCategory || 'Not provided'}</Text>
              </View>

              {user?.businessDescription && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.businessItem}>
                    <Text style={styles.businessLabel}>Description</Text>
                    <Text style={styles.businessValue}>{user.businessDescription}</Text>
                  </View>
                </>
              )}

              {user?.businessRating && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.businessItem}>
                    <Text style={styles.businessLabel}>Rating</Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingValue}>{user.businessRating.toFixed(1)}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Notifications</Text>
            <Text style={styles.actionSubtitle}>Manage your alerts</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSettings}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="settings" size={20} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSubtitle}>App preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleHelp}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="help-circle" size={20} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Help & Support</Text>
            <Text style={styles.actionSubtitle}>Get assistance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, styles.logoutIconContainer]}>
            <Ionicons name="log-out" size={20} color={colors.error} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, styles.logoutTitle]}>Logout</Text>
            <Text style={[styles.actionSubtitle, styles.logoutSubtitle]}>Sign out of your account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  headerSection: {
    backgroundColor: 'white',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...shadows.md,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[300],
    borderWidth: 4,
    borderColor: colors.primary,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    ...shadows.md,
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: darkColor,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  role: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  email: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  editButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  editSection: {
    backgroundColor: 'white',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: darkColor,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  bioContainer: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 15,
    color: darkColor,
    paddingVertical: spacing.sm,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.sm,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButtonText: {
    color: colors.gray[700],
    fontSize: 15,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: darkColor,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  businessSection: {
    backgroundColor: 'white',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  businessSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: darkColor,
  },
  businessItem: {
    paddingVertical: spacing.md,
  },
  businessLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  businessValue: {
    fontSize: 15,
    fontWeight: '600',
    color: darkColor,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  actionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIconContainer: {
    backgroundColor: colors.error + '20',
  },
  actionContent: {
    flex: 1,
    marginHorizontal: spacing.lg,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: darkColor,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.gray[600],
  },
  logoutButton: {
    backgroundColor: colors.error + '08',
  },
  logoutTitle: {
    color: colors.error,
  },
  logoutSubtitle: {
    color: colors.error + 'CC',
  },
};
