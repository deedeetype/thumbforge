import { VideoMetadata } from '@/types';

export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }
    
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) return videoId;
    }
    
    // Handle youtube.com/shorts/VIDEO_ID
    if (urlObj.pathname.includes('/shorts/')) {
      const videoId = urlObj.pathname.split('/shorts/')[1];
      if (videoId) return videoId.split('?')[0];
    }
    
    return null;
  } catch {
    return null;
  }
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

export async function fetchVideoMetadata(youtubeUrl: string): Promise<VideoMetadata> {
  try {
    // Try YouTube oEmbed first
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
    const response = await fetch(oEmbedUrl);
    
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title || 'Untitled Video',
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
        html: data.html,
      };
    }
    
    // Fallback: try noembed.com
    const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`;
    const fallbackResponse = await fetch(noembedUrl);
    
    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      return {
        title: data.title || 'Untitled Video',
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
      };
    }
    
    throw new Error('Failed to fetch video metadata');
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw new Error('Unable to fetch video information. Please check the URL and try again.');
  }
}
