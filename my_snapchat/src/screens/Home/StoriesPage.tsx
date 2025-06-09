import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface StoriesPageProps {
  user?: any;
}

const StoriesPage: React.FC<StoriesPageProps> = ({ user }) => {
  const gradientColors: readonly [string, string] = ['#764ba2', '#667eea'];
  
  const mockStories = [
    { id: '1', username: 'Ma Story', isOwn: true, hasNew: false },
    { id: '2', username: 'Alice M', hasNew: true, time: '3h' },
    { id: '3', username: 'Bob D', hasNew: true, time: '5h' },
    { id: '4', username: 'Charlie', hasNew: false, time: '1j' },
    { id: '5', username: 'Diana', hasNew: true, time: '2h' },
    { id: '6', username: 'Emma', hasNew: false, time: '6h' },
  ];

  const renderStoryItem = (story: any, index: number) => {
    const isOwn = story.isOwn;
    
    return (
      <Pressable key={story.id} style={styles.storyItem}>
        <View style={[
          styles.storyAvatar,
          story.hasNew && !isOwn && styles.storyAvatarNew,
          isOwn && styles.storyAvatarOwn
        ]}>
          {isOwn ? (
            <View style={styles.addStoryIcon}>
              <Ionicons name="add" size={20} color="#667eea" />
            </View>
          ) : (
            <Text style={styles.storyAvatarText}>
              {story.username.charAt(0)}
            </Text>
          )}
        </View>
        <Text style={styles.storyUsername}>
          {isOwn ? 'Ma Story' : story.username}
        </Text>
        {!isOwn && (
          <Text style={styles.storyTime}>{story.time}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Stories</Text>
            <View style={styles.headerRight}>
              <Pressable style={styles.headerButton}>
                <Ionicons name="search" size={20} color="#FFFFFF" />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Recent Updates Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mises à jour récentes</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalContent}
            >
              {mockStories.filter(s => s.hasNew).map((story, index) => (
                <Pressable key={story.id} style={styles.recentStoryItem}>
                  <View style={[styles.recentStoryAvatar, styles.storyAvatarNew]}>
                    <Text style={styles.storyAvatarText}>
                      {story.username.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.recentStoryName}>{story.username}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* All Stories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toutes les stories</Text>
            <ScrollView 
              style={styles.storiesList} 
              showsVerticalScrollIndicator={false}
            >
              {mockStories.map((story, index) => renderStoryItem(story, index))}
            </ScrollView>
          </View>

          {/* Discover Section */}
          <View style={styles.discoverSection}>
            <BlurView intensity={20} style={styles.discoverBlur}>
              <Ionicons name="compass" size={24} color="#FFFFFF" />
              <View style={styles.discoverTextContainer}>
                <Text style={styles.discoverTitle}>Découvrir</Text>
                <Text style={styles.discoverSubtitle}>
                  Trouvez de nouveaux amis et contenus
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
            </BlurView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sections
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  
  // Recent Stories (Horizontal)
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalContent: {
    paddingRight: 20,
  },
  recentStoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  recentStoryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentStoryName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // All Stories (Vertical)
  storiesList: {
    paddingHorizontal: 20,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  storyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarNew: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  storyAvatarOwn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  addStoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  storyUsername: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  storyTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  
  // Discover Section
  discoverSection: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  discoverBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: 15,
  },
  discoverTextContainer: {
    flex: 1,
  },
  discoverTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  discoverSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
});

export default StoriesPage;