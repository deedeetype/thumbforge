import { AspectRatio } from '@/types';

export async function generateThumbnailWithPoe(
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> {
  const apiKey = process.env.POE_API_KEY;

  if (!apiKey) {
    throw new Error('POE_API_KEY is not configured');
  }

  const aspectValue = aspectRatio === 'landscape' ? '16:9' : '9:16';

  try {
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Grok-Imagine-Image',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        aspect: aspectValue,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Poe API error:', JSON.stringify(errorData));
      throw new Error(`Poe API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Extract image URL from response
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return content.trim();
    }

    const markdownImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
    if (markdownImageMatch) {
      return markdownImageMatch[1];
    }

    const urlMatch = content.match(/(https?:\/\/[^\s\)\"\']+\.(png|jpg|jpeg|webp|gif)[^\s\)\"\']*)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    const anyUrlMatch = content.match(/(https?:\/\/[^\s\)\"\']+)/);
    if (anyUrlMatch) {
      return anyUrlMatch[1];
    }

    return content;
  } catch (error) {
    console.error('Error generating thumbnail with Poe:', error);
    if (error instanceof Error && error.message.startsWith('Poe API error:')) {
      throw error;
    }
    throw new Error('Failed to generate thumbnail. Please try again.');
  }
}
