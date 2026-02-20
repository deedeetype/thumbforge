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
  const dimensions = isLandscape ? '1280x720' : '1080x1920';
  const ratio = isLandscape ? '16:9 landscape' : '9:16 vertical portrait';
  const formatLabel = isLandscape ? 'long-form' : 'YouTube Short';

  const moodConfig = moodConfigs.find((m) => m.id === designOptions.mood);
  const headline = designOptions.headlineText || videoMetadata.title;

  const prompt = `Generate a single stunning YouTube thumbnail image.

=== MANDATORY FORMAT ===
Dimensions: ${dimensions} pixels (${ratio}).
This is a ${formatLabel} thumbnail.
${isLandscape
    ? 'The image MUST be in LANDSCAPE orientation — WIDER than tall. Horizontal rectangle.'
    : 'The image MUST be in PORTRAIT orientation — TALLER than wide. Vertical rectangle like a phone screen.'}

=== VISUAL STYLE ===
${template.promptStyle}

=== VIDEO CONTEXT (use this to determine visual theme and relevant imagery) ===
Video Title: "${videoMetadata.title}"
${videoMetadata.author_name ? `Channel: "${videoMetadata.author_name}"` : ''}
IMPORTANT: Base the thumbnail's visual elements, objects, icons, and scene on the actual video topic above. If the video is about cooking, show real food and kitchen tools. If about tech, show real devices and logos. If about finance, show real money, charts, brand logos. Make it RELEVANT.

${moodConfig && moodConfig.id !== 'none' ? `=== MOOD & COLOR ACCENT: ${moodConfig.emoji} ${moodConfig.label.toUpperCase()} ===
Dominant accent color: ${moodConfig.colorName} (${moodConfig.color}). Dark background base.
MANDATORY accent elements:
• Diagonal accent stripe in the top-right corner (${moodConfig.colorName})
• ${moodConfig.colorName} glow or rim light around the main subject
• Small decorative ${moodConfig.colorName} circle/dot in one corner as signature
• ALL graphic elements (arrows, shapes, icons, borders) use ${moodConfig.colorName} ONLY
` : ''}=== TYPOGRAPHY ===
${designOptions.showVideoTitle ? `• LARGE, BOLD, UPPERCASE sans-serif headline (Anton/Impact style)
• Headline text: "${headline}"
• Text color: ${designOptions.fontColor === '#FFFFFF' ? 'PURE WHITE' : designOptions.fontColor} with THICK black outline/stroke and hard black drop shadow
• Text position: ${designOptions.textPosition === 'top' ? 'TOP area of the image' : designOptions.textPosition === 'center' ? 'CENTER of the image' : isLandscape ? 'LOWER-LEFT area' : 'CENTER-BOTTOM area'}
• Text occupies max 40% of canvas
• Make the text POP — it must be readable even at small thumbnail size` : '• NO text whatsoever. Pure visual thumbnail.'}
${designOptions.showChannelTitle && videoMetadata.author_name ? `• Channel name "${videoMetadata.author_name}" in smaller subtle text near the ${designOptions.textPosition === 'top' ? 'top' : 'bottom'} edge` : ''}

=== SUBJECT / CHARACTER ===
${designOptions.includeAvatar ? `INCLUDE A PERSON in the thumbnail.
${hasAvatarImage ? `CRITICAL: The attached/uploaded reference image shows the EXACT person to use. You MUST use their face, features, skin tone, and likeness in the generated thumbnail. This is a reference photo — reproduce this person's appearance faithfully but in the thumbnail style described below.` : ''}
${designOptions.avatarDescription ? `Person appearance details: ${designOptions.avatarDescription}` : hasAvatarImage ? '' : 'A confident, expressive content creator.'}
FACIAL EXPRESSION (critical — override the reference photo expression): ${moodConfig?.expression || 'natural engaging expression'}
The expression must be EXAGGERATED and DRAMATIC — this is a YouTube thumbnail, not a passport photo. Even if the reference photo shows a neutral face, generate the person with the specified dramatic expression.
${isLandscape
    ? `Place the person on the ${designOptions.avatarPosition.toUpperCase()} side of the frame.`
    : 'Place the person in the UPPER HALF of the frame.'}
• Person has a thin ${moodConfig?.colorName || 'accent'}-colored glowing border/outline
• Bold front lighting, high contrast against dark background
• Person should look DYNAMIC — leaning in, gesturing, expressive body language
• Show from chest/waist up, not just a floating head
${hasAvatarImage ? `• IMPORTANT: Generate a NEW image in the thumbnail style — do NOT simply paste or crop the reference photo. Create a fresh composition using the person's likeness with the mood expression and all design elements described.` : ''}` :
`NO person or character.
Use bold visual elements relevant to the video topic:
• Real objects, real product images, real brand logos where appropriate
• Abstract geometric shapes, light streaks, bokeh in accent color
• 3D elements, floating icons, dramatic composition
• Make the scene visually STRIKING and immediately convey the video's topic`}

=== BACKGROUND ===
• Base color: ${designOptions.backgroundColor === '#000000' ? 'deep dark black/charcoal' : designOptions.backgroundColor}
${designOptions.overlayOpacity > 0 ? `• Semi-transparent dark overlay at ~${designOptions.overlayOpacity}% opacity for text readability` : ''}
• Background should complement the subject, not compete with it

=== FINAL RULES ===
• Output MUST be ${ratio} (${dimensions}px). ${isLandscape ? 'LANDSCAPE — wider than tall.' : 'PORTRAIT — taller than wide.'}
• Thumbnail must be eye-catching at SMALL sizes (like in YouTube's sidebar)
• Use REAL recognizable objects, logos, icons relevant to the topic — not generic clipart
• Bold, dramatic, high-contrast — this needs to compete for clicks on YouTube
• Professional quality, photorealistic or high-end digital art style`;

  return prompt;
}
