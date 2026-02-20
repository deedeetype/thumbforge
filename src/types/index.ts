export interface Template {
  id: string;
  name: string;
  description: string;
  promptStyle: string;
}

export interface VideoMetadata {
  title: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  html?: string;
}

export interface DesignOptions {
  fontColor: string;
  backgroundColor: string;
  showChannelTitle: boolean;
  showVideoTitle: boolean;
  includeAvatar: boolean;
  avatarPosition: 'left' | 'right' | 'center';
  textPosition: 'top' | 'bottom' | 'center';
  overlayOpacity: number; // 0-100
}

export const defaultDesignOptions: DesignOptions = {
  fontColor: '#FFFFFF',
  backgroundColor: '#000000',
  showChannelTitle: true,
  showVideoTitle: true,
  includeAvatar: false,
  avatarPosition: 'right',
  textPosition: 'bottom',
  overlayOpacity: 50,
};

export interface GeneratedThumbnail {
  id: string;
  imageUrl: string;
  templateId: string;
  templateName: string;
  timestamp: number;
  videoTitle?: string;
}

export interface GenerateThumbnailRequest {
  youtubeUrl: string;
  templateId: string;
  designOptions: DesignOptions;
  avatarDataUrl?: string; // base64 data URL of uploaded avatar
}

export interface GenerateThumbnailResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}
