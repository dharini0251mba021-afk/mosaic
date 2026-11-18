import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { WritePage } from './pages/WritePage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { VentureModal } from './components/VentureModal';
import { CommunityGuidelinesModal } from './components/CommunityGuidelinesModal';
import { AuthModal } from './components/AuthModal';
import { Sparkles, ArrowRight, UserCheck, LogIn } from 'lucide-react';

type AppTab = 'home' | 'explore' | 'categories' | 'write' | 'story' | 'profile';

interface RouteState {
  tab: AppTab;
  storyId: string | null;
  profileUserId?: string;
}

function parsePathToRoute(pathname: string): RouteState {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '') {
    return { tab: 'home', storyId: null };
  }
  if (clean === '/explore') {
    return { tab: 'explore', storyId: null };
  }
  if (clean === '/categories') {
    return { tab: 'categories', storyId: null };
  }
  if (clean === '/write') {
    return { tab: 'write', storyId: null };
  }
  if (clean.startsWith('/story/')) {
    const id = decodeURIComponent(clean.slice('/story/'.length));
    if (id) return { tab: 'story', storyId: id };
  }
  if (clean === '/profile') {
    return { tab: 'profile', storyId: null };
  }
  if (clean.startsWith('/profile/')) {
    const uid = decodeURIComponent(clean.slice('/profile/'.length));
    return { tab: 'profile', storyId: null, profileUserId: uid || undefined };
  }
  return { tab: 'home', storyId: null };
}

function buildPathFromRoute(tab: AppTab, storyId?: string | null, profileUserId?: string): string {
  switch (tab) {
    case 'explore':
      return '/explore';
    case 'categories':
      return '/categories';
    case 'write':
      return '/write';
    case 'story':
      return storyId ? `/story/${encodeURIComponent(storyId)}` : '/explore';
    case 'profile':
      return profileUserId ? `/profile/${encodeURIComponent(profileUserId)}` : '/profile';
    case 'home':
    default:
      return '/';
  }
}

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  const initialRoute = parsePathToRoute(window.location.pathname);

  // Navigation State (synced with browser history for Vercel SPA routing)
  const [currentTab, setCurrentTab] = useState<AppTab>(initialRoute.tab);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(initialRoute.storyId);
  const [activeProfileUserId, setActiveProfileUserId] = useState<string | undefined>(initialRoute.profileUserId);
  const [editingStoryId, setEditingStoryId] = useState<string | undefined>(undefined);
  const [initialDraftId, setInitialDraftId] = useState<string | undefined>(undefined);

  // Modals
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      const next = parsePathToRoute(window.location.pathname);
      setCurrentTab(next.tab);
      setActiveStoryId(next.storyId);
      setActiveProfileUserId(next.profileUserId);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const syncHistory = useCallback((tab: AppTab, storyId?: string | null, profileUserId?: string) => {
    const nextPath = buildPathFromRoute(tab, storyId, profileUserId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  }, []);

  // Handle internal & URL navigation
  const handleNavigate = (tab: string, storyId?: string, profileUserId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (storyId) {
      setActiveStoryId(storyId);
      setCurrentTab('story');
      syncHistory('story', storyId);
      return;
    }

    if (profileUserId) {
      setActiveProfileUserId(profileUserId);
      setCurrentTab('profile');
      syncHistory('profile', null, profileUserId);
      return;
    }

    const nextTab = (tab as AppTab) || 'home';
    let nextProfileId: string | undefined = undefined;

    if (nextTab === 'profile') {
      nextProfileId = currentUser?.id;
      setActiveProfileUserId(nextProfileId);
    } else {
      setActiveProfileUserId(undefined);
    }

    if (nextTab === 'write') {
      setEditingStoryId(undefined);
      setInitialDraftId(undefined);
    }

    setActiveStoryId(null);
    setCurrentTab(nextTab);
    syncHistory(nextTab, null, nextProfileId);
  };

  const handleEditStory = (storyId: string) => {
    setEditingStoryId(storyId);
    setInitialDraftId(undefined);
    setCurrentTab('write');
    syncHistory('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDraft = (draftId: string) => {
    setInitialDraftId(draftId);
    setEditingStoryId(undefined);
    setCurrentTab('write');
    syncHistory('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#231F20] selection:bg-[#E9D5FF] selection:text-[#3B0764]">
      {/* Top Founder & Venture Ribbon */}
      <div className="bg-[#581C4E] text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#E9D5FF] uppercase tracking-wider text-[10px]">
              DGU Venture Quest MVP
            </span>
            <span aria-hidden="true" className="text-white/40">|</span>
            <span className="truncate">
              Mosaic by Dharini Singh • "Every Voice Adds a New Perspective"
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsPitchOpen(true)}
              className="text-[#E9D5FF] hover:text-white underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Inspect Venture Plan & Architecture</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
            <span className="hidden md:inline text-white/40">|</span>
            {currentUser ? (
              <button
                onClick={() => handleNavigate('profile', undefined, currentUser.id)}
                className="hidden md:flex items-center gap-1 text-stone-200 hover:text-white"
              >
                <UserCheck className="w-3 h-3 text-[#E9D5FF]" />
                <span>Signed in: {currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="hidden md:flex items-center gap-1 text-[#E9D5FF] hover:text-white font-medium"
              >
                <LogIn className="w-3 h-3" />
                <span>Continue with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenPitch={() => setIsPitchOpen(true)}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'write' && (
          <WritePage
            onNavigate={handleNavigate}
            editingStoryId={editingStoryId}
            initialDraftId={initialDraftId}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'story' && activeStoryId && (
          <StoryDetailPage
            storyId={activeStoryId}
            onNavigate={handleNavigate}
            onEditStory={handleEditStory}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            userId={activeProfileUserId}
            onNavigate={handleNavigate}
            onEditStory={handleEditStory}
            onOpenDraft={handleOpenDraft}
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

      {/* Modals */}
      <VentureModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      <CommunityGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
