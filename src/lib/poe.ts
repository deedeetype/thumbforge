import OpenAI from 'openai';

export async function generateThumbnailWithPoe(prompt: string): Promise<string> {
  const apiKey = process.env.POE_API_KEY;
  
  if (!apiKey) {
    throw new Error('POE_API_KEY is not configured');
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.poe.com/v1',
  });

  try {
    // For image generation bots, we send a chat completion with the prompt
    // The response will contain the image URL or base64 data
    const response = await client.chat.completions.create({
      model: 'Grok-Imagine-Image',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
    });

    // Extract the image content from the response
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // The content might be a URL or base64 image data
    // Check if it's a URL
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return content;
    }

    // Check if it contains a markdown image
    const markdownImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
    if (markdownImageMatch) {
      return markdownImageMatch[1];
    }

    // Check if it's just a URL in the text
    const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // If it's base64 or other format, return as-is
    // Frontend will handle display
    return content;
    
  } catch (error) {
    console.error('Error generating thumbnail with Poe:', error);
    throw new Error('Failed to generate thumbnail. Please try again.');
  }
}
