import { create } from 'zustand';
import { Snap } from '../types';

interface SnapState {
  receivedSnaps: Snap[];
  sentSnaps: Snap[];
  isLoading: boolean;
  
  // Actions
  addReceivedSnap: (snap: Snap) => void;
  addSentSnap: (snap: Snap) => void;
  markSnapAsViewed: (snapId: string) => void;
  removeSnap: (snapId: string) => void;
  loadMockSnaps: () => void;
}

// Mock data para desarrollo
const createMockSnap = (id: string, from: string, duration: number): Snap => ({
  id,
  from,
  to: 'current_user',
  image: `https://picsum.photos/400/700?random=${id}`,
  duration,
  createdAt: new Date().toISOString(),
  viewed: false,
});

export const useSnapStore = create<SnapState>((set, get) => ({
  receivedSnaps: [],
  sentSnaps: [],
  isLoading: false,

  addReceivedSnap: (snap: Snap) => {
    set((state) => ({
      receivedSnaps: [snap, ...state.receivedSnaps],
    }));
  },

  addSentSnap: (snap: Snap) => {
    set((state) => ({
      sentSnaps: [snap, ...state.sentSnaps],
    }));
  },

  markSnapAsViewed: (snapId: string) => {
    set((state) => ({
      receivedSnaps: state.receivedSnaps.map(snap =>
        snap.id === snapId
          ? { ...snap, viewed: true, viewedAt: new Date().toISOString() }
          : snap
      ),
    }));
  },

  removeSnap: (snapId: string) => {
    set((state) => ({
      receivedSnaps: state.receivedSnaps.filter(snap => snap.id !== snapId),
      sentSnaps: state.sentSnaps.filter(snap => snap.id !== snapId),
    }));
  },

  loadMockSnaps: () => {
    const mockSnaps: Snap[] = [
      createMockSnap('1', 'alice', 3),
      createMockSnap('2', 'bob', 5),
      createMockSnap('3', 'charlie', 2),
    ];

    set({
      receivedSnaps: mockSnaps,
      isLoading: false,
    });
  },
}));