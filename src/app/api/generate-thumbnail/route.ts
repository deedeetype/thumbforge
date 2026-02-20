import { NextRequest, NextResponse } from 'next/server';
import { fetchVideoMetadata, isValidYouTubeUrl } from '@/lib/youtube';
import { getTemplate, buildPrompt } from '@/lib/templates';
import { generateThumbnailWithPoe } from '@/lib/poe';
import { GenerateThumbnailRequest, GenerateThumbnailResponse, defaultDesignOptions } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateThumbnailRequest = await request.json();
    const { youtubeUrl, templateId, designOptions, avatarDataUrl } = body;

    if (!youtubeUrl || !templateId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const template = getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    const videoMetadata = await fetchVideoMetadata(youtubeUrl);
    const options = { ...defaultDesignOptions, ...designOptions };
    const hasAvatarImage = !!(options.includeAvatar && avatarDataUrl);
    const prompt = buildPrompt(template, videoMetadata, options, hasAvatarImage);

    console.log('Generated prompt:', prompt);

    const sendAvatar = options.includeAvatar && avatarDataUrl ? avatarDataUrl : undefined;
    const imageUrl = await generateThumbnailWithPoe(prompt, options.aspectRatio, sendAvatar);

    const response: GenerateThumbnailResponse = {
      success: true,
      imageUrl,
      videoMetadata,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in generate-thumbnail API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
