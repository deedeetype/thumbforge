import { Template, DesignOptions } from '@/types';

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

interface VideoMetadata {
  title: string;
  author_name?: string;
}

export function buildPrompt(
  template: Template,
  videoMetadata: VideoMetadata,
  designOptions: DesignOptions,
  hasAvatar: boolean
): string {
  const parts: string[] = [];

  parts.push(template.promptStyle);

  // Design directives
  const designDirectives: string[] = [];

  if (designOptions.fontColor && designOptions.fontColor !== '#FFFFFF') {
    designDirectives.push(`Use ${designOptions.fontColor} as the primary text/font color.`);
  }

  if (designOptions.backgroundColor && designOptions.backgroundColor !== '#000000') {
    designDirectives.push(`Use ${designOptions.backgroundColor} as the dominant background color.`);
  } else {
    designDirectives.push('Use a dark background.');
  }

  if (designOptions.overlayOpacity > 0) {
    designDirectives.push(`Apply a semi-transparent overlay at about ${designOptions.overlayOpacity}% opacity for text readability.`);
  }

  if (designOptions.textPosition === 'top') {
    designDirectives.push('Position the main text/title at the top of the image.');
  } else if (designOptions.textPosition === 'center') {
    designDirectives.push('Position the main text/title in the center of the image.');
  } else {
    designDirectives.push('Position the main text/title at the bottom of the image.');
  }

  // Title and channel display
  if (designOptions.showVideoTitle) {
    designDirectives.push(`Include the video title text "${videoMetadata.title}" prominently in the thumbnail.`);
  } else {
    designDirectives.push('Do NOT include any title text in the thumbnail. Focus on visuals only.');
  }

  if (designOptions.showChannelTitle && videoMetadata.author_name) {
    designDirectives.push(`Include the channel name "${videoMetadata.author_name}" in a smaller, subtle text.`);
  } else {
    designDirectives.push('Do NOT include any channel name text.');
  }

  // Avatar
  if (designOptions.includeAvatar && hasAvatar) {
    designDirectives.push(
      `Include a person/avatar on the ${designOptions.avatarPosition} side of the thumbnail. The avatar should be prominently featured and integrated naturally into the composition.`
    );
  } else if (!designOptions.includeAvatar) {
    designDirectives.push('Do NOT include any person or avatar in the thumbnail.');
  }

  if (designDirectives.length > 0) {
    parts.push('\nDesign directives:\n' + designDirectives.join('\n'));
  }

  parts.push(`\nVideo context:\nTitle: "${videoMetadata.title}"`);
  if (videoMetadata.author_name) {
    parts.push(`Creator: ${videoMetadata.author_name}`);
  }

  parts.push(
    '\nCreate a professional YouTube thumbnail (1280x720, 16:9 aspect ratio) that captures the essence of this video. The thumbnail should be clear, readable, and optimized for both desktop and mobile viewing.'
  );

  return parts.join('\n');
}
