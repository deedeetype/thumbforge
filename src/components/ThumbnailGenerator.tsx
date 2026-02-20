'use client';

import { useState } from 'react';
import { GeneratedThumbnail, VideoMetadata, DesignOptions, defaultDesignOptions } from '@/types';
import { isValidYouTubeUrl } from '@/lib/youtube';
import { templates } from '@/lib/templates';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import TemplateSelector from './TemplateSelector';
import VideoPreview from './VideoPreview';
import ThumbnailGallery from './ThumbnailGallery';
import AvatarUpload from './AvatarUpload';
import DesignOptionsPanel from './DesignOptions';

export default function ThumbnailGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<GeneratedThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError(null);
      return false;
    }
    if (!isValidYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
      return false;
    }
    setUrlError(null);
    return true;
  };

  const doGenerate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl,
          templateId,
          designOptions,
          avatarDataUrl: designOptions.includeAvatar ? avatarDataUrl : undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate thumbnail');
      }

      // Update video metadata from API response
      if (data.videoMetadata) {
        setVideoMetadata(data.videoMetadata);
      }

      const newThumbnail: GeneratedThumbnail = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        templateId,
        templateName: templates.find((t) => t.id === templateId)?.name || 'Unknown',
        timestamp: Date.now(),
        videoTitle: data.videoMetadata?.title || videoMetadata?.title,
        aspectRatio: designOptions.aspectRatio,
      };

      setCurrentThumbnail(data.imageUrl);
      setThumbnails((prev) => [newThumbnail, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!validateUrl(youtubeUrl)) return;
    await doGenerate(selectedTemplateId);
  };

  const handleRegenerate = async (thumbnail: GeneratedThumbnail) => {
    setSelectedTemplateId(thumbnail.templateId);
    await doGenerate(thumbnail.templateId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Panel - Input Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">YouTube URL</h2>
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onBlur={() => validateUrl(youtubeUrl)}
            error={urlError || undefined}
            disabled={isLoading}
          />
        </Card>

        <TemplateSelector
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={setSelectedTemplateId}
          disabled={isLoading}
        />

        <Card>
          <AvatarUpload
            avatarDataUrl={avatarDataUrl}
            onAvatarChange={setAvatarDataUrl}
            disabled={isLoading}
          />
        </Card>

        <DesignOptionsPanel
          options={designOptions}
          onChange={setDesignOptions}
          disabled={isLoading}
        />

        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerateThumbnail}
          disabled={isLoading || !youtubeUrl || !!urlError}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              Generating...
            </span>
          ) : (
            'Generate Thumbnail'
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Right Panel - Preview & Gallery */}
      <div className="lg:col-span-2 space-y-6">
        <VideoPreview metadata={videoMetadata} />

        {currentThumbnail && (
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Latest Thumbnail</h2>
            <div className={`relative w-full bg-gray-900 rounded overflow-hidden ${
              designOptions.aspectRatio === 'portrait' ? 'max-w-sm mx-auto' : ''
            }`} style={{
              aspectRatio: designOptions.aspectRatio === 'landscape' ? '16/9' : '9/16',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentThumbnail}
                alt="Generated thumbnail"
                className="w-full h-full object-contain"
              />
            </div>
          </Card>
        )}

        <ThumbnailGallery thumbnails={thumbnails} onRegenerate={handleRegenerate} />
      </div>
    </div>
  );
}
