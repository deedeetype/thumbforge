import { Template, DesignOptions, VideoMetadata, moodConfigs } from '@/types';

export const templates: Template[] = [
  {
    id: 'bold-bright',
    name: 'Bold & Bright',
    description: 'High contrast, large text, vibrant colors, face close-ups',
    promptStyle: 'Style: vibrant, eye-catching, high contrast colors, large bold text overlays, energetic and attention-grabbing.',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dark tones, dramatic lighting, movie-poster style',
    promptStyle: 'Style: cinematic movie-poster aesthetic, dramatic lighting, dark moody tones, deep shadows, high production value.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, lots of whitespace, elegant typography',
    promptStyle: 'Style: clean minimalist design, elegant simple typography, one key focal element, limited color palette, sophisticated modern.',
  },
  {
    id: 'clickbait-pro',
    name: 'Clickbait Pro',
    description: 'Arrows, circles, shocked faces, bright yellow/red',
    promptStyle: 'Style: clickbait thumbnail, arrows pointing to key elements, circles highlighting details, dramatic contrast, irresistible to click.',
  },
  {
    id: 'tech-tutorial',
    name: 'Tech/Tutorial',
    description: 'Code snippets, gradients, clean professional look',
    promptStyle: 'Style: professional tech-focused, clean gradients, code snippets or tech UI elements, sleek modern appearance, blues and purples.',
  },
  {
    id: 'vlog-style',
    name: 'Vlog Style',
    description: 'Warm tones, lifestyle feel, personal touch',
    promptStyle: 'Style: warm personal vlog aesthetic, lifestyle feel, warm color tones, natural lighting, friendly approachable vibe.',
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function buildPrompt(
  template: Template,
  videoMetadata: VideoMetadata,
  designOptions: DesignOptions,
  hasAvatar: boolean
): string {
  const isLandscape = designOptions.aspectRatio === 'landscape';
  const dimensions = isLandscape ? '1280x720' : '1080x1920';
  const ratio = isLandscape ? '16:9 landscape' : '9:16 vertical/portrait';
  const formatLabel = isLandscape ? 'long-form' : 'short';

  const moodConfig = moodConfigs.find((m) => m.id === designOptions.mood);
  const headline = designOptions.headlineText || videoMetadata.title;

  // ===== BUILD THE PROMPT =====
  const prompt = `Generate a YouTube thumbnail image.

CRITICAL — Output dimensions: ${dimensions} pixels, ${ratio} aspect ratio. This is a ${formatLabel} YouTube thumbnail.
${isLandscape ? 'The image MUST be wider than tall (landscape orientation).' : 'The image MUST be taller than wide (portrait/vertical orientation, like a phone screen).'}

${template.promptStyle}

VIDEO CONTEXT (use this to make the thumbnail relevant to the actual video content):
- Video Title: "${videoMetadata.title}"
${videoMetadata.author_name ? `- Channel/Creator: "${videoMetadata.author_name}"` : ''}
Use the video title and channel context to determine the visual theme, relevant imagery, icons, and scene setting for the thumbnail. The thumbnail should clearly communicate what this video is about at a glance.

${moodConfig && moodConfig.id !== 'none' ? `COLOR PALETTE — Mood: ${moodConfig.emoji} ${moodConfig.label}
Use ONLY ${moodConfig.colorName} (${moodConfig.color}) as the dominant accent color throughout. Dark background base.

Accent Usage (mandatory):
- A diagonal accent stripe in the top-right corner using ${moodConfig.colorName}.
- A subtle ${moodConfig.colorName} glow or rim light around the main subject.
- A small decorative ${moodConfig.colorName} circle or dot element in one corner as a visual signature.
- Any graphic elements (arrows, shapes, icons) must use ${moodConfig.colorName} ONLY.
` : ''}TYPOGRAPHY:
${designOptions.showVideoTitle ? `- Large, bold, uppercase sans-serif headline text (Anton or Impact style).
- The headline reads exactly: "${headline}"
- Text color: ${designOptions.fontColor === '#FFFFFF' ? 'pure white' : designOptions.fontColor} with a thick black outline/stroke and a hard black drop shadow.
- Text positioned in the ${designOptions.textPosition === 'top' ? 'upper area of the image' : designOptions.textPosition === 'center' ? 'center of the image' : isLandscape ? 'lower-left area' : 'center-bottom area'}.
- Text should occupy no more than 40% of the canvas.` : '- Do NOT include any text or title in the thumbnail. Pure visual only.'}
${designOptions.showChannelTitle && videoMetadata.author_name ? `- Include the channel name "${videoMetadata.author_name}" in smaller, subtle text near the ${designOptions.textPosition === 'bottom' ? 'bottom' : 'top'} edge.` : ''}

SUBJECT / CHARACTER:
${hasAvatar && designOptions.includeAvatar ? `- This thumbnail features a PERSON (the uploaded avatar reference image).
- USE THE UPLOADED REFERENCE IMAGE as the person's likeness — match their face, features, and appearance.
- Facial expression: ${moodConfig?.expression || 'natural, engaging expression'}.
- ${isLandscape
    ? `Place the person on the ${designOptions.avatarPosition} side of the frame.`
    : 'Place the person in the upper half of the frame.'}
- The person should have a thin ${moodConfig?.colorName || 'accent'}-colored border or glow outlining them.
- Person should be bold, well-lit from the front, with high contrast against the dark background.
- Person should appear dynamic and expressive, NOT static or stiff.` :
designOptions.includeAvatar ? `- Include a character/person in the thumbnail.
- Facial expression: ${moodConfig?.expression || 'natural, engaging expression'}.
- ${isLandscape
    ? `Place the character on the ${designOptions.avatarPosition} side of the frame.`
    : 'Place the character in the upper half of the frame.'}
- Character should have a thin ${moodConfig?.colorName || 'accent'}-colored border or glow outlining them.
- Character should be bold, well-lit, high contrast, dynamic and expressive.` :
`- No person or character. Use abstract geometric shapes, light streaks, bokeh, or relevant visual elements in the accent color to fill the space.
- Keep composition dynamic and visually interesting. Use imagery relevant to the video topic.`}

BACKGROUND:
- Base background color: ${designOptions.backgroundColor === '#000000' ? 'deep dark/black' : designOptions.backgroundColor}.
${designOptions.overlayOpacity > 0 ? `- Apply a semi-transparent dark overlay at ~${designOptions.overlayOpacity}% opacity for text readability.` : ''}

FINAL REMINDER: The output image MUST be ${ratio} (${dimensions}px). ${isLandscape ? 'Landscape — wider than tall.' : 'Portrait — taller than wide.'}`;

  return prompt;
}
