import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoryCard } from '../components/StoryCard';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  MapPin,
  Check,
  Edit3,
  Trash2,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface StoryDetailPageProps {
  storyId: string;
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  onEditStory: (storyId: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const StoryDetailPage: React.FC<StoryDetailPageProps> = ({
  storyId,
  onNavigate,
  onEditStory,
  onOpenAuth
}) => {
  const {
    stories,
    currentUser,
    toggleLike,
    toggleBookmark,
    recordView,
    deleteStory
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const story = stories.find(s => s.id === storyId);

  useEffect(() => {
    if (story) {
      recordView(story.id);
      setImageError(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [storyId]);

  if (!story) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-stone-900">Story Not Found</h2>
        <p className="text-sm text-stone-600">The story you are looking for may have been removed or does not exist.</p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isLiked = currentUser?.likedStoryIds.includes(story.id) ?? false;
  const isBookmarked = currentUser?.savedStoryIds.includes(story.id) ?? false;
  const isOwner = Boolean(currentUser) && (currentUser?.id === story.author.id || currentUser?.id === story.authorId);

  // Related stories in same category
  const relatedStories = stories
    .filter(s => s.id !== story.id && s.category === story.category)
    .slice(0, 3);

  const handleShare = async () => {
    const url = `${window.location.origin}/story/${encodeURIComponent(story.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${story.title} - Mosaic by Dharini Singh`,
          text: story.excerpt,
          url
        });
        return;
      } catch (e) {
        // Fallback to copy link
      }
    }
    // Copy link fallback
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDelete = async () => {
    await deleteStory(story.id);
    onNavigate('explore');
  };

  // Content split by paragraphs
  const paragraphs = story.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="pt-6 pb-24">
      {/* Top back navigation bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('explore')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#581C4E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore Stories</span>
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditStory(story.id)}
              className="px-3 py-1 text-xs font-medium text-[#581C4E] bg-[#F4EDFB] border border-[#E9D5FF] rounded-md hover:bg-[#ecd8fa] transition-colors flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit My Story</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 border border-[#E7E2DA] shadow-xl">
            <h3 className="font-editorial text-lg font-bold text-stone-900">Delete Story?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to delete "{story.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Metadata */}
        <div className="space-y-4 mb-8">
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-wider text-[#581C4E]">
              {story.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {story.publishedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {story.readTimeMinutes} min read
            </span>
            {story.city && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {story.city}
                </span>
              </>
            )}
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.12] tracking-tight text-balance">
            {story.title}
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-stone-600 leading-relaxed pt-1">
            {story.excerpt}
          </p>

          {/* Author Block */}
          <div className="pt-4 pb-2 border-y border-[#E7E2DA] flex items-center justify-between">
            <button
              onClick={() => onNavigate('profile', undefined, story.author.id)}
              className="flex items-center gap-3 text-left group"
            >
              <img
                src={story.author.avatar}
                alt={story.author.name}
                className="w-11 h-11 rounded-full object-cover border border-[#E7E2DA] group-hover:ring-2 group-hover:ring-[#581C4E] transition-all"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900 group-hover:text-[#581C4E] transition-colors">
                    {story.author.name}
                  </span>
                  {story.author.id === 'user-dharini' && (
                    <span className="text-[10px] uppercase font-bold text-[#581C4E] bg-[#F4EDFB] px-1.5 py-0.2 rounded">
                      Founder
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {story.author.bio || story.author.role}
                </p>
              </div>
            </button>

            {/* Interaction Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth?.('signin');
                    return;
                  }
                  toggleLike(story.id);
                }}
                className={`p-2 rounded-full border transition-all ${
                  isLiked
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-[#E7E2DA] bg-white text-stone-600 hover:bg-stone-50'
                }`}
                title={!currentUser ? 'Sign in to like stories' : isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
              </button>
              <span className="text-xs text-stone-600 tabular-nums font-medium mr-1">
                {story.likes}
              </span>

              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth?.('signin');
                    return;
                  }
                  toggleBookmark(story.id);
                }}
                className={`p-2 rounded-full border transition-all ${
                  isBookmarked
                    ? 'border-purple-300 bg-purple-50 text-[#581C4E]'
                    : 'border-[#E7E2DA] bg-white text-stone-600 hover:bg-stone-50'
                }`}
                title={!currentUser ? 'Sign in to bookmark stories' : isBookmarked ? 'Saved' : 'Save Story'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#581C4E]' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-[#E7E2DA] bg-white text-stone-600 hover:bg-stone-50 transition-all relative"
                title="Share Story"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-[#E7E2DA] bg-stone-100 aspect-[16/10]">
          {!imageError ? (
            <img
              src={story.coverImage}
              alt={story.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-8 text-center">
              <span className="font-editorial text-4xl text-[#581C4E]/20">MOSAIC</span>
              <span className="text-xs uppercase tracking-widest text-stone-400 mt-2">{story.category}</span>
            </div>
          )}
        </div>

        {/* Story Prose Body with Editorial Styling */}
        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-[1.8] text-base sm:text-lg">
          {paragraphs.map((p, idx) => {
            // First paragraph gets elegant drop cap
            if (idx === 0) {
              return (
                <p
                  key={idx}
                  className="first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#581C4E]"
                >
                  {p}
                </p>
              );
            }
            // Paragraph 2 gets a subtle pull quote format if length permits
            if (idx === 2 && paragraphs.length > 3) {
              return (
                <React.Fragment key={idx}>
                  <p>{p}</p>
                  <blockquote className="my-8 py-4 px-6 border-y border-[#E7E2DA] bg-[#FAF8F5] text-stone-900 font-editorial italic text-lg sm:text-xl leading-relaxed text-center">
                    "{story.excerpt}"
                  </blockquote>
                </React.Fragment>
              );
            }
            return <p key={idx}>{p}</p>;
          })}
        </div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#E7E2DA] flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold mr-1">
              Topics:
            </span>
            {story.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-stone-600 bg-white border border-[#E7E2DA] px-2.5 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Feedback Toast */}
        {copiedLink && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Story link copied to clipboard!</span>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 bg-white border border-[#E7E2DA] rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h4 className="font-editorial text-lg font-bold text-stone-900">
                Written by {story.author.name}
              </h4>
              <span className="text-xs text-[#581C4E] font-medium">@{story.author.username}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              {story.author.bio}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('profile', undefined, story.author.id)}
                className="text-xs font-semibold text-[#581C4E] hover:underline"
              >
                View all stories by {story.author.name} →
              </button>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E7E2DA]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#581C4E] font-semibold block mb-0.5">
                  More in {story.category}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  Related Stories
                </h3>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs text-[#581C4E] hover:underline"
              >
                Explore all →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStories.map(rel => (
                <StoryCard
                  key={rel.id}
                  story={rel}
                  onClick={() => onNavigate('story', rel.id)}
                  onAuthorClick={authorId => onNavigate('profile', undefined, authorId)}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
