import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ChatPageComponentProps {
  user: any;
  onLogout: () => void;
  colors: any;
}

const ChatPageComponent: React.FC<ChatPageComponentProps> = ({ user, onLogout, colors }) => {
  const mockChats = [
    { name: 'Alice Martin', message: 'Salut! Comment ça va? 👋', time: '2min', unread: 2 },
    { name: 'Bob Dupont', message: 'Tu as vu mon dernier snap?', time: '1h', unread: 0 },
    { name: 'Charlie Bernard', message: '📸 Photo', time: '3h', unread: 1 },
    { name: 'Diana Rodriguez', message: 'Merci beaucoup!', time: '5h', unread: 0 },
    { name: 'Emma Laurent', message: 'À bientôt! 😊', time: '1j', unread: 0 },
  ];

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.pageContent}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.profilePic, { backgroundColor: colors.accent }]}>
              <Text style={[styles.profileText, { color: colors.text }]}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
          </View>
          <Pressable style={styles.headerButton} onPress={onLogout}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {mockChats.map((chat, index) => (
            <Pressable key={index} style={styles.chatItem}>
              <View style={[styles.chatAvatar, { backgroundColor: colors.surface }]}>
                <Text style={[styles.chatAvatarText, { color: colors.text }]}>
                  {chat.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.chatName, { color: colors.text }]}>
                    {chat.name}
                  </Text>
                  <Text style={[styles.chatTime, { color: colors.textSecondary }]}>
                    {chat.time}
                  </Text>
                </View>
                <Text 
                  style={[styles.chatMessage, { color: colors.textSecondary }]} 
                  numberOfLines={1}
                >
                  {chat.message}
                </Text>
              </View>
              {chat.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.unreadText, { color: colors.text }]}>
                    {chat.unread}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: width,
    height: height,
  },
  pageContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  chatAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  chatMessage: {
    fontSize: 13,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatPageComponent;