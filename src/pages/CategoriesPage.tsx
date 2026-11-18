import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import { StoryCategory } from '../types';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
}

const CATEGORY_DESCRIPTIONS: Record<StoryCategory, { desc: string; sampleThemes: string; accent: string }> = {
  'Student Life': {
    desc: 'Campus lessons beyond textbooks, hostel kitchen dialogues, student initiatives, and finding direction amidst collegiate pressure.',
    sampleThemes: 'Exams, Campus Grit, Hostel Life, Extracurriculars',
    accent: '#581C4E'
  },
  'Travel': {
    desc: 'Slow journeys across Indian landscapes—from misty Himalayan trails in Dehradun to the carved pols of Ahmedabad and sleeper train conversations.',
    sampleThemes: 'Solo Travel, Railways, Hidden Heritage, Nature Respite',
    accent: '#0D9488'
  },
  'Culture': {
    desc: 'Modern Indian identities, regional traditions, literature, language, and the vibrant intersections of heritage and contemporary youth culture.',
    sampleThemes: 'Festivals, Urban Subcultures, Writing Voice, Folk Craft',
    accent: '#B45309'
  },
  'Career & Growth': {
    desc: 'Navigating early career transitions, overcoming corporate imposter syndrome, mentorship, and building sustainable work-life alignment.',
    sampleThemes: 'First 90 Days, Tech Hubs, Workplace Generational Shifts',
    accent: '#2563EB'
  },
  'Technology': {
    desc: 'How grassroots digital platforms like UPI, WhatsApp commerce, and open protocols are reshaping everyday Indian commerce and creativity.',
    sampleThemes: 'Digital India, Grassroots Fintech, Open Source, Creator Tools',
    accent: '#7C3AED'
  },
  'Business & Entrepreneurship': {
    desc: 'Candid founder journeys, bootstrapping without venture capital, café boardrooms, customer empathy, and lessons in early venture validation.',
    sampleThemes: 'Bootstrapping, First Clients, Small Ventures, Coffee Shop Founders',
    accent: '#059669'
  },
  'Personal Stories': {
    desc: 'Vulnerable, honest reflections on self-doubt, ambition, family dynamics, mental well-being, and growing up in modern India.',
    sampleThemes: 'Well-being, Overcoming Burnout, Moving Cities, Family Bonds',
    accent: '#E11D48'
  },
  'Lifestyle': {
    desc: 'Mindful living, slow weekends in historical quarters, wellness rituals, design, and carving out intentional rest in bustling metropolitan cities.',
    sampleThemes: 'Slow Living, Hauz Khas Sundays, Chai Rituals, Reading Nooks',
    accent: '#D97706'
  }
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const { stories, setSelectedCategory } = useApp();

  const handleSelect = (category: StoryCategory) => {
    setSelectedCategory(category);
    onNavigate('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E2DA] pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#581C4E] block mb-1">
          Topic Taxonomy
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Story Categories & Themes
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl">
          Browse stories organized by domain. Every category is curated with firsthand Indian perspectives,
          essays, and reflections.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map(category => {
          const info = CATEGORY_DESCRIPTIONS[category];
          const matchingStories = stories.filter(s => s.category === category);
          const topStory = matchingStories[0];

          return (
            <div
              key={category}
              className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#581C4E]/40 hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#581C4E]">
                    {category}
                  </span>
                  <span className="text-xs font-medium text-stone-500 tabular-nums">
                    {matchingStories.length} published {matchingStories.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>

                <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                  {category}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  {info.desc}
                </p>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA] text-xs text-stone-500 mb-6">
                  <strong className="text-stone-700">Key Themes:</strong> {info.sampleThemes}
                </div>

                {topStory && (
                  <div className="pt-2 mb-6 border-t border-[#F0ECE4]">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">
                      Featured in this category:
                    </span>
                    <button
                      onClick={() => onNavigate('story', topStory.id)}
                      className="text-left font-editorial text-sm font-semibold text-stone-800 hover:text-[#581C4E] transition-colors line-clamp-1"
                    >
                      "{topStory.title}"
                    </button>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      by {topStory.author.name} · {topStory.city}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                <button
                  onClick={() => handleSelect(category)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#581C4E] hover:text-[#431439] group"
                >
                  <span>Explore All {matchingStories.length} Stories</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    onNavigate('write');
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-800"
                >
                  Write in this category →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
