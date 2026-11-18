import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, Target, TrendingUp, Users, BookOpen, Layers, CheckCircle2, DollarSign, Database, ShieldCheck, Server } from 'lucide-react';

interface VentureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VentureModal: React.FC<VentureModalProps> = ({ isOpen, onClose }) => {
  const { metrics, stories, users, backendStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'plan' | 'metrics' | 'model' | 'backend'>('plan');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 bg-[#581C4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#E9D5FF] font-medium">
                  DBS Global University • DGU Venture Quest
                </span>
              </div>
              <h2 className="font-editorial text-xl font-bold text-white">
                Mosaic by Dharini Singh — Venture Plan & MVP Pitch
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-[#E7E2DA]">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'plan'
                ? 'bg-[#581C4E] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Venture Overview & Strategy
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'metrics'
                ? 'bg-[#581C4E] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Live MVP Validation Metrics
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'model'
                ? 'bg-[#581C4E] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Revenue Model & Unit Economics
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'backend'
                ? 'bg-[#581C4E] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backend & Cloud Architecture</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {/* Founder Tag */}
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-base text-[#231F20]">Dharini Singh</p>
                  <p className="text-xs text-stone-500">
                    MBA Student (Entrepreneurship & Innovation) · dharini.0251mba021@dgu.ac.in
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-serif italic text-[#581C4E]">
                    "Every Voice Adds a New Perspective"
                  </span>
                </div>
              </div>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <h3 className="font-editorial text-base font-bold text-rose-950 mb-2">
                    The Problem (Friction F-1)
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Valuable stories, perspectives, and nuanced Indian experiences are scattered across fragmented
                    social platforms (Instagram, LinkedIn, personal blogs) where content is short-lived, difficult to
                    discover later, and buried beneath algorithm-driven short videos. Emerging creators struggle to
                    find an audience that genuinely cares.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <h3 className="font-editorial text-base font-bold text-emerald-950 mb-2">
                    The Solution (Mosaic MVP)
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    A dedicated digital storytelling and blogging platform that brings together diverse voices across
                    India into an organized, topic-based community. Readers discover authentic long-form reflections,
                    and writers build a recognizable voice with friction-free publishing and clean editorial presentation.
                  </p>
                </div>
              </div>

              {/* Beachhead Segment & Geography */}
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                <h4 className="font-editorial text-sm font-bold text-stone-900 mb-2">
                  Beachhead Customer & Geography
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-900">Primary Segment:</span> Indian college students
                    and early-career professionals aged 18–25 who actively consume or create personal, lifestyle,
                    career, and culture-based content.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Launch Tier-1 & Hub Cities:</span> Delhi NCR,
                    Mumbai, Bengaluru, Hyderabad, Pune, Ahmedabad, and university communities in Dehradun.
                  </div>
                </div>
              </div>

              {/* Competitive Positioning */}
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                <h4 className="font-editorial text-sm font-bold text-stone-900 mb-2">
                  Competitive Positioning (Mission 5 & 6)
                </h4>
                <div className="space-y-2 text-xs text-stone-600">
                  <p>
                    <strong className="text-stone-900">vs Medium:</strong> Established global platform where new Indian
                    creators get lost and lacks specific Indian cultural context or affordable student pricing.
                  </p>
                  <p>
                    <strong className="text-stone-900">vs Substack:</strong> Newsletter-centric model requires an
                    existing audience for distribution; Mosaic offers organic interest-based cross-discovery.
                  </p>
                  <p>
                    <strong className="text-stone-900">vs Instagram:</strong> Visual feed-driven algorithm reduces
                    meaningful writing to ephemeral captions and fleeting reels.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <h3 className="font-editorial text-base font-bold text-[#581C4E] mb-1">
                  30-Day Venture Quest Validation Targets
                </h3>
                <p className="text-xs text-purple-900">
                  These metrics reflect the active prototype data stored in your session. Publish new stories or
                  interact with existing articles to see the live counters adjust!
                </p>
              </div>

              {/* Validation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Target 1: Early Sign-ups</span>
                    <Target className="w-4 h-4 text-[#581C4E]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif tabular-nums text-stone-900">
                      {users.length}
                    </span>
                    <span className="text-xs text-stone-500">/ 50 Goal</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#581C4E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (users.length / 50) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2">
                    {users.length >= 50 ? '✓ Goal reached!' : `${50 - users.length} sign-ups to target`}
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Target 2: Active Users</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif tabular-nums text-stone-900">
                      {metrics.activeUsers}
                    </span>
                    <span className="text-xs text-stone-500">/ 20 Goal</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (metrics.activeUsers / 20) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-2">
                    ✓ Validation achieved ({metrics.activeUsers} active)
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Target 3: Original Stories</span>
                    <BookOpen className="w-4 h-4 text-[#581C4E]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif tabular-nums text-stone-900">
                      {stories.length}
                    </span>
                    <span className="text-xs text-stone-500">/ 15 Goal</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#581C4E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stories.length / 15) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#581C4E] font-medium mt-2">
                    ✓ 15-story milestone unlocked
                  </p>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                  Live Engagement Activity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xl font-bold text-stone-900 tabular-nums">{metrics.totalReads}</p>
                    <p className="text-[11px] text-stone-500">Total Story Reads</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xl font-bold text-rose-600 tabular-nums">{metrics.totalLikes}</p>
                    <p className="text-[11px] text-stone-500">Story Likes</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xl font-bold text-[#581C4E] tabular-nums">{metrics.totalBookmarks}</p>
                    <p className="text-[11px] text-stone-500">Story Bookmarks</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xl font-bold text-stone-900 tabular-nums">{metrics.totalVisitors}</p>
                    <p className="text-[11px] text-stone-500">Prototype Impressions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="space-y-6">
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-editorial text-base font-bold text-stone-900">
                    Mission 7 — Revenue & Unit Economics (Venture Plan)
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Mosaic operates on a <strong>Freemium + Paid</strong> model designed around Indian students and
                  young professionals. General reading and publishing is 100% free. A future premium tier is priced
                  at <strong>₹99/month</strong> for creator distribution tools and curated editorial spotlights.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[11px] text-stone-500">Selling Price</span>
                    <p className="text-lg font-bold text-stone-900">₹99 / month</p>
                    <span className="text-[10px] text-stone-500">Affordable student tier</span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[11px] text-stone-500">Variable Cost</span>
                    <p className="text-lg font-bold text-stone-900">₹10 / user</p>
                    <span className="text-[10px] text-stone-500">Hosting & payment gateway</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-[11px] text-emerald-800">Contribution Margin</span>
                    <p className="text-lg font-bold text-emerald-900">₹89 (89.9%)</p>
                    <span className="text-[10px] text-emerald-700">Healthy software unit margins</span>
                  </div>
                </div>
              </div>

              {/* Scenarios */}
              <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
                <h4 className="font-editorial text-sm font-bold text-stone-900 mb-3">
                  Validated Growth Scenarios
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 font-medium">
                        <th className="pb-2">Scenario</th>
                        <th className="pb-2">Paying Customers</th>
                        <th className="pb-2">Monthly Revenue</th>
                        <th className="pb-2">Estimated Surplus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="py-2.5 font-medium text-stone-800">Conservative (Early Stage)</td>
                        <td className="py-2.5 tabular-nums">250 users</td>
                        <td className="py-2.5 font-semibold tabular-nums text-stone-900">₹24,750 / mo</td>
                        <td className="py-2.5 tabular-nums text-emerald-700">₹22,250</td>
                      </tr>
                      <tr className="bg-purple-50/40">
                        <td className="py-2.5 font-semibold text-[#581C4E]">Base Case (Target)</td>
                        <td className="py-2.5 font-semibold tabular-nums text-[#581C4E]">500 users</td>
                        <td className="py-2.5 font-bold tabular-nums text-[#581C4E]">₹49,500 / mo</td>
                        <td className="py-2.5 font-semibold tabular-nums text-emerald-800">₹44,500</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-stone-800">Ambitious (Scale)</td>
                        <td className="py-2.5 tabular-nums">1,000 users</td>
                        <td className="py-2.5 font-semibold tabular-nums text-stone-900">₹99,000 / mo</td>
                        <td className="py-2.5 tabular-nums text-emerald-700">₹89,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-6">
              {/* Status Ribbon */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                backendStatus.isFirebaseConfigured
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <Database className="w-5 h-5 shrink-0 mt-0.5 text-[#581C4E]" />
                <div className="space-y-1">
                  <h3 className="font-editorial text-base font-bold">
                    {backendStatus.isFirebaseConfigured
                      ? 'Live Firebase Cloud Services Active'
                      : 'Firebase Environment Variables Required'}
                  </h3>
                  <p className="text-xs leading-relaxed">
                    {backendStatus.isFirebaseConfigured
                      ? `Connected to Google Firebase (${backendStatus.projectId}). Google Sign-In, Cloud Firestore (${backendStatus.databaseId}), and Cloud Storage are active.`
                      : 'Configure VITE_FIREBASE_* environment variables in .env.local or Vercel Project Settings to connect Google Sign-In, Cloud Firestore, and Cloud Storage.'}
                  </p>
                </div>
              </div>

              {/* Architecture Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#581C4E]" />
                    <span>1. Google Sign-In Only</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Single-provider Google Authentication via Firebase Auth. Uses verified Firebase UIDs for ownership checks and session persistence across page reloads.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <Server className="w-4 h-4 text-[#581C4E]" />
                    <span>2. Cloud Firestore</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Real-time cloud collections for <code className="text-[#581C4E]">/users</code>, <code className="text-[#581C4E]">/stories</code>, <code className="text-[#581C4E]">/drafts</code>, <code className="text-[#581C4E]">/bookmarks</code>, and <code className="text-[#581C4E]">/engagements</code> defined in <code className="text-stone-800">firebase-blueprint.json</code>.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-[#581C4E]" />
                    <span>3. Security & Storage Rules</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Zero-trust rules in <code className="text-stone-800">firestore.rules</code> &amp; <code className="text-stone-800">storage.rules</code>: private drafts strictly isolated to owners; image uploads validated by MIME type &amp; size.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Deployment Setup Instructions */}
              <div className="p-5 bg-white border border-[#E7E2DA] rounded-xl space-y-3">
                <h4 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>GitHub → Vercel &amp; Firebase Deployment Checklist</span>
                </h4>
                <ol className="list-decimal list-inside text-xs text-stone-600 space-y-2 leading-relaxed">
                  <li>
                    <strong>Enable Google Authentication</strong>: In{' '}
                    <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#581C4E] underline">
                      Firebase Console
                    </a>{' '}
                    &gt; Authentication &gt; Sign-in method, enable the <strong>Google</strong> provider.
                  </li>
                  <li>
                    <strong>Authorize Vercel Domain</strong>: In Firebase Authentication &gt; Settings &gt; <strong>Authorized domains</strong>, add your deployed <code className="bg-stone-100 px-1 py-0.5 rounded">*.vercel.app</code> domain.
                  </li>
                  <li>
                    <strong>Deploy Security Rules</strong>: Deploy <code className="bg-stone-100 px-1 py-0.5 rounded">firestore.rules</code> and <code className="bg-stone-100 px-1 py-0.5 rounded">storage.rules</code> to your Firebase project.
                  </li>
                  <li>
                    <strong>Configure Vercel Environment Variables</strong>: Add the following keys in Vercel Project Settings (Framework: Vite, Build: <code className="bg-stone-100 px-1 py-0.5 rounded">npm run build</code>, Output: <code className="bg-stone-100 px-1 py-0.5 rounded">dist</code>):
                    <div className="mt-2 p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] overflow-x-auto space-y-1">
                      <div>VITE_FIREBASE_API_KEY="your-api-key"</div>
                      <div>VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"</div>
                      <div>VITE_FIREBASE_PROJECT_ID="your-project-id"</div>
                      <div>VITE_FIREBASE_DATABASE_ID="your-firestore-database-id"</div>
                      <div>VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"</div>
                      <div>VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"</div>
                      <div>VITE_FIREBASE_APP_ID="your-app-id"</div>
                    </div>
                  </li>
                </ol>
              </div>

              {/* End-to-End Test Journey Verification Matrix */}
              <div className="p-5 bg-white border border-[#E7E2DA] rounded-xl space-y-3">
                <h4 className="font-editorial text-base font-bold text-stone-900">
                  Production User Journey &amp; Security Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="font-semibold text-stone-900 mb-1">✓ Step 1: Continue with Google</p>
                    <p>Sign in with your Google account. Firebase Auth creates a persistent session and syncs your profile to <code className="text-[#581C4E]">/users/&#123;uid&#125;</code>.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="font-semibold text-stone-900 mb-1">✓ Step 2: Save Private Draft</p>
                    <p>Open Write a Story, draft content, and click "Save Draft". Drafts sync privately to Cloud Firestore under your UID.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="font-semibold text-stone-900 mb-1">✓ Step 3: Publish Story</p>
                    <p>Click "Publish Story". Stories appear publicly in real time across Home and Explore Stories.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="font-semibold text-stone-900 mb-1">✓ Step 4: Ownership Enforcement</p>
                    <p>Firestore security rules ensure another user cannot view your private drafts or edit/delete your published stories.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-[#E7E2DA] flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Mosaic Venture Quest MVP • DBS Global University
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-white bg-[#581C4E] rounded-md hover:bg-[#431439] transition-colors"
          >
            Close & Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
