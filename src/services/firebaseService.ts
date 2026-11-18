import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { auth, db, storage, googleProvider, isConfigured } from './firebaseConfig';
import { Story, User, DraftStory } from '../types';

/**
 * Standard Firestore Error Handler specified by the Zero-Trust Firebase Integration standard.
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
}

export interface EngagementRecord {
  id: string;
  userId: string;
  storyId: string;
  type: 'like' | 'view';
  createdAt: string;
}

/**
 * Single Authentication Provider Service: Google Sign-In through Firebase Authentication
 */
export const firebaseAuthService = {
  isAvailable(): boolean {
    return isConfigured && auth !== null && googleProvider !== null;
  },

  getCurrentUser(): FirebaseUser | null {
    return auth?.currentUser || null;
  },

  /**
   * Primary Sign-In Method: Continue with Google
   */
  async loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!this.isAvailable() || !auth || !googleProvider) {
      return {
        success: false,
        error:
          'Firebase Google Authentication is not configured. Please add your VITE_FIREBASE_* environment variables and enable Google Sign-In in Firebase Console.'
      };
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fbUser = userCredential.user;

      const userProfile = await this.syncGoogleUserProfile(fbUser);
      return { success: true, user: userProfile };
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let message = err.message || 'Google Sign-In failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Google sign-in popup was closed before completion. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'The Google sign-in popup was blocked by your browser. Please allow popups for this domain.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Previous sign-in request was cancelled.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = `This domain (${window.location.hostname}) is not authorized in Firebase Authentication. Add it in Firebase Console → Authentication → Settings → Authorized domains.`;
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error connecting to Google Authentication. Please check your internet connection.';
      }
      return { success: false, error: message };
    }
  },

  /**
   * Sync Google Profile details to Cloud Firestore /users/{uid}
   */
  async syncGoogleUserProfile(fbUser: FirebaseUser): Promise<User> {
    const uid = fbUser.uid;
    const email = fbUser.email || '';
    const name = fbUser.displayName || 'Mosaic Storyteller';
    const avatar =
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
    const username = (email ? email.split('@')[0] : `author_${uid.slice(0, 6)}`)
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 30);

    if (db) {
      const path = `users/${uid}`;
      try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const existing = userSnap.data() as User;
          const updated: User = {
            ...existing,
            id: uid,
            name: existing.name || name,
            email: existing.email || email,
            avatar: existing.avatar || avatar,
            city: existing.city || 'India',
            savedStoryIds: Array.isArray(existing.savedStoryIds) ? existing.savedStoryIds : [],
            likedStoryIds: Array.isArray(existing.likedStoryIds) ? existing.likedStoryIds : [],
            isGoogleAccount: true
          };
          await updateDoc(userDocRef, {
            id: uid,
            name: updated.name,
            username: updated.username || username,
            city: updated.city,
            avatar: updated.avatar,
            updatedAt: new Date().toISOString()
          });
          return updated;
        }

        const now = new Date();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const joinedDate = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

        const newUser: User = {
          id: uid,
          name,
          username,
          email,
          avatar,
          bio: 'Storyteller on Mosaic sharing authentic reflections across India.',
          city: 'India',
          role: 'Storyteller',
          interests: ['Student Life', 'Culture', 'Personal Stories'],
          joinedDate,
          savedStoryIds: [],
          likedStoryIds: [],
          isGoogleAccount: true
        };

        await setDoc(userDocRef, {
          ...newUser,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        });

        return newUser;
      } catch (err) {
        console.warn(`Could not persist Google user to Firestore (${path}):`, err);
      }
    }

    return {
      id: uid,
      name,
      username,
      email,
      avatar,
      bio: 'Storyteller on Mosaic sharing authentic reflections across India.',
      city: 'India',
      role: 'Storyteller',
      interests: ['Student Life', 'Culture', 'Personal Stories'],
      joinedDate: 'October 2026',
      savedStoryIds: [],
      likedStoryIds: [],
      isGoogleAccount: true
    };
  },

  async logout(): Promise<void> {
    if (this.isAvailable() && auth) {
      await firebaseSignOut(auth);
    }
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    if (this.isAvailable() && auth) {
      return onAuthStateChanged(auth, callback);
    }
    return () => {};
  }
};

/**
 * Service for Cloud Firestore Operations (Primary Production Database)
 */
export const firebaseFirestoreService = {
  isAvailable(): boolean {
    return isConfigured && db !== null;
  },

  /**
   * Subscribe in real time to publicly published stories
   */
  subscribePublishedStories(onData: (stories: Story[]) => void): Unsubscribe {
    if (!this.isAvailable() || !db) return () => {};
    const path = 'stories';
    const storiesRef = collection(db, path);
    const q = query(storiesRef, where('status', '==', 'published'));
    return onSnapshot(
      q,
      snapshot => {
        const stories: Story[] = [];
        snapshot.forEach(docSnap => {
          stories.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        stories.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onData(stories);
      },
      error => {
        console.warn('Published stories listener error:', error.message);
      }
    );
  },

  /**
   * Subscribe in real time to public user profiles
   */
  subscribePublicUsers(onData: (users: User[]) => void): Unsubscribe {
    if (!this.isAvailable() || !db) return () => {};
    const path = 'users';
    return onSnapshot(
      collection(db, path),
      snapshot => {
        const users: User[] = [];
        snapshot.forEach(docSnap => {
          users.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onData(users);
      },
      error => {
        console.warn('Users listener error:', error.message);
      }
    );
  },

  /**
   * Subscribe in real time to authenticated user's private drafts
   */
  subscribeUserDrafts(userId: string, onData: (drafts: DraftStory[]) => void): Unsubscribe {
    if (!this.isAvailable() || !db || !userId) return () => {};
    const path = 'drafts';
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      snapshot => {
        const drafts: DraftStory[] = [];
        snapshot.forEach(docSnap => {
          drafts.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        drafts.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        onData(drafts);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  /**
   * Subscribe in real time to authenticated user's private bookmarks
   */
  subscribeUserBookmarks(userId: string, onData: (storyIds: string[]) => void): Unsubscribe {
    if (!this.isAvailable() || !db || !userId) return () => {};
    const path = 'bookmarks';
    const q = query(collection(db, path), where('userId', '==', userId));
    return onSnapshot(
      q,
      snapshot => {
        const storyIds: string[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as BookmarkRecord;
          if (data.storyId) storyIds.push(data.storyId);
        });
        onData(storyIds);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  /**
   * Subscribe in real time to public story engagements (likes)
   */
  subscribeEngagements(onData: (records: EngagementRecord[]) => void): Unsubscribe {
    if (!this.isAvailable() || !db) return () => {};
    const path = 'engagements';
    return onSnapshot(
      collection(db, path),
      snapshot => {
        const records: EngagementRecord[] = [];
        snapshot.forEach(docSnap => {
          records.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onData(records);
      },
      error => {
        console.warn('Engagements listener error:', error.message);
      }
    );
  },

  /**
   * Fetch all publicly published stories from Firestore
   */
  async fetchPublishedStories(): Promise<Story[] | null> {
    if (!this.isAvailable() || !db) return null;
    const path = 'stories';
    try {
      const storiesRef = collection(db, path);
      const q = query(storiesRef, where('status', '==', 'published'));
      const snapshot = await getDocs(q);
      const stories: Story[] = [];
      snapshot.forEach(docSnap => {
        stories.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      stories.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      return stories;
    } catch (err: any) {
      console.warn('Could not fetch published stories from live Firestore:', err?.message);
      return null;
    }
  },

  /**
   * Save a newly published story to Firestore
   */
  async saveStory(story: Story): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `stories/${story.id}`;
    try {
      await setDoc(doc(db, 'stories', story.id), story);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  /**
   * Update an existing story in Firestore
   */
  async updateStory(storyId: string, updates: Partial<Story>): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `stories/${storyId}`;
    try {
      await updateDoc(doc(db, 'stories', storyId), updates);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  /**
   * Delete a story from Firestore
   */
  async deleteStory(storyId: string): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `stories/${storyId}`;
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  /**
   * Save a private draft to Firestore
   */
  async saveDraft(draft: DraftStory): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `drafts/${draft.id}`;
    try {
      await setDoc(doc(db, 'drafts', draft.id), draft);
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  /**
   * Delete a draft from Firestore
   */
  async deleteDraft(draftId: string): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `drafts/${draftId}`;
    try {
      await deleteDoc(doc(db, 'drafts', draftId));
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  /**
   * Persist bookmark record in /bookmarks/{userId}_{storyId}
   */
  async setBookmark(userId: string, storyId: string, bookmarked: boolean): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const bookmarkId = `${userId}_${storyId}`;
    const path = `bookmarks/${bookmarkId}`;
    try {
      if (bookmarked) {
        await setDoc(doc(db, 'bookmarks', bookmarkId), {
          id: bookmarkId,
          userId,
          storyId,
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      }
      return true;
    } catch (err) {
      handleFirestoreError(err, bookmarked ? OperationType.CREATE : OperationType.DELETE, path);
    }
  },

  /**
   * Persist like engagement in /engagements/{userId}_like_{storyId}
   */
  async setLikeEngagement(userId: string, storyId: string, liked: boolean): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const engagementId = `${userId}_like_${storyId}`;
    const path = `engagements/${engagementId}`;
    try {
      if (liked) {
        await setDoc(doc(db, 'engagements', engagementId), {
          id: engagementId,
          userId,
          storyId,
          type: 'like',
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(doc(db, 'engagements', engagementId));
      }
      return true;
    } catch (err) {
      handleFirestoreError(err, liked ? OperationType.CREATE : OperationType.DELETE, path);
    }
  },

  /**
   * Update a user profile in Firestore
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        id: userId,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
};

/**
 * Service for Firebase Cloud Storage Operations
 */
export const firebaseStorageService = {
  isAvailable(): boolean {
    return isConfigured && storage !== null;
  },

  async uploadImage(
    file: File,
    folder: 'stories' | 'avatars' = 'stories',
    userId?: string
  ): Promise<{ url?: string; error?: string }> {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(file.type)) {
      return { error: 'Invalid file format. Please upload JPG, PNG, WebP, or GIF images.' };
    }

    const MAX_SIZE = folder === 'avatars' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: `File size exceeds the ${folder === 'avatars' ? '2MB' : '5MB'} limit. Please compress your image.` };
    }

    if (!auth?.currentUser) {
      return { error: 'Please sign in with Google before uploading images.' };
    }

    if (this.isAvailable() && storage) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
        const ownerId = userId || auth.currentUser.uid;
        // Match storage.rules paths: /stories/{fileName} and /avatars/{userId}/{fileName}
        const storagePath = folder === 'avatars' ? `avatars/${ownerId}/${fileName}` : `stories/${fileName}`;
        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, file, {
          contentType: file.type
        });
        const url = await getDownloadURL(snapshot.ref);
        return { url };
      } catch (err: any) {
        console.error('Firebase Storage upload failed:', err);
        return {
          error:
            err?.code === 'storage/unauthorized'
              ? 'Permission denied uploading image. Ensure Firebase Storage rules are deployed and you are signed in.'
              : 'Could not upload image to Firebase Cloud Storage. You can also paste an image URL directly.'
        };
      }
    }

    return {
      error: 'Firebase Cloud Storage is not configured. Add your VITE_FIREBASE_* environment variables or paste an image URL.'
    };
  }
};
