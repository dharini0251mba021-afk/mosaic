import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Story, User, DraftStory, StoryCategory, VentureMetrics, BackendStatusInfo } from '../types';
import { INITIAL_STORIES, INITIAL_USERS, INITIAL_METRICS } from '../data/initialData';
import { getBackendStatus } from '../services/firebaseConfig';
import {
  firebaseAuthService,
  firebaseFirestoreService,
  firebaseStorageService,
  EngagementRecord
} from '../services/firebaseService';

interface AppContextType {
  stories: Story[];
  currentUser: User | null;
  authLoading: boolean;
  users: User[];
  drafts: DraftStory[];
  metrics: VentureMetrics;
  backendStatus: BackendStatusInfo;
  selectedCategory: StoryCategory | 'All';
  searchQuery: string;
  sortBy: 'newest' | 'popular' | 'quick_read';
  cityFilter: string;
  setSelectedCategory: (cat: StoryCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'newest' | 'popular' | 'quick_read') => void;
  setCityFilter: (city: string) => void;
  publishStory: (
    storyData: Omit<
      Story,
      'id' | 'publishedAt' | 'createdAt' | 'updatedAt' | 'likes' | 'bookmarks' | 'views' | 'author' | 'authorId' | 'status'
    >,
    draftIdToClear?: string
  ) => Promise<Story>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  saveDraft: (
    draftData: Omit<DraftStory, 'id' | 'userId' | 'lastSaved' | 'createdAt' | 'updatedAt'>,
    existingDraftId?: string
  ) => Promise<DraftStory>;
  deleteDraft: (draftId: string) => Promise<void>;
  toggleLike: (storyId: string) => Promise<void>;
  toggleBookmark: (storyId: string) => Promise<boolean>;
  recordView: (storyId: string) => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  uploadImage: (file: File, folder?: 'stories' | 'avatars') => Promise<{ url?: string; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backendStatus] = useState<BackendStatusInfo>(getBackendStatus());

  // Firestore-backed live collections + curated editorial showcase baseline
  const [firestoreStories, setFirestoreStories] = useState<Story[]>([]);
  const [firestoreUsers, setFirestoreUsers] = useState<User[]>([]);
  const [drafts, setDrafts] = useState<DraftStory[]>([]);
  const [userBookmarkIds, setUserBookmarkIds] = useState<string[]>([]);
  const [engagements, setEngagements] = useState<EngagementRecord[]>([]);
  const [localViewOffsets, setLocalViewOffsets] = useState<Record<string, number>>({});

  // Firebase Auth Session State
  const [authUserProfile, setAuthUserProfile] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(firebaseAuthService.isAvailable());

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'quick_read'>('newest');
  const [cityFilter, setCityFilter] = useState('All Cities');

  // 1. Public Real-Time Firestore Subscriptions (Stories, Creator Profiles, Engagements)
  useEffect(() => {
    if (!firebaseFirestoreService.isAvailable()) return;

    const unsubStories = firebaseFirestoreService.subscribePublishedStories(liveStories => {
      setFirestoreStories(liveStories);
    });

    const unsubUsers = firebaseFirestoreService.subscribePublicUsers(liveUsers => {
      setFirestoreUsers(liveUsers);
    });

    const unsubEngagements = firebaseFirestoreService.subscribeEngagements(liveEngagements => {
      setEngagements(liveEngagements);
    });

    return () => {
      unsubStories();
      unsubUsers();
      unsubEngagements();
    };
  }, []);

  // 2. Firebase Authentication State Listener (Persists across page reloads via Firebase Auth)
  useEffect(() => {
    if (!firebaseAuthService.isAvailable()) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = firebaseAuthService.onAuthStateChanged(async fbUser => {
      if (fbUser) {
        try {
          const profile = await firebaseAuthService.syncGoogleUserProfile(fbUser);
          setAuthUserProfile(profile);
        } catch (err) {
          console.error('Error syncing authenticated Google profile:', err);
        }
      } else {
        setAuthUserProfile(null);
        setDrafts([]);
        setUserBookmarkIds([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Authenticated User Private Subscriptions (Drafts & Bookmarks)
  useEffect(() => {
    const uid = authUserProfile?.id;
    if (!uid || !firebaseFirestoreService.isAvailable()) {
      setDrafts([]);
      setUserBookmarkIds([]);
      return;
    }

    const unsubDrafts = firebaseFirestoreService.subscribeUserDrafts(uid, liveDrafts => {
      setDrafts(liveDrafts);
    });

    const unsubBookmarks = firebaseFirestoreService.subscribeUserBookmarks(uid, bookmarkedStoryIds => {
      setUserBookmarkIds(bookmarkedStoryIds);
    });

    return () => {
      unsubDrafts();
      unsubBookmarks();
    };
  }, [authUserProfile?.id]);

  // Merge Firestore public users with curated editorial profiles
  const users = useMemo(() => {
    const userMap = new Map<string, User>();
    INITIAL_USERS.forEach(u => userMap.set(u.id, u));
    firestoreUsers.forEach(u => {
      const existing = userMap.get(u.id);
      userMap.set(u.id, existing ? { ...existing, ...u } : u);
    });
    if (authUserProfile) {
      const existing = userMap.get(authUserProfile.id);
      userMap.set(authUserProfile.id, existing ? { ...existing, ...authUserProfile } : authUserProfile);
    }
    return Array.from(userMap.values());
  }, [firestoreUsers, authUserProfile]);

  // Compute currentUser with live Firestore bookmarks & likes
  const currentUser = useMemo<User | null>(() => {
    if (!authUserProfile) return null;
    const liveProfile = users.find(u => u.id === authUserProfile.id) || authUserProfile;
    const likedIds = engagements
      .filter(e => e.userId === authUserProfile.id && e.type === 'like')
      .map(e => e.storyId);

    return {
      ...liveProfile,
      savedStoryIds: Array.from(new Set([...(liveProfile.savedStoryIds || []), ...userBookmarkIds])),
      likedStoryIds: Array.from(new Set([...(liveProfile.likedStoryIds || []), ...likedIds]))
    };
  }, [authUserProfile, users, userBookmarkIds, engagements]);

  // Merge Firestore live stories with curated editorial catalog & aggregate live engagement counts
  const stories = useMemo(() => {
    const storyMap = new Map<string, Story>();
    INITIAL_STORIES.forEach(s => storyMap.set(s.id, s));
    firestoreStories.forEach(s => storyMap.set(s.id, s));

    const likeCountsByStory = new Map<string, number>();
    engagements.forEach(e => {
      if (e.type === 'like') {
        likeCountsByStory.set(e.storyId, (likeCountsByStory.get(e.storyId) || 0) + 1);
      }
    });

    return Array.from(storyMap.values())
      .map(story => ({
        ...story,
        likes: story.likes + (likeCountsByStory.get(story.id) || 0),
        views: story.views + (localViewOffsets[story.id] || 0)
      }))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [firestoreStories, engagements, localViewOffsets]);

  // Dynamic Venture Metrics derived from live Firestore state
  const metrics = useMemo<VentureMetrics>(() => {
    const totalReads = stories.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalLikes = stories.reduce((sum, s) => sum + (s.likes || 0), 0);
    const totalBookmarks = stories.reduce((sum, s) => sum + (s.bookmarks || 0), 0);
    return {
      totalVisitors: INITIAL_METRICS.totalVisitors,
      registeredUsers: Math.max(INITIAL_METRICS.registeredUsers, users.length),
      activeUsers: Math.max(INITIAL_METRICS.activeUsers, users.length),
      storiesPublished: stories.length,
      totalReads,
      totalLikes,
      totalBookmarks
    };
  }, [stories, users.length]);

  // Actions
  const publishStory = async (
    storyData: Omit<
      Story,
      'id' | 'publishedAt' | 'createdAt' | 'updatedAt' | 'likes' | 'bookmarks' | 'views' | 'author' | 'authorId' | 'status'
    >,
    draftIdToClear?: string
  ): Promise<Story> => {
    if (!currentUser) {
      throw new Error('Authentication required: Please sign in with Google to publish a story.');
    }
    if (!firebaseFirestoreService.isAvailable()) {
      throw new Error('Cloud Firestore is not configured. Please check Firebase environment variables.');
    }

    const now = new Date().toISOString();
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        city: currentUser.city,
        role: currentUser.role
      },
      publishedAt: 'Just now',
      createdAt: now,
      updatedAt: now,
      likes: 0,
      bookmarks: 0,
      views: 1,
      status: 'published'
    };

    await firebaseFirestoreService.saveStory(newStory);

    // Optimistic state until snapshot arrives
    setFirestoreStories(prev => [newStory, ...prev.filter(s => s.id !== newStory.id)]);

    if (draftIdToClear) {
      await deleteDraft(draftIdToClear);
    }

    return newStory;
  };

  const updateStory = async (id: string, updates: Partial<Story>) => {
    const existingStory = stories.find(s => s.id === id);
    if (!existingStory) {
      throw new Error('Story not found');
    }

    if (!currentUser || currentUser.id !== existingStory.authorId) {
      throw new Error(`Permission Denied: Only the author (@${existingStory.author.username}) can edit this story.`);
    }

    const now = new Date().toISOString();
    await firebaseFirestoreService.updateStory(id, {
      ...updates,
      updatedAt: now
    });
  };

  const deleteStory = async (id: string) => {
    const existingStory = stories.find(s => s.id === id);
    if (!existingStory) return;

    if (!currentUser || currentUser.id !== existingStory.authorId) {
      throw new Error('Permission Denied: You do not have authorization to delete this story.');
    }

    await firebaseFirestoreService.deleteStory(id);
    setFirestoreStories(prev => prev.filter(s => s.id !== id));
  };

  const saveDraft = async (
    draftData: Omit<DraftStory, 'id' | 'userId' | 'lastSaved' | 'createdAt' | 'updatedAt'>,
    existingDraftId?: string
  ): Promise<DraftStory> => {
    if (!currentUser) {
      throw new Error('Authentication required: Sign in with Google to save private drafts.');
    }
    if (!firebaseFirestoreService.isAvailable()) {
      throw new Error('Cloud Firestore is not configured. Drafts require Firebase Cloud Firestore.');
    }

    const userId = currentUser.id;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isoString = now.toISOString();

    if (existingDraftId) {
      const existing = drafts.find(d => d.id === existingDraftId);
      if (existing && existing.userId !== userId) {
        throw new Error('Permission Denied: Cannot modify a draft belonging to another user.');
      }
    }

    const targetDraft: DraftStory = {
      ...draftData,
      id: existingDraftId || `draft-${Date.now()}`,
      userId,
      lastSaved: `Today at ${timeStr}`,
      createdAt: existingDraftId ? drafts.find(d => d.id === existingDraftId)?.createdAt || isoString : isoString,
      updatedAt: isoString
    };

    await firebaseFirestoreService.saveDraft(targetDraft);
    return targetDraft;
  };

  const deleteDraft = async (draftId: string) => {
    const existingDraft = drafts.find(d => d.id === draftId);
    if (existingDraft && currentUser && currentUser.id !== existingDraft.userId) {
      throw new Error('Permission Denied: Cannot delete another user’s draft.');
    }

    await firebaseFirestoreService.deleteDraft(draftId);
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  const toggleLike = async (storyId: string) => {
    if (!currentUser || !firebaseFirestoreService.isAvailable()) return;

    const isAlreadyLiked = currentUser.likedStoryIds.includes(storyId);
    await firebaseFirestoreService.setLikeEngagement(currentUser.id, storyId, !isAlreadyLiked);
  };

  const toggleBookmark = async (storyId: string): Promise<boolean> => {
    if (!currentUser || !firebaseFirestoreService.isAvailable()) return false;

    const isAlreadySaved = currentUser.savedStoryIds.includes(storyId);
    await firebaseFirestoreService.setBookmark(currentUser.id, storyId, !isAlreadySaved);
    return true;
  };

  const recordView = (storyId: string) => {
    setLocalViewOffsets(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1
    }));
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) {
      throw new Error('Authentication required to edit profile.');
    }
    if (!firebaseFirestoreService.isAvailable()) {
      throw new Error('Cloud Firestore is not configured.');
    }

    await firebaseFirestoreService.updateUserProfile(currentUser.id, updates);

    const updatedProfile: User = {
      ...currentUser,
      ...updates
    };
    setAuthUserProfile(updatedProfile);

    // Sync embedded author info on stories authored by this user in Firestore
    if (updates.name || updates.bio || updates.city || updates.avatar) {
      const authoredStories = firestoreStories.filter(s => s.authorId === currentUser.id);
      await Promise.all(
        authoredStories.map(story =>
          firebaseFirestoreService.updateStory(story.id, {
            author: {
              ...story.author,
              name: updates.name || story.author.name,
              bio: updates.bio || story.author.bio,
              city: updates.city || story.author.city,
              avatar: updates.avatar || story.author.avatar
            }
          })
        )
      );
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await firebaseAuthService.loginWithGoogle();
    if (res.success && res.user) {
      setAuthUserProfile(res.user);
    }
    return res;
  };

  const logout = async () => {
    await firebaseAuthService.logout();
    setAuthUserProfile(null);
    setDrafts([]);
    setUserBookmarkIds([]);
  };

  const uploadImage = async (
    file: File,
    folder: 'stories' | 'avatars' = 'stories'
  ): Promise<{ url?: string; error?: string }> => {
    return firebaseStorageService.uploadImage(file, folder, currentUser?.id);
  };

  return (
    <AppContext.Provider
      value={{
        stories,
        currentUser,
        authLoading,
        users,
        drafts,
        metrics,
        backendStatus,
        selectedCategory,
        searchQuery,
        sortBy,
        cityFilter,
        setSelectedCategory,
        setSearchQuery,
        setSortBy,
        setCityFilter,
        publishStory,
        updateStory,
        deleteStory,
        saveDraft,
        deleteDraft,
        toggleLike,
        toggleBookmark,
        recordView,
        updateUserProfile,
        loginWithGoogle,
        logout,
        uploadImage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
