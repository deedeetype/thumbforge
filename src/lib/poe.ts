import OpenAI from 'openai';

export async function generateThumbnailWithPoe(
  prompt: string,
  avatarDataUrl?: string
): Promise<string> {
  const apiKey = process.env.POE_API_KEY;

  if (!apiKey) {
    throw new Error('POE_API_KEY is not configured');
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.poe.com/v1',
  });

  try {
    // Build messages - if avatar provided, include it as an image for reference
    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    if (avatarDataUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: avatarDataUrl },
          },
          {
            type: 'text',
            text: 'This is the avatar/person to include in the thumbnail. Use their likeness in the generated image.\n\n' + prompt,
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt,
      });
    }

    const response = await client.chat.completions.create({
      model: 'Grok-Imagine-Image',
      messages,
      stream: false,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Check if it's a direct URL
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return content.trim();
    }

    // Check for markdown image
    const markdownImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
    if (markdownImageMatch) {
      return markdownImageMatch[1];
    }

    // Check for URL in text
    const urlMatch = content.match(/(https?:\/\/[^\s\)\"\']+\.(png|jpg|jpeg|webp|gif)[^\s\)\"\']*)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Any URL at all
    const anyUrlMatch = content.match(/(https?:\/\/[^\s\)\"\']+)/);
    if (anyUrlMatch) {
      return anyUrlMatch[1];
    }

    // Return raw content as fallback
    return content;
  } catch (error) {
    console.error('Error generating thumbnail with Poe:', error);
    throw new Error('Failed to generate thumbnail. Please try again.');
  }
}
