import { Template } from '@/types';

export const templates: Template[] = [
  {
    id: 'bold-bright',
    name: 'Bold & Bright',
    description: 'High contrast, large text, vibrant colors, face close-ups',
    promptStyle: 'Create a vibrant, eye-catching YouTube thumbnail with high contrast colors (bright yellows, reds, blues). Use large, bold text overlays. Include dramatic facial expressions or close-up shots. Make it energetic and attention-grabbing. Style: Bold and bright with vivid colors.',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dark tones, dramatic lighting, movie-poster style',
    promptStyle: 'Create a cinematic, movie-poster style YouTube thumbnail with dramatic lighting and dark tones. Use moody atmosphere, deep shadows, and high production value aesthetics. Make it feel like a blockbuster film poster. Style: Cinematic with dramatic lighting.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, lots of whitespace, elegant typography',
    promptStyle: 'Create a clean, minimalist YouTube thumbnail with lots of whitespace. Use elegant, simple typography. Focus on one key element or concept. Use a limited color palette. Make it sophisticated and modern. Style: Minimalist with clean design.',
  },
  {
    id: 'clickbait-pro',
    name: 'Clickbait Pro',
    description: 'Arrows, circles, shocked faces, bright yellow/red',
    promptStyle: 'Create an attention-grabbing clickbait-style YouTube thumbnail with shocked or surprised facial expressions, bright yellow and red colors, arrows pointing to key elements, circles highlighting important details, and dramatic contrast. Make it irresistible to click. Style: Clickbait with shock value.',
  },
  {
    id: 'tech-tutorial',
    name: 'Tech/Tutorial',
    description: 'Code snippets, gradients, clean professional look',
    promptStyle: 'Create a professional, tech-focused YouTube thumbnail with clean gradients, code snippets or tech elements, modern UI design elements, and a sleek professional appearance. Use blues, purples, and techy color schemes. Style: Tech tutorial with professional design.',
  },
  {
    id: 'vlog-style',
    name: 'Vlog Style',
    description: 'Warm tones, lifestyle feel, personal touch',
    promptStyle: 'Create a warm, personal vlog-style YouTube thumbnail with lifestyle aesthetics, warm color tones, natural lighting feel, and a friendly, approachable vibe. Make it feel authentic and relatable. Style: Vlog with warm, personal touch.',
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function buildPrompt(template: Template, videoMetadata: VideoMetadata): string {
  const { title, author_name } = videoMetadata;
  
  return `${template.promptStyle}

Video context:
Title: "${title}"
${author_name ? `Creator: ${author_name}` : ''}

Create a professional YouTube thumbnail (1280x720, 16:9 aspect ratio) that captures the essence of this video. The thumbnail should be clear, readable, and optimized for both desktop and mobile viewing. Include relevant text overlays that complement the video title.`;
}

interface VideoMetadata {
  title: string;
  author_name?: string;
}
