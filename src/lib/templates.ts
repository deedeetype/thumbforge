import { Template, DesignOptions, VideoMetadata, moodConfigs } from '@/types';

export const templates: Template[] = [
  {
    id: 'bold-bright',
    name: 'Bold & Bright',
    description: 'High contrast, large text, vibrant colors, face close-ups',
    promptStyle: 'Style: BOLD & BRIGHT — Extremely vibrant and saturated colors, high contrast, neon glows, explosive energy. Use real brand logos and icons where relevant to the topic. Include bold graphic elements like thick arrows, star bursts, exclamation marks, and 3D text effects. Think MrBeast-level thumbnails.',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dark tones, dramatic lighting, movie-poster style',
    promptStyle: 'Style: CINEMATIC — Dark moody tones, dramatic side lighting with strong rim lights, lens flares, shallow depth of field, film grain texture. Composition like a Hollywood movie poster. Use recognizable real-world objects, vehicles, buildings, or brand elements where relevant. Deep shadows, volumetric fog or smoke for atmosphere.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, lots of whitespace, elegant typography',
    promptStyle: 'Style: MINIMALIST — Ultra-clean composition, generous negative space, one strong focal element. Elegant sans-serif typography. Use real product photos, real app icons, or real brand logos if relevant to topic. Subtle gradients, sharp lines, Apple-level design sophistication.',
  },
  {
    id: 'clickbait-pro',
    name: 'Clickbait Pro',
    description: 'Arrows, circles, shocked faces, bright yellow/red',
    promptStyle: 'Style: CLICKBAIT PRO — Maximum attention-grabbing design. THICK red arrows pointing at key elements, bright yellow circles with "?!" or "WOW", red/yellow color scheme, dramatic zoom effects. Include real recognizable objects, money bills, real brand logos, real product images where relevant. Everything screams "CLICK ME!"',
  },
  {
    id: 'tech-tutorial',
    name: 'Tech/Tutorial',
    description: 'Code snippets, gradients, clean professional look',
    promptStyle: 'Style: TECH/TUTORIAL — Professional developer aesthetic. Include REAL programming language logos (Python, JavaScript, React, etc.), real app/tool icons (VS Code, GitHub, Docker, AWS), real terminal/code snippets. Clean gradients (blue-purple or dark-teal). Floating UI elements, glassmorphism cards, circuit board patterns.',
  },
  {
    id: 'vlog-style',
    name: 'Vlog Style',
    description: 'Warm tones, lifestyle feel, personal touch',
    promptStyle: 'Style: VLOG — Warm golden-hour lighting, lifestyle photography feel, bokeh background. Include real recognizable locations, real food brands, real travel destinations, real everyday objects where relevant. Authentic and relatable, like an Instagram story cover. Hand-drawn doodles or sticker overlays for fun.',
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function buildPrompt(
  template: Template,
  videoMetadata: VideoMetadata,
  designOptions: DesignOptions,
  hasAvatarImage: boolean = false
): string {
  const isLandscape = designOptions.aspectRatio === 'landscape';
  const formatLabel = isLandscape ? 'long-form landscape 16:9' : 'YouTube Short portrait 9:16';

  const moodConfig = moodConfigs.find((m) => m.id === designOptions.mood);
  const headline = designOptions.headlineText || videoMetadata.title;

  // Build prompt as array of non-empty parts to avoid blank sections
  const parts: string[] = [];

  parts.push(`Generate a ${formatLabel} YouTube thumbnail image.`);
  parts.push(template.promptStyle);
  parts.push(`VIDEO TOPIC: "${videoMetadata.title}"${videoMetadata.author_name ? ` by ${videoMetadata.author_name}` : ''}`);
  parts.push('Design the thumbnail to visually represent this video topic using relevant real objects, brand logos, icons, and imagery.');

  // Mood
  if (moodConfig && moodConfig.id !== 'none') {
    parts.push(`MOOD: ${moodConfig.emoji} ${moodConfig.label.toUpperCase()} — Dominant accent: ${moodConfig.colorName} (${moodConfig.color}) on dark background. Use diagonal ${moodConfig.colorName} stripe in top-right, ${moodConfig.colorName} glow on subject, small ${moodConfig.colorName} dot in corner. All graphic elements in ${moodConfig.colorName} only.`);
  }

  // Typography — only add if at least one text option is on
  if (designOptions.showVideoTitle) {
    const textPos = designOptions.textPosition === 'top' ? 'TOP' : designOptions.textPosition === 'center' ? 'CENTER' : 'BOTTOM';
    const textColor = designOptions.fontColor === '#FFFFFF' ? 'pure white' : designOptions.fontColor;
    parts.push(`TEXT: Write exactly "${headline}" in LARGE BOLD UPPERCASE sans-serif (Impact style), ${textColor} with thick black outline and drop shadow, positioned at the ${textPos} of the image. Max 40% of canvas. Must be legible at small sizes.`);
  } else {
    parts.push('NO TEXT on the thumbnail. Pure visual only.');
  }

  if (designOptions.showChannelTitle && videoMetadata.author_name) {
    parts.push(`Also show "${videoMetadata.author_name}" in smaller subtle text.`);
  }

  // Subject
  if (designOptions.includeAvatar) {
    const position = isLandscape ? `${designOptions.avatarPosition.toUpperCase()} side of frame` : 'upper half of frame';
    const expression = moodConfig?.expression || 'engaging, expressive';
    const accentColor = moodConfig?.colorName || 'accent';

    if (hasAvatarImage) {
      parts.push(`PERSON: Use the attached photo as reference — reproduce MY EXACT face, skin tone, hair, and features. Make me recognizable.${designOptions.avatarDescription ? ` Additional: ${designOptions.avatarDescription}.` : ''} EXPRESSION: ${expression} — DRAMATIC and EXAGGERATED. Position: ${position}. ${accentColor} glow border, front-lit, high contrast, chest/waist up, dynamic pose. Generate a NEW composition using my likeness with the described expression and style.`);
    } else {
      const personDesc = designOptions.avatarDescription || 'A confident content creator';
      parts.push(`PERSON: ${personDesc}. EXPRESSION: ${expression} — DRAMATIC and EXAGGERATED. Position: ${position}. ${accentColor} glow border, front-lit, high contrast, chest/waist up, dynamic pose.`);
    }
  } else {
    parts.push('NO person. Use bold visual elements: real objects, product images, brand logos relevant to the topic, geometric shapes, light streaks, bokeh in accent color.');
  }

  // Background
  const bgColor = designOptions.backgroundColor === '#000000' ? 'dark black/charcoal' : designOptions.backgroundColor;
  let bgText = `BACKGROUND: ${bgColor}.`;
  if (designOptions.overlayOpacity > 0) {
    bgText += ` Dark overlay at ~${designOptions.overlayOpacity}% opacity for text readability.`;
  }
  parts.push(bgText);

  parts.push('Professional, click-worthy YouTube thumbnail. Bold, dramatic, high-contrast, eye-catching at small sizes.');

  return parts.join('\n\n');
}
