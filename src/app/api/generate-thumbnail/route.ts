import { NextRequest, NextResponse } from 'next/server';
import { fetchVideoMetadata, isValidYouTubeUrl } from '@/lib/youtube';
import { getTemplate, buildPrompt } from '@/lib/templates';
import { generateThumbnailWithPoe } from '@/lib/poe';
import { GenerateThumbnailRequest, GenerateThumbnailResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateThumbnailRequest = await request.json();
    const { youtubeUrl, templateId } = body;

    // Validate inputs
    if (!youtubeUrl || !templateId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get template
    const template = getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Fetch video metadata
    const videoMetadata = await fetchVideoMetadata(youtubeUrl);

    // Build prompt
    const prompt = buildPrompt(template, videoMetadata);

    // Generate thumbnail with Poe API
    const imageUrl = await generateThumbnailWithPoe(prompt);

    const response: GenerateThumbnailResponse = {
      success: true,
      imageUrl,
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
