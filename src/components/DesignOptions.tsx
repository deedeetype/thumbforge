'use client';

import { DesignOptions, moodConfigs, MoodAccent, AspectRatio } from '@/types';
import Card from './ui/Card';

interface DesignOptionsProps {
  options: DesignOptions;
  onChange: (options: DesignOptions) => void;
  disabled?: boolean;
}

export default function DesignOptionsPanel({ options, onChange, disabled }: DesignOptionsProps) {
  const update = (patch: Partial<DesignOptions>) => {
    onChange({ ...options, ...patch });
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-4">Design Options</h2>
      <div className="space-y-5">

        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Video Format</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'landscape' as AspectRatio, label: '🖥️ Long Video', sub: '1280×720 (16:9)' },
              { id: 'portrait' as AspectRatio, label: '📱 Short', sub: '1080×1920 (9:16)' },
            ]).map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => update({ aspectRatio: fmt.id })}
                disabled={disabled}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  options.aspectRatio === fmt.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-medium text-white text-sm">{fmt.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{fmt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Accent */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mood & Accent Color</label>
          <div className="grid grid-cols-3 gap-2">
            {moodConfigs.map((mood) => (
              <button
                key={mood.id}
                onClick={() => update({ mood: mood.id as MoodAccent })}
                disabled={disabled}
                className={`p-2.5 rounded-lg border-2 text-center transition-all ${
                  options.mood === mood.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-lg">{mood.emoji}</div>
                <div className="text-xs text-white font-medium mt-1">{mood.label}</div>
                <div
                  className="w-3 h-3 rounded-full mx-auto mt-1"
                  style={{ backgroundColor: mood.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Headline Override */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Custom Headline <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={options.headlineText}
            onChange={(e) => update({ headlineText: e.target.value })}
            placeholder="Uses video title if empty"
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Font Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.fontColor}
                onChange={(e) => update({ fontColor: e.target.value })}
                disabled={disabled}
                className="w-8 h-8 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="text-xs text-gray-400 font-mono">{options.fontColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => update({ backgroundColor: e.target.value })}
                disabled={disabled}
                className="w-8 h-8 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="text-xs text-gray-400 font-mono">{options.backgroundColor}</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <Toggle
            label="Show Video Title"
            checked={options.showVideoTitle}
            onChange={(v) => update({ showVideoTitle: v })}
            disabled={disabled}
          />
          <Toggle
            label="Show Channel Name"
            checked={options.showChannelTitle}
            onChange={(v) => update({ showChannelTitle: v })}
            disabled={disabled}
          />
          <Toggle
            label="Include Avatar"
            checked={options.includeAvatar}
            onChange={(v) => update({ includeAvatar: v })}
            disabled={disabled}
          />
        </div>

        {/* Avatar position */}
        {options.includeAvatar && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Avatar Position</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => update({ avatarPosition: pos })}
                  disabled={disabled}
                  className={`flex-1 px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                    options.avatarPosition === pos
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text position */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Text Position</label>
          <div className="flex gap-2">
            {(['top', 'center', 'bottom'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => update({ textPosition: pos })}
                disabled={disabled}
                className={`flex-1 px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                  options.textPosition === pos
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Overlay opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Overlay Opacity: {options.overlayOpacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={options.overlayOpacity}
            onChange={(e) => update({ overlayOpacity: parseInt(e.target.value) })}
            disabled={disabled}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </Card>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center justify-between ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <span className="text-sm text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
