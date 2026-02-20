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
}

export interface GenerateThumbnailResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}
