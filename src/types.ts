export type StoryCategory =
  | 'Lifestyle'
  | 'Travel'
  | 'Culture'
  | 'Career & Growth'
  | 'Technology'
  | 'Business & Entrepreneurship'
  | 'Personal Stories'
  | 'Student Life';

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  city: string;
  role?: string;
}

export interface Story {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  category: StoryCategory;
  coverImage: string;
  author: Author;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  likes: number;
  bookmarks: number;
  views: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  city: string;
  tags: string[];
  status: 'published' | 'draft';
}

export interface User {
  id: string; // Firebase UID
  name: string; // Google displayName
  username: string;
  email: string; // Google email
  avatar: string; // Google photoURL or avatar
  bio: string;
  city: string;
  role: string;
  interests: StoryCategory[];
  joinedDate: string;
  savedStoryIds: string[];
  likedStoryIds: string[];
  isGoogleAccount?: boolean;
}

export interface DraftStory {
  id: string;
  userId: string;
  title: string;
  excerpt: string;
  content: string;
  category: StoryCategory;
  coverImage: string;
  city: string;
  lastSaved: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VentureMetrics {
  totalVisitors: number;
  registeredUsers: number;
  activeUsers: number;
  storiesPublished: number;
  totalReads: number;
  totalLikes: number;
  totalBookmarks: number;
}

export type BackendMode = 'firebase' | 'local_emulated';

export interface BackendStatusInfo {
  mode: BackendMode;
  isFirebaseConfigured: boolean;
  projectId?: string;
  databaseId?: string;
  authProvider: 'firebase-google-auth' | 'firebase-auth' | 'local-secure-auth';
  databaseProvider: 'cloud-firestore' | 'local-firestore-engine';
  storageProvider: 'cloud-storage' | 'local-media-pipeline';
  message: string;
}

