/**
 * Messages Screen - Modern & Responsive
 * View and manage conversations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../context/messageContext';
import { useAuthStore } from '../../context/authContext';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme';

export default function MessagesScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, isLoading, fetchConversations, error } = useMessageStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      await fetchConversations();
    } catch (err) {
      console.log('Error loading conversations:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participantOne?._id === user?._id ? conv.participantTwo : conv.participantOne;
    const userName = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.toLowerCase();
    return userName.includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderConversation = ({ item }) => {
    const otherUser = item.participantOne?._id === user?._id ? item.participantTwo : item.participantOne;
    const lastMessage = item.messages?.[item.messages.length - 1];
    const isUnread = lastMessage && lastMessage.sender !== user?._id && !lastMessage.read;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen', { conversationId: item._id, otherUser })}
        style={[styles.conversationCard, isUnread && styles.unreadCard]}
      >
        <View style={styles.avatarContainer}>
          {otherUser?.profileImage ? (
            <Image
              source={{ uri: otherUser.profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={24} color="white" />
            </View>
          )}
          {isUnread && <View style={styles.unreadBadge} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {otherUser?.firstName} {otherUser?.lastName}
            </Text>
            <Text style={styles.timeText}>{formatTime(lastMessage?.createdAt)}</Text>
          </View>
          <Text
            style={[styles.lastMessage, isUnread && styles.unreadMessage]}
            numberOfLines={1}
          >
            {lastMessage?.message || 'No messages yet'}
          </Text>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={60} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>Start a conversation by booking a service</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('SearchTab')}
      >
        <Text style={styles.startButtonText}>Find Services</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.gray[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversations List */}
      {isLoading && conversations.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
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
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing.md,
    fontSize: 16,
    color: colors.dark,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  unreadCard: {
    backgroundColor: colors.primary + '08',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: colors.gray[400],
  },
  unreadBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: spacing.sm,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.gray[600],
  },
  unreadMessage: {
    color: colors.dark,
    fontWeight: '600',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
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
    color: colors.dark,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  startButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
};
