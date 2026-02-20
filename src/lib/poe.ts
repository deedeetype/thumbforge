import { AspectRatio } from '@/types';

export async function generateThumbnailWithPoe(
  prompt: string,
  aspectRatio: AspectRatio,
  avatarDataUrl?: string
): Promise<string> {
  const apiKey = process.env.POE_API_KEY;

  if (!apiKey) {
    throw new Error('POE_API_KEY is not configured');
  }

  // GPT-Image-1.5 uses OpenAI-style size param: "WxH"
  const sizeValue = aspectRatio === 'landscape' ? '1536x1024' : '1024x1536';

  // Build message content
  let messageContent: string | Array<Record<string, unknown>>;

  if (avatarDataUrl) {
    messageContent = [
      {
        type: 'image_url',
        image_url: { url: avatarDataUrl },
      },
      {
        type: 'text',
        text: prompt,
      },
    ];
  } else {
    messageContent = prompt;
  }

  try {
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'GPT-Image-1.5',
        messages: [{ role: 'user', content: messageContent }],
        stream: false,
        size: sizeValue,
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

    // Extract image URL
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
