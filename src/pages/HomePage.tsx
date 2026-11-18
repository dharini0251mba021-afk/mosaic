import React from 'react';
import { useApp } from '../context/AppContext';
import { StoryCard } from '../components/StoryCard';
import { CATEGORIES } from '../data/initialData';
import { StoryCategory } from '../types';
import { ArrowRight, Compass, PenSquare, Sparkles, MapPin, BookOpen, Users, Award } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  onOpenPitch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenPitch }) => {
  const { stories, users, setSelectedCategory } = useApp();

  const featuredStory = stories.find(s => s.isFeatured) || stories[0];
  const trendingStories = stories.slice(0, 6);

  const handleCategoryClick = (cat: StoryCategory) => {
    setSelectedCategory(cat);
    onNavigate('explore');
  };

  const getStoryCountForCategory = (cat: StoryCategory) => {
    return stories.filter(s => s.category === cat).length;
  };

  const getStoryCountForAuthor = (authorId: string) => {
    return stories.filter(s => s.author.id === authorId).length;
  };

  return (
    <div className="space-y-20 pb-16">
      {/* A. Hero Section */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Kicker & Pitch Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E7E2DA]">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold uppercase tracking-wider text-[#581C4E]">
                A Digital Storytelling Platform
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-serif italic">Every Voice Adds a New Perspective</span>
            </div>
            <button
              onClick={onOpenPitch}
              className="inline-flex items-center gap-1.5 text-xs text-[#581C4E] hover:text-[#431439] font-medium"
            >
              <Award className="w-3.5 h-3.5" />
              <span>DBS Global University Venture Plan • Inspect MVP Stats</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Hero Typography & Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.08] text-balance">
                Every Story Has a Place Here.
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Discover meaningful stories, explore new perspectives, and share the experiences that make you who you are.
                Bridging collegiate voices, regional narratives, and emerging writers across India.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] transition-all shadow-xs flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Stories</span>
                </button>
                <button
                  onClick={() => onNavigate('write')}
                  className="px-6 py-3 text-sm font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-md hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center gap-2"
                >
                  <PenSquare className="w-4 h-4 text-[#581C4E]" />
                  <span>Share Your Story</span>
                </button>
              </div>

              {/* Founder Mini Trust Note */}
              <div className="pt-4 flex items-center gap-3">
                <img
                  src={users[0].avatar}
                  alt="Dharini Singh"
                  className="w-9 h-9 rounded-full object-cover border border-[#E7E2DA]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-stone-900 block">Dharini Singh</span>
                  <span className="text-stone-500">Founder of Mosaic · Dehradun & Delhi NCR</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-6">
              <div
                onClick={() => onNavigate('story', featuredStory.id)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden border border-[#E7E2DA] shadow-xs bg-stone-100 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]"
              >
                <img
                  src={featuredStory.coverImage}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-2 text-xs text-stone-300 mb-2">
                    <span className="uppercase tracking-widest font-semibold text-[#E9D5FF]">
                      Lead Story · {featuredStory.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredStory.readTimeMinutes} min read</span>
                  </div>
                  <h2 className="font-editorial text-xl sm:text-2xl font-bold leading-snug line-clamp-2 mb-2 group-hover:text-[#E9D5FF] transition-colors">
                    {featuredStory.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 max-w-lg mb-3">
                    {featuredStory.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-stone-300">
                    <span>By {featuredStory.author.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredStory.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Trending Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#E7E2DA]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
              Curated Perspectives
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
              Trending Stories Across India
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#581C4E] hover:underline flex items-center gap-1"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trendingStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onNavigate('story', story.id)}
              onAuthorClick={authorId => onNavigate('profile', undefined, authorId)}
            />
          ))}
        </div>
      </section>

      {/* C. Explore by Category */}
      <section className="bg-white py-16 border-y border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
              Organized Discovery
            </span>
            <h2 className="font-editorial text-3xl font-bold text-stone-900 mb-3">
              Explore Stories by Interest
            </h2>
            <p className="text-sm text-stone-600">
              From university life and student grit to Himalayan trails, urban heritage, and startup journeys.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(category => {
              const count = getStoryCountForCategory(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="group p-5 text-left bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl hover:border-[#581C4E] hover:bg-white transition-all duration-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 group-hover:text-[#581C4E] transition-colors block mb-1">
                      Category
                    </span>
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#581C4E] transition-colors">
                      {category}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E7E2DA]/60 flex items-center justify-between text-xs text-stone-500">
                    <span className="tabular-nums">{count} stories</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#581C4E]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* D. Featured Voices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#E7E2DA]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
              Community Writers
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Storytellers
            </h2>
          </div>
          <span className="text-xs text-stone-500">Connecting college writers and early professionals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.slice(0, 4).map(user => {
            const count = getStoryCountForAuthor(user.id);
            return (
              <div
                key={user.id}
                onClick={() => onNavigate('profile', undefined, user.id)}
                className="group cursor-pointer p-6 bg-white border border-[#E7E2DA] rounded-xl hover:border-[#581C4E]/50 transition-all shadow-2xs flex flex-col justify-between text-center"
              >
                <div>
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                    />
                    {user.id === 'user-dharini' && (
                      <span className="absolute bottom-0 right-0 bg-[#581C4E] text-white p-1 rounded-full text-[10px]" title="Founder">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 group-hover:text-[#581C4E] transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-xs text-[#581C4E] font-medium mb-1">@{user.username}</p>
                  <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{user.city}</span>
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {user.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-stone-500">
                  <span className="tabular-nums font-medium text-stone-800">{count} published stories</span>
                  <span className="text-[#581C4E] group-hover:underline">View Profile</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* E. Why Mosaic? (Venture Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-stone-100 border border-[#E7E2DA] rounded-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
              Our Core Mission
            </span>
            <h2 className="font-editorial text-3xl font-bold text-stone-900">
              Why Mosaic?
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Unlike fragmented social feeds where writing disappears in seconds, Mosaic is purpose-built for discoverable storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-[#E7E2DA] rounded-xl shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4EDFB] text-[#581C4E] flex items-center justify-center font-editorial font-bold text-lg">
                1
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Discover Diverse Voices
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Explore real stories, lived experiences, and distinct regional perspectives from university students, young professionals, and creative writers across India.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E7E2DA] rounded-xl shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4EDFB] text-[#581C4E] flex items-center justify-center font-editorial font-bold text-lg">
                2
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Share Your Story
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Publish your ideas and reflections in a clean, distraction-free environment. Organize your work by category and build your personal writing presence.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E7E2DA] rounded-xl shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4EDFB] text-[#581C4E] flex items-center justify-center font-editorial font-bold text-lg">
                3
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Find Your Community
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect through honest stories about campus challenges, career transitions, creative experiments, and everyday Indian life with readers who genuinely care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. Community CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#581C4E] text-white p-8 sm:p-14 overflow-hidden text-center shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#E9D5FF] font-semibold">
              Join the Movement
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Your Perspective Deserves to Be Heard.
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-lg mx-auto">
              Join a growing community of readers and storytellers across India. Free to publish, discover, and read.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('write')}
                className="px-6 py-3 text-sm font-semibold text-[#581C4E] bg-white rounded-md hover:bg-stone-100 transition-colors shadow-sm"
              >
                Start Your Story
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3 text-sm font-semibold text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
              >
                Browse Stories
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
