import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StoryCard } from '../components/StoryCard';
import { CATEGORIES, CITIES } from '../data/initialData';
import { StoryCategory } from '../types';
import { Search, RotateCcw, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

interface ExplorePageProps {
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const {
    stories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    cityFilter,
    setCityFilter
  } = useApp();

  // Filter & Search Logic
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && story.category !== selectedCategory) {
        return false;
      }

      // 2. City Filter
      if (cityFilter !== 'All Cities' && story.city !== cityFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = story.title.toLowerCase().includes(q);
        const excerptMatch = story.excerpt.toLowerCase().includes(q);
        const authorMatch = story.author.name.toLowerCase().includes(q);
        const tagMatch = story.tags.some(t => t.toLowerCase().includes(q));
        const cityMatch = story.city.toLowerCase().includes(q);
        return titleMatch || excerptMatch || authorMatch || tagMatch || cityMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes + b.views) - (a.likes + a.views);
      }
      if (sortBy === 'quick_read') {
        return a.readTimeMinutes - b.readTimeMinutes;
      }
      // default: newest
      const getStoryTimestamp = (s: typeof a) => {
        if (s.publishedAt === 'Just now') return Date.now();
        const parsed = new Date(s.publishedAt).getTime();
        if (!isNaN(parsed)) return parsed;
        const tsMatch = s.id.match(/^story-(\d+)$/);
        if (tsMatch) return parseInt(tsMatch[1], 10);
        return 0;
      };
      return getStoryTimestamp(b) - getStoryTimestamp(a);
    });
  }, [stories, selectedCategory, cityFilter, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setCityFilter('All Cities');
    setSearchQuery('');
    setSortBy('newest');
  };

  const isFiltering =
    selectedCategory !== 'All' ||
    cityFilter !== 'All Cities' ||
    searchQuery.trim().length > 0 ||
    sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E7E2DA] pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
          Discovery Hub
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Explore Stories & Voices
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl">
          Dive into original writing from students, professionals, and creators across Indian cities. Filter by
          topic, city, or search for specific reflections.
        </p>
      </div>

      {/* Search and Main Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by story title, author, keyword, or city..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E] shadow-2xs text-stone-700"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c === 'All Cities' ? 'All Locations (India)' : `City: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E] shadow-2xs text-stone-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="quick_read">Sort: Quickest Read</option>
            </select>
          </div>
        </div>

        {/* Category Buttons Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === 'All'
                ? 'bg-[#581C4E] text-white shadow-xs'
                : 'bg-white border border-[#E7E2DA] text-stone-700 hover:bg-stone-50'
            }`}
          >
            All Stories ({stories.length})
          </button>
          {CATEGORIES.map(category => {
            const count = stories.filter(s => s.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#581C4E] text-white shadow-xs'
                    : 'bg-white border border-[#E7E2DA] text-stone-700 hover:bg-stone-50'
                }`}
              >
                {category} <span className="opacity-75 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Bar & Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-600 pt-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-stone-900 tabular-nums">{filteredStories.length}</strong> stories
          </span>
          {isFiltering && (
            <span className="text-stone-400">· Active filters applied</span>
          )}
        </div>

        {isFiltering && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-[#581C4E] hover:underline font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Story Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onNavigate('story', story.id)}
              onAuthorClick={authorId => onNavigate('profile', undefined, authorId)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white border border-[#E7E2DA] rounded-2xl max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F4EDFB] text-[#581C4E] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-stone-900">
            No Stories Matched Your Search
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            We couldn't find any articles matching your search query or selected category filter. Try clearing your
            filters or be the first to publish a story on this topic!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onNavigate('write')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439]"
            >
              Write This Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
