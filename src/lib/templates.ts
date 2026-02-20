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
  const dimensions = isLandscape ? '1536x1024' : '1024x1536';
  const ratio = isLandscape ? '3:2 landscape' : '2:3 portrait';
  const formatLabel = isLandscape ? 'long-form' : 'YouTube Short';

  const moodConfig = moodConfigs.find((m) => m.id === designOptions.mood);
  const headline = designOptions.headlineText || videoMetadata.title;

  const prompt = `Generate a YouTube thumbnail image.

${template.promptStyle}

VIDEO TOPIC: "${videoMetadata.title}"${videoMetadata.author_name ? ` by ${videoMetadata.author_name}` : ''}
Design the entire thumbnail to visually represent this video topic. Use relevant real objects, real brand logos, real icons, and real-world imagery that match the subject matter.

${moodConfig && moodConfig.id !== 'none' ? `MOOD: ${moodConfig.emoji} ${moodConfig.label.toUpperCase()}
Dominant accent: ${moodConfig.colorName} (${moodConfig.color}) on dark background.
• Diagonal ${moodConfig.colorName} accent stripe in top-right corner
• ${moodConfig.colorName} glow/rim light on main subject
• Small ${moodConfig.colorName} dot in one corner
• All arrows/shapes/icons in ${moodConfig.colorName} only
` : ''}${designOptions.showVideoTitle ? `TEXT ON THE THUMBNAIL:
Write exactly these words on the image in large bold text: "${headline}"
The text must be:
• LARGE, BOLD, UPPERCASE, sans-serif font (Impact/Anton style)
• Color: ${designOptions.fontColor === '#FFFFFF' ? 'pure white' : designOptions.fontColor}
• Thick black outline and hard drop shadow
• Positioned at the ${designOptions.textPosition === 'top' ? 'TOP' : designOptions.textPosition === 'center' ? 'CENTER' : 'BOTTOM'} of the image
• Max 40% of canvas area
• Must be perfectly legible even at small sizes
` : 'NO TEXT on the thumbnail. Visual only.\n'}${designOptions.showChannelTitle && videoMetadata.author_name ? `Also include "${videoMetadata.author_name}" in smaller text.\n` : ''}${designOptions.includeAvatar ? `PERSON IN THUMBNAIL:
${hasAvatarImage ? `CRITICAL: I am attaching my photo as reference. You MUST reproduce MY EXACT face, skin tone, hair, and features in the generated thumbnail. Make me recognizable — this should look like ME, not a generic person.
${designOptions.avatarDescription ? `Additional details: ${designOptions.avatarDescription}` : ''}` : `${designOptions.avatarDescription ? `Person: ${designOptions.avatarDescription}` : 'A confident content creator.'}`}
EXPRESSION: ${moodConfig?.expression || 'engaging, expressive'}
Make the expression DRAMATIC and EXAGGERATED — wide eyes, open mouth, big gestures. This is a YouTube thumbnail, not a portrait photo.
Position: ${isLandscape ? `${designOptions.avatarPosition.toUpperCase()} side of frame` : 'upper half of frame'}
• ${moodConfig?.colorName || 'accent'}-colored glow border around the person
• Front-lit, high contrast against dark background
• Chest/waist up, dynamic pose, leaning in or gesturing
${hasAvatarImage ? '• Use my attached photo for face/likeness ONLY — generate a completely new composition with the expression and style described above.' : ''}` : `NO person. Fill the space with:
• Real objects, product images, brand logos relevant to the video topic
• Bold geometric shapes, light streaks, or bokeh in accent color
• Dynamic, eye-catching composition`}

BACKGROUND: ${designOptions.backgroundColor === '#000000' ? 'dark black/charcoal' : designOptions.backgroundColor}
${designOptions.overlayOpacity > 0 ? `Dark overlay at ~${designOptions.overlayOpacity}% opacity for text readability.` : ''}

This must look like a PROFESSIONAL, click-worthy YouTube thumbnail. Bold, dramatic, high-contrast. Eye-catching even at small sizes.`;

  return prompt;
}
