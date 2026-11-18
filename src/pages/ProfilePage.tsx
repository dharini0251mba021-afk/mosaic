import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoryCard } from '../components/StoryCard';
import { EditProfileModal } from '../components/EditProfileModal';
import {
  MapPin,
  Calendar,
  PenSquare,
  Bookmark,
  FileText,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface ProfilePageProps {
  userId?: string;
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  onEditStory: (storyId: string) => void;
  onOpenDraft: (draftId: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  onNavigate,
  onEditStory,
  onOpenDraft,
  onOpenAuth
}) => {
  const {
    users,
    currentUser,
    stories,
    drafts,
    deleteDraft,
    deleteStory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'published' | 'saved' | 'drafts'>('published');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // If userId provided, view that profile; otherwise view current logged-in user
  const targetUser = userId
    ? users.find(u => u.id === userId) || currentUser
    : currentUser;

  if (!targetUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#F4EDFB] text-[#581C4E] flex items-center justify-center mx-auto border border-[#E9D5FF]">
          <PenSquare className="w-6 h-6" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900">Sign in to View Profile</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Log in or register an account to access your storyteller profile, view your private drafts, and track bookmarked articles.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onOpenAuth?.('signin')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === targetUser.id;
  const currentTabToRender = isOwner ? activeTab : 'published';

  // Filter stories published by this user
  const userPublishedStories = stories.filter(s => s.author.id === targetUser.id || s.authorId === targetUser.id);

  // Filter saved stories (bookmarks) - visible to owner
  const savedStories = stories.filter(s => targetUser.savedStoryIds?.includes(s.id));

  // User drafts - strictly visible only to owner
  const userDrafts = isOwner ? drafts.filter(d => d.userId === targetUser.id) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-10">
      {/* Profile Header Card */}
      <div className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 relative shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative">
            <img
              src={targetUser.avatar}
              alt={targetUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            {targetUser.id === 'user-dharini' && (
              <span
                className="absolute bottom-0 right-0 bg-[#581C4E] text-white p-1.5 rounded-full text-xs"
                title="Founder of Mosaic"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {targetUser.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-stone-500">
                  <span className="font-medium text-[#581C4E]">@{targetUser.username}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-700">{targetUser.role}</span>
                  {targetUser.isGoogleAccount && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Verified Google Account
                    </span>
                  )}
                </div>
              </div>

              {isOwner ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg hover:bg-stone-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Public Profile</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
              {targetUser.bio}
            </p>

            {/* Metadata (City, Joined, Stories count) */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#581C4E]" />
                {targetUser.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Joined {targetUser.joinedDate}
              </span>
              <span className="flex items-center gap-1 font-semibold text-stone-800">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                <span className="tabular-nums">{userPublishedStories.length}</span> Published Stories
              </span>
            </div>

            {/* Interests */}
            {targetUser.interests && targetUser.interests.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold mr-1">
                  Interests:
                </span>
                {targetUser.interests.map(interest => (
                  <span
                    key={interest}
                    className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-[#E7E2DA] pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'published'
              ? 'border-[#581C4E] text-[#581C4E] font-semibold'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Published Stories ({userPublishedStories.length})</span>
        </button>

        {isOwner && (
          <>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'saved'
                  ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Stories ({savedStories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('drafts')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'drafts'
                  ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Drafts ({userDrafts.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Tab 1: Published Stories */}
      {currentTabToRender === 'published' && (
        <div className="space-y-6">
          {userPublishedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {userPublishedStories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => onNavigate('story', story.id)}
                  onAuthorClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E7E2DA] rounded-2xl max-w-md mx-auto space-y-4">
              <PenSquare className="w-8 h-8 mx-auto text-stone-400" />
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                No Stories Published Yet
              </h3>
              <p className="text-xs text-stone-600">
                {isOwner
                  ? 'You haven’t published any stories yet. Share your experience or collegiate memory with the Mosaic community.'
                  : `${targetUser.name} hasn't published any stories yet.`}
              </p>
              {isOwner && (
                <button
                  onClick={() => onNavigate('write')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439]"
                >
                  Write Your First Story
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Stories (Bookmarks) */}
      {currentTabToRender === 'saved' && isOwner && (
        <div className="space-y-6">
          {savedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {savedStories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => onNavigate('story', story.id)}
                  onAuthorClick={authorId => onNavigate('profile', undefined, authorId)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E7E2DA] rounded-2xl max-w-md mx-auto space-y-4">
              <Bookmark className="w-8 h-8 mx-auto text-stone-400" />
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                No Saved Stories
              </h3>
              <p className="text-xs text-stone-600">
                Bookmark interesting stories while exploring to read them later in your saved collection.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50"
              >
                Explore Stories to Bookmark
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Drafts (Owner only) */}
      {currentTabToRender === 'drafts' && isOwner && (
        <div className="space-y-6">
          {userDrafts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userDrafts.map(draft => (
                <div
                  key={draft.id}
                  className="bg-white border border-[#E7E2DA] rounded-xl p-5 flex flex-col justify-between hover:border-[#581C4E]/40 transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[#581C4E]">
                        {draft.category}
                      </span>
                      <span>Last saved: {draft.lastSaved}</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
                      {draft.title || 'Untitled Draft'}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {draft.excerpt || 'No description provided...'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                    <button
                      onClick={() => onOpenDraft(draft.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] flex items-center gap-1.5"
                    >
                      <PenSquare className="w-3.5 h-3.5" />
                      <span>Continue Writing</span>
                    </button>

                    <button
                      onClick={() => setDraftToDelete(draft.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E7E2DA] rounded-2xl max-w-md mx-auto space-y-4">
              <FileText className="w-8 h-8 mx-auto text-stone-400" />
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                No Saved Drafts
              </h3>
              <p className="text-xs text-stone-600">
                Drafts you save while writing are synced privately to your Google account in Cloud Firestore.
              </p>
              <button
                onClick={() => onNavigate('write')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439]"
              >
                Start a New Draft
              </button>
            </div>
          )}
        </div>
      )}

      {/* Draft Delete Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 border border-[#E7E2DA] shadow-xl">
            <h3 className="font-editorial text-lg font-bold text-stone-900">Delete Draft?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to discard this unpublished draft?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDraftToDelete(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteDraft(draftToDelete);
                  setDraftToDelete(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
