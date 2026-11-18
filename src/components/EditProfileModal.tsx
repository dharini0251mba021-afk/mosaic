import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Upload } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { StoryCategory } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, uploadImage } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [interests, setInterests] = useState<StoryCategory[]>(currentUser?.interests || []);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setCity(currentUser.city || '');
      setAvatar(currentUser.avatar || '');
      setInterests(currentUser.interests || []);
      setAvatarError(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setUploadingAvatar(true);

    try {
      const res = await uploadImage(file, 'avatars');
      if (res.error) {
        setAvatarError(res.error);
      } else if (res.url) {
        setAvatar(res.url);
      }
    } catch (err) {
      setAvatarError('Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      bio,
      city,
      avatar,
      interests
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const toggleInterest = (cat: StoryCategory) => {
    if (interests.includes(cat)) {
      setInterests(interests.filter(c => c !== cat));
    } else {
      setInterests([...interests, cat]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 bg-[#581C4E] text-white flex items-center justify-between">
          <h3 className="font-editorial text-lg font-bold">Edit Creator Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City in India
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Avatar Photo
                </label>
                <label className="cursor-pointer text-[11px] font-semibold text-[#581C4E] hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarFile}
                  />
                </label>
              </div>
              <input
                type="url"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                placeholder="Paste URL or upload image"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
              />
              {avatarError && (
                <p className="text-[10px] text-rose-600 mt-1">{avatarError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#581C4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Areas of Interest
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    interests.includes(cat)
                      ? 'bg-[#581C4E] text-white'
                      : 'bg-white border border-[#E7E2DA] text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-between">
            <span className="text-xs text-stone-500">
              {savedSuccess ? 'Profile saved to Cloud Firestore!' : 'Changes sync to Google Cloud Firestore'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#581C4E] rounded-lg hover:bg-[#431439] transition-colors flex items-center gap-1.5"
              >
                {savedSuccess && <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
