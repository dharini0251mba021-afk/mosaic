import React, { useState } from 'react';
import { Story } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Bookmark, Eye, MapPin } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
  onAuthorClick?: (authorId: string) => void;
  variant?: 'featured' | 'standard' | 'compact';
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onClick,
  onAuthorClick,
  variant = 'standard'
}) => {
  const { currentUser, toggleLike, toggleBookmark } = useApp();
  const [imageError, setImageError] = useState(false);

  const isLiked = currentUser?.likedStoryIds.includes(story.id) ?? false;
  const isBookmarked = currentUser?.savedStoryIds.includes(story.id) ?? false;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(story.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(story.id);
  };

  const handleAuthor = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAuthorClick) {
      onAuthorClick(story.author.id);
    }
  };

  // Compact layout for sidebars or secondary lists
  if (variant === 'compact') {
    return (
      <article
        onClick={onClick}
        className="group cursor-pointer py-3.5 border-b border-[#E7E2DA] last:border-b-0 hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <span className="font-medium text-[#581C4E]">{story.category}</span>
          <span aria-hidden="true">·</span>
          <span>{story.readTimeMinutes} min read</span>
        </div>
        <h4 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-[#581C4E] transition-colors leading-snug line-clamp-2">
          {story.title}
        </h4>
        <div className="mt-1.5 flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={handleAuthor}
            className="hover:text-stone-800 transition-colors text-left truncate"
          >
            {story.author.name}
          </button>
          <span>{story.publishedAt}</span>
        </div>
      </article>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <article
        onClick={onClick}
        className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#E7E2DA] rounded-xl overflow-hidden hover:border-[#581C4E]/40 transition-all duration-300 shadow-xs"
      >
        <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] bg-stone-100 overflow-hidden">
          {!imageError ? (
            <img
              src={story.coverImage}
              alt={story.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-8 text-center">
              <span className="font-editorial text-4xl text-[#581C4E]/30 mb-2">MOSAIC</span>
              <span className="text-xs uppercase tracking-widest text-stone-400">{story.category}</span>
            </div>
          )}
          {story.city && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-stone-700 flex items-center gap-1 shadow-xs">
              <MapPin className="w-3 h-3 text-[#581C4E]" />
              <span>{story.city}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
              <span className="font-semibold tracking-wide uppercase text-[#581C4E]">{story.category}</span>
              <span aria-hidden="true">·</span>
              <span>{story.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span>{story.readTimeMinutes} min read</span>
            </div>

            <h3 className="font-editorial text-2xl lg:text-3xl font-bold text-stone-900 group-hover:text-[#581C4E] transition-colors leading-tight mb-3">
              {story.title}
            </h3>

            <p className="text-stone-600 text-sm lg:text-base leading-relaxed line-clamp-3 mb-6">
              {story.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
            <button
              onClick={handleAuthor}
              className="flex items-center gap-3 text-left group/author"
            >
              <img
                src={story.author.avatar}
                alt={story.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E7E2DA]"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900 group-hover/author:text-[#581C4E] transition-colors leading-tight">
                  {story.author.name}
                </p>
                <p className="text-xs text-stone-500 truncate max-w-[140px]">
                  {story.author.role || story.author.city}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-3 text-stone-500 text-xs">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 p-1.5 rounded hover:bg-stone-100 transition-colors ${
                  isLiked ? 'text-rose-600 font-semibold' : ''
                }`}
                title="Like story"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span className="tabular-nums">{story.likes}</span>
              </button>
              <button
                onClick={handleBookmark}
                className={`p-1.5 rounded hover:bg-stone-100 transition-colors ${
                  isBookmarked ? 'text-[#581C4E]' : ''
                }`}
                title="Save story"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#581C4E] text-[#581C4E]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white border border-[#E7E2DA] rounded-xl overflow-hidden hover:border-[#581C4E]/40 hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
          {!imageError ? (
            <img
              src={story.coverImage}
              alt={story.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-4 text-center">
              <span className="font-editorial text-2xl text-[#581C4E]/30">MOSAIC</span>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 mt-1">{story.category}</span>
            </div>
          )}
          {story.city && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium text-stone-700 flex items-center gap-1 shadow-2xs">
              <MapPin className="w-2.5 h-2.5 text-[#581C4E]" />
              <span>{story.city}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[#581C4E]">{story.category}</span>
            <span aria-hidden="true">·</span>
            <span>{story.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{story.readTimeMinutes} min</span>
          </div>

          <h3 className="font-editorial text-lg font-bold text-stone-900 group-hover:text-[#581C4E] transition-colors leading-snug line-clamp-2 mb-2">
            {story.title}
          </h3>

          <p className="text-stone-600 text-xs leading-relaxed line-clamp-2 mb-4">
            {story.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
        <button
          onClick={handleAuthor}
          className="flex items-center gap-2.5 text-left group/author"
        >
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-7 h-7 rounded-full object-cover border border-[#E7E2DA]"
          />
          <span className="text-xs font-medium text-stone-800 group-hover/author:text-[#581C4E] transition-colors truncate max-w-[120px]">
            {story.author.name}
          </span>
        </button>

        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 p-1 rounded hover:bg-stone-100 transition-colors ${
              isLiked ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span className="tabular-nums text-[11px]">{story.likes}</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`p-1 rounded hover:bg-stone-100 transition-colors ${
              isBookmarked ? 'text-[#581C4E]' : ''
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#581C4E] text-[#581C4E]' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};
