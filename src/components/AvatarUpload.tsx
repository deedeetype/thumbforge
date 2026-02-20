'use client';

import { useRef } from 'react';
import Button from './ui/Button';

interface AvatarUploadProps {
  avatarDataUrl: string | null;
  onAvatarChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export default function AvatarUpload({ avatarDataUrl, onAvatarChange, disabled }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onAvatarChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Your Avatar</label>
      <div className="flex items-center gap-4">
        {avatarDataUrl ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
            <img src={avatarDataUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            {avatarDataUrl ? 'Change' : 'Upload'}
          </Button>
          {avatarDataUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAvatarChange(null)}
              disabled={disabled}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">PNG, JPG up to 5MB. Used as reference for AI generation.</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
