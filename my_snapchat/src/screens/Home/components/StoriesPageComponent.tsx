import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface StoriesPageComponentProps 
{
  onTakePhoto: () => void;
  colors: any;
}

const StoriesPageComponent: React.FC<StoriesPageComponentProps> = ({ onTakePhoto, colors }) => {
  const mockStories = [
    { 
      name: 'Ludivine', 
      time: '2h', 
      viewed: false,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Anouar Khali', 
      time: '4h', 
      viewed: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Test Anouar', 
      time: '1j', 
      viewed: false,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    { 
      name: 'Arnaud Pantufla', 
      time: '2j', 
      viewed: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
  ];

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.pageContent}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Stories</Text>
          <Pressable style={styles.headerButton}>
            <Ionicons name="person-add" size={20} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Ma Story */}
          <View style={styles.storySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ma Story</Text>
            <Pressable style={styles.storyItem} onPress={onTakePhoto}>
              <View style={[
                styles.storyAvatar, 
                styles.myStoryAvatar,
                { backgroundColor: colors.surface, borderColor: colors.accent }
              ]}>
                <Ionicons name="add" size={24} color={colors.accent} />
              </View>
              <View style={styles.storyInfo}>
                <Text style={[styles.storyName, { color: colors.text }]}>
                  Ajouter à ma story
                </Text>
                <Text style={[styles.storyAction, { color: colors.textSecondary }]}>
                  Partage un moment avec tes amis
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Stories des amis */}
          <View style={styles.storySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Amis</Text>
            {mockStories.map((story, index) => (
              <Pressable key={index} style={styles.storyItem}>
                <View style={[
                  styles.storyAvatar,
                  { backgroundColor: colors.surface },
                  !story.viewed && [styles.storyAvatarNew, { borderColor: colors.success }]
                ]}>
                  {story.image ? (
                    <Image 
                      source={{ uri: story.image }} 
                      style={styles.storyAvatarImage}
                    />
                  ) : (
                    <Text style={[styles.storyAvatarText, { color: colors.text }]}>
                      {story.name.charAt(0)}
                    </Text>
                  )}
                </View>
                <View style={styles.storyInfo}>
                  <Text style={[
                    styles.storyName, 
                    { color: story.viewed ? colors.textSecondary : colors.text }
                  ]}>
                    {story.name}
                  </Text>
                  <Text style={[styles.storyTime, { color: colors.textSecondary }]}>
                    {story.time}
                  </Text>
                </View>
                {!story.viewed && (
                  <View style={[styles.newIndicator, { backgroundColor: colors.success }]} />
                )}
              </Pressable>
            ))}
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  storySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  storyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myStoryAvatar: {
    borderWidth: 1,
  },
  storyAvatarNew: {
    borderWidth: 2,
  },
  storyAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  storyAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  storyInfo: {
    flex: 1,
  },
  storyName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  storyAction: {
    fontSize: 12,
  },
  storyTime: {
    fontSize: 12,
  },
  newIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default StoriesPageComponent;