import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../../App';
import { ApiService } from '../../../services/ApiService';
import SnapModal from './SnapModal';

const { width, height } = Dimensions.get('window');

interface ChatPageComponentProps {
  user: any;
  onLogout: () => void;
  colors: any;
}

interface Snap {
  id: string;
  from: string;
  to: string;
  image: string;
  duration: number;
  createdAt: string;
  seen: boolean;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ChatPageComponent: React.FC<ChatPageComponentProps> = ({ user, onLogout, colors }) => {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // Cargar snaps al inicio
  useEffect(() => {
    loadSnaps();
  }, []);

  const loadSnaps = async () => {
    try {
      console.log('📬 Chargement des snaps (API + Mock)...');
      
      // Cargar snaps reales de la API
      let realSnaps: Snap[] = [];
      try {
        const response = await ApiService.getSnaps();
        if (response.success && response.data && Array.isArray(response.data)) {
          realSnaps = response.data;
          console.log('📬 Snaps API:', realSnaps.length);
        }
      } catch (error) {
        console.log('⚠️ API snaps failed, usando solo mock');
      }
      
      // Cargar snaps mock (enviados)
      let mockSnaps: Snap[] = [];
      try {
        const stored = await AsyncStorage.getItem('mockSnaps');
        if (stored) {
          mockSnaps = JSON.parse(stored);
          console.log('📬 Snaps Mock:', mockSnaps.length);
        }
      } catch (error) {
        console.log('⚠️ Mock snaps failed');
      }
      
      // Combinar y mostrar todos
      const allSnaps = [...realSnaps, ...mockSnaps];
      console.log('📬 Total snaps:', allSnaps.length);
      setSnaps(allSnaps);
      
    } catch (error) {
      console.error('❌ Error general loading snaps:', error);
      setSnaps([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSnaps();
  };

  const handleSnapPress = (snap: Snap) => {
    console.log('📸 Ouverture du snap de:', snap.from);
    setSelectedSnap(snap);
    setModalVisible(true);
  };

  const formatTimeAgo = (dateString: string): string => {
    try {
      const now = new Date();
      const snapDate = new Date(dateString);
      const diffMs = now.getTime() - snapDate.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'maintenant';
      if (diffMins < 60) return `${diffMins}min`;
      if (diffHours < 24) return `${diffHours}h`;
      return `${diffDays}j`;
    } catch (error) {
      return 'récent';
    }
  };

  // Filtrer les snaps selon la recherche
  const filteredSnaps = snaps.filter(snap =>
    snap.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSnap = (snap: Snap, index: number) => (
    <Pressable 
      key={snap.id || index} 
      style={styles.snapItem}
      onPress={() => handleSnapPress(snap)}
    >
      <View style={[
        styles.snapAvatar, 
        { backgroundColor: snap.seen ? colors.surface : colors.accent }
      ]}>
        <Text style={[styles.snapAvatarText, { color: colors.text }]}>
          {snap.from?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>
      
      <View style={styles.snapInfo}>
        <View style={styles.snapHeader}>
          <Text style={[styles.snapName, { 
            color: snap.seen ? colors.textSecondary : colors.text,
            fontWeight: snap.seen ? '500' : '700'
          }]}>
            {snap.from || 'Utilisateur inconnu'}
          </Text>
          <Text style={[styles.snapTime, { color: colors.textSecondary }]}>
            {formatTimeAgo(snap.createdAt)}
          </Text>
        </View>
        
        <View style={styles.snapDetails}>
          <Ionicons 
            name="camera" 
            size={14} 
            color={colors.textSecondary} 
            style={styles.snapIcon}
          />
          <Text style={[styles.snapMessage, { color: colors.textSecondary }]}>
            📸 Snap • {snap.duration}s
          </Text>
        </View>
      </View>
      
      {!snap.seen && (
        <View style={[styles.unreadIndicator, { backgroundColor: colors.accent }]} />
      )}
      
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colors.textSecondary} 
      />
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="camera-outline" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun snap reçu
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Demandez à vos amis de vous envoyer des snaps !
      </Text>
      
      {/* Bouton pour tester */}
      <Pressable 
        style={[styles.testButton, { backgroundColor: colors.accent }]}
        onPress={loadSnaps}
      >
        <Ionicons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.testButtonText}>Actualiser</Text>
      </Pressable>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        Chargement des snaps...
      </Text>
    </View>
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSnap(null);
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.pageContent}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.profilePic, { backgroundColor: colors.accent }]}>
              <Text style={[styles.profileText, { color: colors.text }]}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Snaps ({filteredSnaps.length})
            </Text>
          </View>
          <Pressable style={styles.headerButton} onPress={onLogout}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher un expéditeur"
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        >
          {isLoading ? (
            renderLoadingState()
          ) : filteredSnaps.length === 0 ? (
            renderEmptyState()
          ) : (
            filteredSnaps.map(renderSnap)
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Modal pour voir les snaps */}
      <SnapModal
        visible={modalVisible}
        snap={selectedSnap}
        onClose={handleCloseModal}
      />
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  snapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  snapAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  snapInfo: {
    flex: 1,
  },
  snapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  snapName: {
    fontSize: 15,
    fontWeight: '600',
  },
  snapTime: {
    fontSize: 12,
  },
  snapDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapIcon: {
    marginRight: 4,
  },
  snapMessage: {
    fontSize: 13,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default ChatPageComponent;