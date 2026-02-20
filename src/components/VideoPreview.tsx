'use client';

import { VideoMetadata } from '@/types';
import Card from './ui/Card';
import Image from 'next/image';

interface VideoPreviewProps {
  metadata: VideoMetadata | null;
}

export default function VideoPreview({ metadata }: VideoPreviewProps) {
  if (!metadata) {
    return null;
  }

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Video Context</h3>
      <div className="flex gap-4">
        {metadata.thumbnail_url && (
          <div className="flex-shrink-0">
            <Image
              src={metadata.thumbnail_url}
              alt="Video thumbnail"
              width={160}
              height={90}
              className="rounded object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white mb-2 truncate">{metadata.title}</h4>
          {metadata.author_name && (
            <p className="text-sm text-gray-400">by {metadata.author_name}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
