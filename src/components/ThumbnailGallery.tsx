'use client';

import { GeneratedThumbnail } from '@/types';
import Card from './ui/Card';
import Button from './ui/Button';
import Image from 'next/image';

interface ThumbnailGalleryProps {
  thumbnails: GeneratedThumbnail[];
  onRegenerate: (thumbnail: GeneratedThumbnail) => void;
}

export default function ThumbnailGallery({ thumbnails, onRegenerate }: ThumbnailGalleryProps) {
  if (thumbnails.length === 0) {
    return null;
  }

  const handleDownload = async (thumbnail: GeneratedThumbnail) => {
    try {
      const response = await fetch(thumbnail.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${thumbnail.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Generated Thumbnails</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {thumbnails.map((thumbnail) => (
          <Card key={thumbnail.id} className="space-y-3">
            <div className="relative w-full aspect-video bg-gray-900 rounded overflow-hidden">
              <Image
                src={thumbnail.imageUrl}
                alt="Generated thumbnail"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Style: {thumbnail.templateName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(thumbnail.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {thumbnail.videoTitle && (
                <p className="text-sm text-gray-300 truncate">{thumbnail.videoTitle}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(thumbnail)}
                  className="flex-1"
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onRegenerate(thumbnail)}
                  className="flex-1"
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
