'use client';

import { useState } from 'react';
import { GeneratedThumbnail, VideoMetadata } from '@/types';
import { isValidYouTubeUrl } from '@/lib/youtube';
import { templates } from '@/lib/templates';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import TemplateSelector from './TemplateSelector';
import VideoPreview from './VideoPreview';
import ThumbnailGallery from './ThumbnailGallery';

export default function ThumbnailGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<GeneratedThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

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

  const handleGenerateThumbnail = async () => {
    if (!validateUrl(youtubeUrl)) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          templateId: selectedTemplateId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate thumbnail');
      }

      // Create new thumbnail object
      const newThumbnail: GeneratedThumbnail = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        templateId: selectedTemplateId,
        templateName: templates.find((t) => t.id === selectedTemplateId)?.name || 'Unknown',
        timestamp: Date.now(),
        videoTitle: videoMetadata?.title,
      };

      setCurrentThumbnail(data.imageUrl);
      setThumbnails((prev) => [newThumbnail, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (thumbnail: GeneratedThumbnail) => {
    setSelectedTemplateId(thumbnail.templateId);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          templateId: thumbnail.templateId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate thumbnail');
      }

      const newThumbnail: GeneratedThumbnail = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        templateId: thumbnail.templateId,
        templateName: thumbnail.templateName,
        timestamp: Date.now(),
        videoTitle: videoMetadata?.title,
      };

      setCurrentThumbnail(data.imageUrl);
      setThumbnails((prev) => [newThumbnail, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlBlur = () => {
    validateUrl(youtubeUrl);
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
            onBlur={handleUrlBlur}
            error={urlError || undefined}
            disabled={isLoading}
          />
        </Card>

        <TemplateSelector
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={setSelectedTemplateId}
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

        {/* Current Thumbnail Preview */}
        {currentThumbnail && (
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Latest Thumbnail</h2>
            <div className="relative w-full aspect-video bg-gray-900 rounded overflow-hidden">
              <img
                src={currentThumbnail}
                alt="Generated thumbnail"
                className="w-full h-full object-contain"
              />
            </div>
          </Card>
        )}

        {/* Gallery */}
        <ThumbnailGallery thumbnails={thumbnails} onRegenerate={handleRegenerate} />
      </div>
    </div>
  );
}
