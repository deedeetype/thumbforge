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

export type AspectRatio = 'landscape' | 'portrait';
export type MoodAccent = 'hype' | 'shock' | 'educational' | 'money' | 'fun' | 'none';

export interface MoodConfig {
  id: MoodAccent;
  label: string;
  emoji: string;
  color: string;
  colorName: string;
  description: string;
  expression: string; // facial expression directive for avatar/character
}

export const moodConfigs: MoodConfig[] = [
  { id: 'hype', label: 'Hype', emoji: '🔥', color: '#FFD600', colorName: 'bold yellow', description: 'Bold yellow accents and glows', expression: 'excited, hyped up, wide eyes with enthusiasm, big confident smile, pumped fist or open arms, radiating energy' },
  { id: 'shock', label: 'Shock', emoji: '😱', color: '#FF1744', colorName: 'vivid red', description: 'Vivid red accents and glows', expression: 'shocked, jaw dropped wide open, eyes wide with disbelief, hands on cheeks or head, stunned frozen expression' },
  { id: 'educational', label: 'Educational', emoji: '🧠', color: '#00E5FF', colorName: 'electric cyan/teal', description: 'Electric cyan/teal accents and glows', expression: 'thoughtful, slightly raised eyebrow, knowing smile, pointing finger up as if explaining, wise and confident look' },
  { id: 'money', label: 'Money', emoji: '💰', color: '#00FF66', colorName: 'bright neon green', description: 'Bright neon green accents and glows', expression: 'smug, confident money grin, raised eyebrows, counting money gesture or holding cash, wealthy boss energy' },
  { id: 'fun', label: 'Fun', emoji: '😂', color: '#FF6D00', colorName: 'vibrant orange', description: 'Vibrant orange accents and glows', expression: 'laughing hard, mouth wide open laughing, squinted eyes from laughing, playful silly face, pure joy' },
  { id: 'none', label: 'None', emoji: '⚪', color: '#FFFFFF', colorName: 'white', description: 'No mood accent — neutral style', expression: 'neutral, calm, natural relaxed expression' },
];

export interface DesignOptions {
  fontColor: string;
  backgroundColor: string;
  showChannelTitle: boolean;
  showVideoTitle: boolean;
  includeAvatar: boolean;
  avatarPosition: 'left' | 'right' | 'center';
  textPosition: 'top' | 'bottom' | 'center';
  overlayOpacity: number;
  aspectRatio: AspectRatio;
  mood: MoodAccent;
  headlineText: string;
  avatarDescription: string;
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
  aspectRatio: 'landscape',
  mood: 'hype',
  headlineText: '',
  avatarDescription: '',
};

export interface GeneratedThumbnail {
  id: string;
  imageUrl: string;
  templateId: string;
  templateName: string;
  timestamp: number;
  videoTitle?: string;
  aspectRatio?: AspectRatio;
}

export interface GenerateThumbnailRequest {
  youtubeUrl: string;
  templateId: string;
  designOptions: DesignOptions;
}

export interface GenerateThumbnailResponse {
  success: boolean;
  imageUrl?: string;
  videoMetadata?: VideoMetadata;
  error?: string;
}
