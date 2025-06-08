import { create } from 'zustand';

export interface Story {
  id: string;
  userId: string;
  username: string;
  image: string;
  createdAt: string;
  expiresAt: string; // 24 horas después
  viewed: boolean;
  viewedAt?: string;
}

export interface UserStories {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesState {
  allStories: UserStories[];
  myStories: Story[];
  isLoading: boolean;
  
  // Actions
  addMyStory: (image: string) => void;
  markStoryAsViewed: (storyId: string, userId: string) => void;
  loadMockStories: () => void;
  getActiveStories: () => UserStories[];
}

// Función para crear mock stories
const createMockStory = (id: string, userId: string, username: string, hoursAgo: number = 0): Story => {
  const createdAt = new Date();
  createdAt.setHours(createdAt.getHours() - hoursAgo);
  
  const expiresAt = new Date(createdAt);
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  return {
    id,
    userId,
    username,
    image: `https://picsum.photos/400/700?random=${id}`,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    viewed: false,
  };
};

export const useStoriesStore = create<StoriesState>((set, get) => ({
  allStories: [],
  myStories: [],
  isLoading: false,

  addMyStory: (image: string) => {
    const newStory = createMockStory(
      Date.now().toString(),
      'current_user',
      'Tú',
      0
    );
    newStory.image = image;

    set((state) => ({
      myStories: [newStory, ...state.myStories],
    }));
  },

  markStoryAsViewed: (storyId: string, userId: string) => {
    set((state) => ({
      allStories: state.allStories.map(userStories =>
        userStories.userId === userId
          ? {
              ...userStories,
              stories: userStories.stories.map(story =>
                story.id === storyId
                  ? { ...story, viewed: true, viewedAt: new Date().toISOString() }
                  : story
              ),
              hasUnviewed: userStories.stories.some(s => 
                s.id !== storyId && !s.viewed
              ),
            }
          : userStories
      ),
    }));
  },

  loadMockStories: () => {
    const mockStories: UserStories[] = [
      {
        userId: 'alice',
        username: 'alice',
        avatar: 'A',
        hasUnviewed: true,
        stories: [
          createMockStory('s1', 'alice', 'alice', 2),
          createMockStory('s2', 'alice', 'alice', 1),
        ],
      },
      {
        userId: 'bob',
        username: 'bob',
        avatar: 'B',
        hasUnviewed: true,
        stories: [
          createMockStory('s3', 'bob', 'bob', 3),
        ],
      },
      {
        userId: 'charlie',
        username: 'charlie',
        avatar: 'C',
        hasUnviewed: false,
        stories: [
          createMockStory('s4', 'charlie', 'charlie', 5),
        ],
      },
    ];

    // Marcar algunas como vistas
    mockStories[2].stories[0].viewed = true;

    set({
      allStories: mockStories,
      isLoading: false,
    });
  },

  getActiveStories: () => {
    const now = new Date();
    return get().allStories
      .map(userStories => ({
        ...userStories,
        stories: userStories.stories.filter(story => 
          new Date(story.expiresAt) > now
        ),
      }))
      .filter(userStories => userStories.stories.length > 0);
  },
}));