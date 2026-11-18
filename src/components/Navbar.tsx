import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PenSquare,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  onOpenPitch: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenPitch,
  onOpenAuth
}) => {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: string, storyId?: string, profileUserId?: string) => {
    onNavigate(tab, storyId, profileUserId);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#581C4E]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-[#581C4E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#431439] transition-colors">
                  <span className="font-serif text-lg font-bold tracking-tight">M</span>
                </div>
                <div>
                  <span className="font-editorial text-2xl font-bold tracking-tight text-[#231F20] block leading-none">
                    MOSAIC
                  </span>
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 font-sans block mt-1">
                    by Dharini Singh
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-700">
            {/* Common: Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#581C4E] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'home'
                  ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Home
            </button>

            {/* Common: Explore Stories */}
            <button
              onClick={() => handleNavClick('explore')}
              className={`hover:text-[#581C4E] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'explore'
                  ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Explore Stories
            </button>

            {/* Common: Categories */}
            <button
              onClick={() => handleNavClick('categories')}
              className={`hover:text-[#581C4E] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'categories'
                  ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Categories
            </button>

            {/* Logged-In: Write a Story */}
            {currentUser && (
              <button
                onClick={() => handleNavClick('write')}
                className={`hover:text-[#581C4E] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  currentTab === 'write'
                    ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                    : 'border-transparent'
                }`}
              >
                Write a Story
              </button>
            )}

            {/* Logged-In: My Profile */}
            {currentUser && (
              <button
                onClick={() => handleNavClick('profile', undefined, currentUser.id)}
                className={`hover:text-[#581C4E] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  currentTab === 'profile'
                    ? 'border-[#581C4E] text-[#581C4E] font-semibold'
                    : 'border-transparent'
                }`}
              >
                My Profile
              </button>
            )}

            {/* Venture Quest Presentation MVP Modal */}
            <button
              onClick={onOpenPitch}
              className="text-[#581C4E] hover:text-[#431439] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-semibold text-xs tracking-wide uppercase px-2.5 py-1 rounded bg-[#F4EDFB] border border-[#E9D5FF]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Venture Quest MVP</span>
            </button>
          </nav>

          {/* Zone 3: User Session & Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentUser ? (
              // LOGGED IN STATE
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('write')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#581C4E] bg-[#F4EDFB] border border-[#E9D5FF] rounded-md hover:bg-[#ecd8fa] transition-colors shadow-2xs whitespace-nowrap"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>

                {/* Profile menu dropdown showing Google Profile name, email, avatar */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-stone-200/60 transition-colors border border-[#E7E2DA] bg-white shadow-2xs"
                    title="Google Account Menu"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-white"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-semibold text-stone-800 max-w-[120px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E7E2DA] py-2 z-50 text-xs">
                        {/* Profile Info Header */}
                        <div className="px-4 py-3 border-b border-[#F0ECE4]">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-9 h-9 rounded-full object-cover border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-stone-900 text-sm truncate">{currentUser.name}</p>
                              <p className="text-stone-500 truncate text-[11px]">{currentUser.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-[#581C4E] bg-[#F4EDFB] px-1.5 py-0.5 rounded font-medium">
                              Google Account
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              UID: {currentUser.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>

                        {/* Navigation items in menu */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              handleNavClick('profile', undefined, currentUser.id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-stone-700 flex items-center gap-2.5 font-medium"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#581C4E]" />
                            <span>My Profile & Drafts</span>
                          </button>

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              handleNavClick('write');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-stone-700 flex items-center gap-2.5 font-medium"
                          >
                            <PenSquare className="w-3.5 h-3.5 text-[#581C4E]" />
                            <span>Write a Story</span>
                          </button>
                        </div>

                        {/* Logout Option */}
                        <div className="border-t border-[#F0ECE4] pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2.5 font-semibold transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-600" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Direct Visible Logout button on Desktop */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  title="Log out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // LOGGED OUT STATE: Continue with Google Button
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
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
            )}
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={() => handleNavClick('write')}
                className="p-2 text-white bg-[#581C4E] rounded-md"
                aria-label="Start Writing"
              >
                <PenSquare className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E2DA] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2">
          {/* Common Links */}
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 px-3 rounded text-base font-medium ${
              currentTab === 'home' ? 'bg-[#581C4E] text-white' : 'text-stone-800 hover:bg-stone-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('explore')}
            className={`block w-full text-left py-2 px-3 rounded text-base font-medium ${
              currentTab === 'explore' ? 'bg-[#581C4E] text-white' : 'text-stone-800 hover:bg-stone-100'
            }`}
          >
            Explore Stories
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`block w-full text-left py-2 px-3 rounded text-base font-medium ${
              currentTab === 'categories' ? 'bg-[#581C4E] text-white' : 'text-stone-800 hover:bg-stone-100'
            }`}
          >
            Categories
          </button>

          {/* Logged In Specific Navigation */}
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('write')}
                className={`block w-full text-left py-2 px-3 rounded text-base font-medium ${
                  currentTab === 'write' ? 'bg-[#581C4E] text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                Write a Story
              </button>
              <button
                onClick={() => handleNavClick('profile', undefined, currentUser.id)}
                className={`block w-full text-left py-2 px-3 rounded text-base font-medium ${
                  currentTab === 'profile' ? 'bg-[#581C4E] text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                My Profile ({currentUser.name})
              </button>
              <div className="pt-2 border-t border-[#E7E2DA]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 rounded text-base font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            // Logged Out Specific Navigation
            <div className="pt-2 border-t border-[#E7E2DA] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-3 rounded-lg text-sm font-semibold text-stone-800 bg-white border border-[#E7E2DA] hover:bg-stone-50"
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
          )}

          {/* Presentation Pill */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPitch();
              }}
              className="flex items-center gap-2 w-full text-left py-2 px-3 rounded text-sm font-semibold text-[#581C4E] bg-[#F4EDFB] border border-[#E9D5FF]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Venture Quest Presentation MVP</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
