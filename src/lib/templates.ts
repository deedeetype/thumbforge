import { Template, DesignOptions, moodConfigs } from '@/types';

export const templates: Template[] = [
  {
    id: 'bold-bright',
    name: 'Bold & Bright',
    description: 'High contrast, large text, vibrant colors, face close-ups',
    promptStyle: 'Create a vibrant, eye-catching YouTube thumbnail with high contrast colors. Use large, bold text overlays. Include dramatic facial expressions or close-up shots. Make it energetic and attention-grabbing.',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dark tones, dramatic lighting, movie-poster style',
    promptStyle: 'Create a cinematic, movie-poster style YouTube thumbnail with dramatic lighting and dark tones. Use moody atmosphere, deep shadows, and high production value aesthetics.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, lots of whitespace, elegant typography',
    promptStyle: 'Create a clean, minimalist YouTube thumbnail. Use elegant, simple typography. Focus on one key element or concept. Use a limited color palette. Sophisticated and modern.',
  },
  {
    id: 'clickbait-pro',
    name: 'Clickbait Pro',
    description: 'Arrows, circles, shocked faces, bright yellow/red',
    promptStyle: 'Create an attention-grabbing clickbait-style YouTube thumbnail with shocked or surprised expressions, arrows pointing to key elements, circles highlighting details, and dramatic contrast.',
  },
  {
    id: 'tech-tutorial',
    name: 'Tech/Tutorial',
    description: 'Code snippets, gradients, clean professional look',
    promptStyle: 'Create a professional, tech-focused YouTube thumbnail with clean gradients, code snippets or tech elements, modern UI design, and a sleek professional appearance.',
  },
  {
    id: 'vlog-style',
    name: 'Vlog Style',
    description: 'Warm tones, lifestyle feel, personal touch',
    promptStyle: 'Create a warm, personal vlog-style YouTube thumbnail with lifestyle aesthetics, warm color tones, natural lighting, and a friendly, approachable vibe.',
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
  const isLandscape = designOptions.aspectRatio === 'landscape';
  const dimensions = isLandscape ? '1280x720 (16:9 landscape)' : '1080x1920 (9:16 portrait/short)';
  const formatLabel = isLandscape ? 'long-form' : 'short';

  const moodConfig = moodConfigs.find((m) => m.id === designOptions.mood);
  const headline = designOptions.headlineText || videoMetadata.title;

  const parts: string[] = [];

  // Base style from template
  parts.push(template.promptStyle);

  // === DIMENSIONS ===
  parts.push(`\nImage dimensions: ${dimensions}. This is a ${formatLabel} YouTube thumbnail.`);

  // === MOOD ACCENT SYSTEM ===
  if (moodConfig && moodConfig.id !== 'none') {
    parts.push(`
Color Palette — Mood: ${moodConfig.emoji} ${moodConfig.label}
Use ONLY ${moodConfig.colorName} (${moodConfig.color}) as the dominant accent color throughout. Dark background base.

Accent Usage (mandatory):
- A diagonal accent stripe in the top-right corner using ${moodConfig.colorName}.
- A subtle ${moodConfig.colorName} glow or rim light around the main subject.
- A small decorative ${moodConfig.colorName} circle or dot element in one corner as a visual signature.
- Any graphic elements (arrows, shapes, icons) must use ${moodConfig.colorName} ONLY.`);
  }

  // === TYPOGRAPHY ===
  parts.push(`
Typography:
- Large, bold, uppercase sans-serif headline text (similar to Anton or Impact style).
- Text color: pure white with a thick black outline/stroke and a hard black drop shadow.
- Text positioned in the ${isLandscape ? 'lower-left area' : 'center-bottom area'}.
- Text should occupy no more than 40% of the canvas.
- Headline text: "${headline}"`);

  // === SUBJECT/SCENE PLACEMENT ===
  if (hasAvatar && designOptions.includeAvatar) {
    const placement = isLandscape
      ? `right side of the frame, positioned on the ${designOptions.avatarPosition}`
      : 'upper half of the frame';
    parts.push(`
Subject Placement:
- Place the person/avatar on the ${placement}.
- Subject should have a thin ${moodConfig?.colorName || 'accent'}-colored border or glow outlining them.
- Subject should be bold, well-lit from the front, with high contrast against the dark background.`);
  } else {
    parts.push(`
Scene (no subject):
- Use abstract geometric shapes, light streaks, or bokeh in the accent color to fill the space.
- Keep composition dynamic and visually interesting.`);
  }

  // === ADDITIONAL DESIGN OPTIONS ===
  const directives: string[] = [];

  if (designOptions.fontColor !== '#FFFFFF') {
    directives.push(`Override text color to ${designOptions.fontColor}.`);
  }
  if (designOptions.backgroundColor !== '#000000') {
    directives.push(`Use ${designOptions.backgroundColor} as the background base color instead of pure black.`);
  }
  if (designOptions.overlayOpacity > 0 && designOptions.overlayOpacity !== 50) {
    directives.push(`Apply a semi-transparent overlay at about ${designOptions.overlayOpacity}% opacity for text readability.`);
  }
  if (!designOptions.showVideoTitle) {
    directives.push('Do NOT include any title text in the thumbnail. Focus on visuals only.');
  }
  if (designOptions.showChannelTitle && videoMetadata.author_name) {
    directives.push(`Include the channel name "${videoMetadata.author_name}" in smaller, subtle text.`);
  }

  if (directives.length > 0) {
    parts.push('\nAdditional directives:\n' + directives.join('\n'));
  }

  // === VIDEO CONTEXT ===
  parts.push(`\nVideo context:\nTitle: "${videoMetadata.title}"`);
  if (videoMetadata.author_name) {
    parts.push(`Creator: ${videoMetadata.author_name}`);
  }

  parts.push(`\nCreate a professional YouTube thumbnail at ${dimensions} resolution. Clear, readable, optimized for both desktop and mobile viewing.`);

  return parts.join('\n');
}
