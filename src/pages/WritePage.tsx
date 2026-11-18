import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StoryCategory } from '../types';
import { CATEGORIES, CITIES } from '../data/initialData';
import heroMosaicBanner from '../assets/images/hero_mosaic_banner_1792407604170.jpg';
import storyAhmedabadHeritage from '../assets/images/story_ahmedabad_heritage_1792407604646.jpg';
import storyMumbaiStartup from '../assets/images/story_mumbai_startup_1792407605199.jpg';
import storyDehradunMountains from '../assets/images/story_dehradun_mountains_1792407605221.jpg';
import {
  Save,
  Send,
  Eye,
  CheckCircle,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Image as ImageIcon,
  Clock,
  AlertCircle,
  ArrowLeft,
  Upload
} from 'lucide-react';

interface WritePageProps {
  onNavigate: (tab: string, storyId?: string, profileUserId?: string) => void;
  editingStoryId?: string;
  initialDraftId?: string;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

const PRESET_COVERS = [
  { label: 'Campus Terrace', url: heroMosaicBanner },
  { label: 'Ahmedabad Pols', url: storyAhmedabadHeritage },
  { label: 'Mumbai Startup Café', url: storyMumbaiStartup },
  { label: 'Dehradun Pines', url: storyDehradunMountains },
  { label: 'Writing Desk', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Indian Railways', url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80' }
];

export const WritePage: React.FC<WritePageProps> = ({
  onNavigate,
  editingStoryId,
  initialDraftId,
  onOpenAuth
}) => {
  const {
    currentUser,
    stories,
    drafts,
    publishStory,
    updateStory,
    saveDraft,
    deleteDraft,
    deleteStory,
    uploadImage
  } = useApp();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Existing story for edit mode
  const existingStory = editingStoryId ? stories.find(s => s.id === editingStoryId) : null;
  const existingDraft = initialDraftId ? drafts.find(d => d.id === initialDraftId) : null;

  // Form State
  const [title, setTitle] = useState(existingStory?.title || existingDraft?.title || '');
  const [excerpt, setExcerpt] = useState(existingStory?.excerpt || existingDraft?.excerpt || '');
  const [content, setContent] = useState(existingStory?.content || existingDraft?.content || '');
  const [category, setCategory] = useState<StoryCategory>(
    existingStory?.category || existingDraft?.category || 'Student Life'
  );
  const [city, setCity] = useState(
    existingStory?.city || existingDraft?.city || currentUser?.city || 'Dehradun'
  );
  const [coverImage, setCoverImage] = useState(
    existingStory?.coverImage ||
      existingDraft?.coverImage ||
      heroMosaicBanner
  );
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [tagsInput, setTagsInput] = useState(existingStory?.tags ? existingStory.tags.join(', ') : 'Reflections, Youth, India');

  // UI state
  const [isPreview, setIsPreview] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);
  const [publishedStoryId, setPublishedStoryId] = useState<string | null>(null);
  const [activeDraftId, setActiveDraftId] = useState<string | undefined>(initialDraftId);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Sync state when editingStoryId or initialDraftId changes
  useEffect(() => {
    if (editingStoryId) {
      const storyToEdit = stories.find(s => s.id === editingStoryId);
      if (storyToEdit) {
        setTitle(storyToEdit.title);
        setExcerpt(storyToEdit.excerpt);
        setContent(storyToEdit.content);
        setCategory(storyToEdit.category);
        setCity(storyToEdit.city || 'Dehradun');
        setCoverImage(storyToEdit.coverImage);
        setTagsInput(storyToEdit.tags ? storyToEdit.tags.join(', ') : '');
        setActiveDraftId(undefined);
        setIsPreview(false);
        setPublishedStoryId(null);
        setValidationErrors([]);
      }
    } else if (initialDraftId) {
      const draftToLoad = drafts.find(d => d.id === initialDraftId);
      if (draftToLoad) {
        setTitle(draftToLoad.title);
        setExcerpt(draftToLoad.excerpt);
        setContent(draftToLoad.content);
        setCategory(draftToLoad.category);
        setCity(draftToLoad.city || 'Dehradun');
        setCoverImage(draftToLoad.coverImage);
        setActiveDraftId(draftToLoad.id);
        setIsPreview(false);
        setPublishedStoryId(null);
        setValidationErrors([]);
      }
    } else {
      // New story mode
      setActiveDraftId(undefined);
      setPublishedStoryId(null);
      setValidationErrors([]);
    }
  }, [editingStoryId, initialDraftId, stories, drafts]);

  // Calculate estimated reading time & word count
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const estimatedReadTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Insert formatting helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleSaveDraft = async () => {
    if (!currentUser) {
      setDraftSavedMsg('Please sign in with Google to save your private drafts.');
      onOpenAuth?.('signin');
      return;
    }
    if (!title.trim() && !content.trim()) {
      setDraftSavedMsg('Draft requires at least a title or some content.');
      setTimeout(() => setDraftSavedMsg(null), 3000);
      return;
    }
    try {
      const saved = await saveDraft(
        {
          title: title || 'Untitled Reflection',
          excerpt: excerpt || title || 'Draft story in progress...',
          content,
          category,
          coverImage,
          city
        },
        activeDraftId
      );
      setActiveDraftId(saved.id);
      setDraftSavedMsg(`Draft saved (${saved.lastSaved})`);
      setTimeout(() => setDraftSavedMsg(null), 3000);
    } catch (err: any) {
      setDraftSavedMsg(err?.message || 'Could not save draft to Cloud Firestore.');
      setTimeout(() => setDraftSavedMsg(null), 4000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    setUploadingImage(true);

    try {
      const res = await uploadImage(file, 'stories');
      if (res.error) {
        setImageUploadError(res.error);
      } else if (res.url) {
        setCoverImage(res.url);
      }
    } catch (err) {
      setImageUploadError('Failed to process image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!currentUser) {
      errors.push('You must sign in with Google to publish a story on Mosaic.');
      onOpenAuth?.('signin');
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (title.trim().length < 3 || title.trim().length > 200) {
      errors.push('Story title must be between 3 and 200 characters.');
    }
    if (excerpt.trim().length < 10 || excerpt.trim().length > 400) {
      errors.push('Short description / excerpt must be between 10 and 400 characters.');
    }
    if (!content.trim() || wordCount < 30 || content.trim().length < 30) {
      errors.push('Please write your story content (minimum 30 words).');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      if (existingStory) {
        await updateStory(existingStory.id, {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
          city,
          coverImage,
          readTimeMinutes: estimatedReadTime,
          tags
        });
        setPublishedStoryId(existingStory.id);
      } else {
        const newStory = await publishStory(
          {
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            city,
            coverImage,
            readTimeMinutes: estimatedReadTime,
            tags
          },
          activeDraftId
        );
        setPublishedStoryId(newStory.id);
      }
    } catch (err: any) {
      setValidationErrors([err?.message || 'Failed to publish story to Cloud Firestore. Please try again.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If published successfully, show confirmation screen
  if (publishedStoryId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
            {existingStory ? 'Story Updated' : 'Story Published Successfully'}
          </span>
          <h2 className="font-editorial text-3xl font-bold text-stone-900">
            "{title}"
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Your story is now live in the <strong>{category}</strong> collection and discoverable by readers across India.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => onNavigate('story', publishedStoryId)}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] transition-colors"
          >
            Read Published Story
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-2.5 text-xs font-semibold text-stone-800 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50 transition-colors"
          >
            Go to Explore Stories
          </button>
          <button
            onClick={() => {
              setPublishedStoryId(null);
              setTitle('');
              setExcerpt('');
              setContent('');
              setActiveDraftId(undefined);
            }}
            className="px-6 py-2.5 text-xs text-stone-600 hover:text-stone-900"
          >
            Write Another Story
          </button>
        </div>
      </div>
    );
  }

  // Security authorization check: Users must not be able to edit another user's content
  if (existingStory && currentUser && existingStory.authorId !== currentUser.id && existingStory.author.id !== currentUser.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900">Permission Denied</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          You are not authorized to edit this story. Only the original author (@{existingStory.author.username}) has editing permissions for this article.
        </p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] transition-colors"
        >
          Explore Stories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-8">
      {/* Guest Mode Alert Banner */}
      {!currentUser && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="space-y-0.5">
            <p className="font-semibold flex items-center gap-1.5 text-stone-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>Guest Storyteller Mode</span>
            </p>
            <p className="text-stone-600 text-[11px]">
              You can draft and preview your reflections freely. Sign in with Google to save private drafts or publish stories to Cloud Firestore.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth?.('signin')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E2DA] rounded-lg font-semibold text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2DA]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('explore')}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#581C4E] font-semibold block">
              {existingStory ? 'Edit Story' : 'Story Editor'}
            </span>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              {existingStory ? 'Update Your Published Story' : 'Write a Story on Mosaic'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-colors ${
              isPreview
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white border-[#E7E2DA] text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreview ? 'Back to Editor' : 'Preview Mode'}</span>
          </button>

          {!existingStory && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{existingStory ? 'Update Story' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
            <AlertCircle className="w-4 h-4" />
            <span>Please complete the required fields:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-700 space-y-0.5">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Draft Save Feedback */}
      {draftSavedMsg && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-[#581C4E]" />
          <span>{draftSavedMsg}</span>
        </div>
      )}

      {/* PREVIEW MODE */}
      {isPreview ? (
        <div className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-wider text-[#581C4E]">{category}</span>
            <span aria-hidden="true">·</span>
            <span>{estimatedReadTime} min read</span>
            <span aria-hidden="true">·</span>
            <span>{city}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-medium">PREVIEW</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
            {title || 'Untitled Story'}
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-stone-600">
            {excerpt || 'Short description will appear here...'}
          </p>

          <div className="py-2 border-y border-[#E7E2DA] flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-xs">
              <span className="font-semibold text-stone-900 block">{currentUser?.name}</span>
              <span className="text-stone-500">Author Display · {city}</span>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
            <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4 text-stone-800 leading-relaxed text-base">
            {content ? (
              content.split('\n\n').map((para, i) => (
                <p key={i} className={i === 0 ? 'first-letter:text-4xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2 text-[#581C4E]' : ''}>
                  {para}
                </p>
              ))
            ) : (
              <p className="text-stone-400 italic">No content written yet...</p>
            )}
          </div>
        </div>
      ) : (
        /* EDITOR MODE */
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Metadata Bar (Category, City, Read Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white border border-[#E7E2DA] rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as StoryCategory)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-[#E7E2DA] rounded-md focus:outline-none focus:border-[#581C4E]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Location in India
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-[#E7E2DA] rounded-md focus:outline-none focus:border-[#581C4E]"
              >
                {CITIES.filter(c => c !== 'All Cities').map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reading Estimation
              </label>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-md text-xs text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {estimatedReadTime} min read <span className="text-stone-400">({wordCount} words)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title of your story..."
              className="w-full px-4 py-3 font-editorial text-2xl sm:text-3xl font-bold bg-white border border-[#E7E2DA] rounded-xl focus:outline-none focus:border-[#581C4E] placeholder:text-stone-300"
            />
          </div>

          {/* Subtitle / Excerpt */}
          <div>
            <textarea
              rows={2}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="A short subtitle or excerpt summarizing your perspective (1-2 sentences)..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E2DA] rounded-xl focus:outline-none focus:border-[#581C4E] placeholder:text-stone-400 font-serif italic"
            />
          </div>

          {/* Cover Image Selector */}
          <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#581C4E]" />
                <span>Story Cover Image</span>
              </span>
              <span className="text-[11px] text-stone-500">Pick a preset or enter URL</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    coverImage === preset.url
                      ? 'border-[#581C4E] ring-2 ring-[#581C4E]/20'
                      : 'border-transparent hover:opacity-90'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 truncate px-1 text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={customCoverUrl}
                onChange={e => setCustomCoverUrl(e.target.value)}
                placeholder="Or paste any image URL here..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customCoverUrl.trim()) {
                    setCoverImage(customCoverUrl.trim());
                    setCustomCoverUrl('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Use URL
              </button>
            </div>

            {/* Direct File Upload Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#581C4E] bg-[#F4EDFB] border border-[#E9D5FF] rounded-lg hover:bg-[#ecd8fa] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Validating & Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                  />
                </label>
                <span className="text-[11px] text-stone-500">JPG, PNG, WebP (max 5MB)</span>
              </div>
              {imageUploadError && (
                <span className="text-xs text-rose-600 font-medium">{imageUploadError}</span>
              )}
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="sticky top-20 z-20 flex items-center gap-1 p-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n## ', '\n')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n### ', '\n')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n- ', '')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n> ', '\n')}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs flex items-center gap-1"
              title="Pull Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <div className="ml-auto text-[11px] text-stone-500 pr-2">
              Paragraphs separated by blank line
            </div>
          </div>

          {/* Main Story Content Textarea */}
          <div>
            <textarea
              ref={textareaRef}
              rows={14}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tell your story. Describe the moments, lessons, and textures of your experience..."
              className="w-full p-5 text-base sm:text-lg bg-white border border-[#E7E2DA] rounded-xl focus:outline-none focus:border-[#581C4E] leading-relaxed placeholder:text-stone-300 font-sans"
            />
          </div>

          {/* Tags */}
          <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Topics & Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. Campus, Dehradun, First Job, Resilience"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Author: <strong>{currentUser?.name || 'Guest Contributor'}</strong> ({city})
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-[#E7E2DA] rounded-md hover:bg-stone-50"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-md hover:bg-[#431439] shadow-xs"
              >
                {existingStory ? 'Update Story' : 'Publish Story'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
