import React from 'react';
import { Sparkles, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  onOpenPitch: () => void;
  onOpenGuidelines: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPitch,
  onOpenGuidelines
}) => {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#E7E2DA] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E7E2DA]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#581C4E] flex items-center justify-center text-white">
                <span className="font-serif text-base font-bold">M</span>
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#231F20]">
                MOSAIC
              </span>
            </div>
            <p className="font-serif italic text-sm text-stone-600">
              "Every Voice Adds a New Perspective."
            </p>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              A digital storytelling and blogging platform bringing together diverse voices, experiences, and
              perspectives from across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#581C4E]" />
              <span>Incubated in Dehradun • Hubs in Delhi, Mumbai, Bengaluru</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#581C4E] transition-colors"
                >
                  Explore All Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#581C4E] transition-colors"
                >
                  Browse by Category
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('write')}
                  className="hover:text-[#581C4E] transition-colors"
                >
                  Write & Publish a Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#581C4E] transition-colors"
                >
                  Creator Profiles & Drafts
                </button>
              </li>
            </ul>
          </div>

          {/* Venture Quest & Guidelines */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Entrepreneurship & Innovation
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Venture Quest MVP Project by Dharini Singh, DBS Global University (MBA Class of 2026).
            </p>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenPitch}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#581C4E] bg-[#F4EDFB] border border-[#E9D5FF] rounded-md hover:bg-[#ebdcf8] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Venture Quest Pitch</span>
              </button>
              <button
                onClick={onOpenGuidelines}
                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50 transition-colors"
              >
                Community Guidelines
              </button>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>dharini.0251mba021@dgu.ac.in</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Mosaic by Dharini Singh. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenGuidelines}
              className="hover:text-stone-800 transition-colors"
            >
              Community Standards
            </button>
            <button
              onClick={onOpenGuidelines}
              className="hover:text-stone-800 transition-colors"
            >
              Privacy Notice
            </button>
            <span>v1.0 MVP Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
