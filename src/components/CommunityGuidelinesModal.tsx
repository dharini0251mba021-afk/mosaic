import React from 'react';
import { X, ShieldCheck, Heart, BookOpen, Lock } from 'lucide-react';

interface CommunityGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityGuidelinesModal: React.FC<CommunityGuidelinesModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 bg-[#581C4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E9D5FF]" />
            <h2 className="font-editorial text-xl font-bold">Community Guidelines & Standards</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#581C4E]" />
              <span>1. Authenticity & Personal Voice</span>
            </h3>
            <p className="text-xs text-stone-600">
              Mosaic is created to elevate real lived experiences across India. We encourage honesty, reflection,
              and genuine perspectives over clickbait or copy-pasted content.
            </p>
          </div>

          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#581C4E]" />
              <span>2. Respect for Diversity & Nuance</span>
            </h3>
            <p className="text-xs text-stone-600">
              Our community includes writers and readers from different cultures, cities, linguistic backgrounds,
              and life stages. Harassment, hate speech, or derogatory generalizations have zero tolerance on Mosaic.
            </p>
          </div>

          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#581C4E]" />
              <span>3. Original Content & Plagiarism Ban</span>
            </h3>
            <p className="text-xs text-stone-600">
              Publish only content you wrote yourself or have explicit authorization to share. Attribute quotes,
              references, and photography generously.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
            <h3 className="font-editorial text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-600" />
              <span>Privacy & Cloud Security Notice</span>
            </h3>
            <p className="text-xs text-stone-500">
              Mosaic authenticates contributors via Google Sign-In and stores published stories, private drafts, and bookmarks securely in Google Cloud Firestore protected by Attribute-Based Access Control (ABAC) rules. No personal data is sold to third-party advertisers.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-stone-100 border-t border-[#E7E2DA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
