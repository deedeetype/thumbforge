import ThumbnailGenerator from '@/components/ThumbnailGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ThumbForge
          </h1>
          <p className="text-xl text-gray-400">
            AI-Powered YouTube Thumbnail Generator
          </p>
          <p className="mt-2 text-gray-500">
            Create stunning, click-worthy thumbnails in seconds
          </p>
        </div>

        {/* Main Generator */}
        <ThumbnailGenerator />

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Next.js, Tailwind CSS, and GPT-Image-1.5</p>
        </footer>
      </div>
    </main>
  );
}
