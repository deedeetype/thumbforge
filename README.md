# ThumbForge 🎨

AI-Powered YouTube Thumbnail Generator built with Next.js 14, TypeScript, and Grok-Imagine-Image.

## Features

- **YouTube Integration**: Extract video metadata from any YouTube URL (regular videos or Shorts)
- **AI-Powered Generation**: Uses Grok-Imagine-Image via Poe API to create stunning thumbnails
- **6 Aesthetic Templates**:
  - **Bold & Bright**: High contrast, vibrant colors, attention-grabbing
  - **Cinematic**: Movie-poster style with dramatic lighting
  - **Minimalist**: Clean, elegant, sophisticated design
  - **Clickbait Pro**: Shock value with arrows, circles, and bright colors
  - **Tech/Tutorial**: Professional look with code snippets and gradients
  - **Vlog Style**: Warm, personal, authentic feel
- **Session Gallery**: View all generated thumbnails in current session
- **Download & Regenerate**: Save thumbnails or try again with different styles
- **Dark Mode UI**: Modern, sleek interface inspired by top thumbnail creators

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Grok-Imagine-Image (via Poe API)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Poe API key (get one at [poe.com](https://poe.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deedeetype/thumbforge.git
cd thumbforge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Poe API key:
```
POE_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Paste YouTube URL**: Enter any YouTube video or Short URL
2. **Choose Style**: Select from 6 predefined aesthetic templates
3. **Generate**: Click "Generate Thumbnail" and wait for AI magic
4. **Download**: Save your thumbnail or regenerate with a different style
5. **Gallery**: View all generated thumbnails in the current session

## How It Works

1. **Video Metadata**: Extracts title, creator, and context from YouTube using oEmbed API
2. **Prompt Construction**: Combines template style guidelines with video metadata
3. **AI Generation**: Sends optimized prompt to Grok-Imagine-Image via Poe API
4. **Display**: Shows generated 1280x720 thumbnail optimized for YouTube

## Project Structure

```
thumbforge/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── ThumbnailGenerator.tsx  # Main component
│   │   ├── TemplateSelector.tsx    # Template picker
│   │   ├── VideoPreview.tsx        # Video metadata display
│   │   ├── ThumbnailGallery.tsx    # Generated thumbnails
│   │   └── ui/                     # Reusable UI components
│   ├── lib/                 # Utilities
│   │   ├── templates.ts    # Template definitions
│   │   ├── youtube.ts      # YouTube API helpers
│   │   └── poe.ts          # Poe API client
│   └── types/              # TypeScript types
│       └── index.ts
├── .env.local.example      # Environment variables template
└── README.md
```

## API Routes

### POST `/api/generate-thumbnail`

Generate a thumbnail from a YouTube URL and template.

**Request:**
```json
{
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "templateId": "cinematic"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://..."
}
```

## Templates

Each template provides specific style guidelines to the AI:

- **Bold & Bright**: Vibrant colors, high contrast, large text
- **Cinematic**: Dark tones, dramatic lighting, movie vibes
- **Minimalist**: Clean design, whitespace, elegant typography
- **Clickbait Pro**: Shock value, arrows, circles, bright colors
- **Tech/Tutorial**: Professional, code snippets, gradients
- **Vlog Style**: Warm tones, authentic, lifestyle feel

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POE_API_KEY` | Your Poe API key | Yes |

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your `POE_API_KEY` environment variable in your deployment settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Grok-Imagine-Image](https://poe.com/)
- Inspired by [thumbnailcreator.com](https://thumbnailcreator.com/)

## Author

**deedeetype**
- GitHub: [@deedeetype](https://github.com/deedeetype)

---

Made with ❤️ for YouTube creators
