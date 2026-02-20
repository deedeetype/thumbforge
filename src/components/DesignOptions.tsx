'use client';

import { DesignOptions } from '@/types';
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
      <div className="space-y-4">

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
            <label className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
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

        {/* Avatar position (only if avatar enabled) */}
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
            Text Overlay Opacity: {options.overlayOpacity}%
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
