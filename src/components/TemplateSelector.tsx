'use client';

import { templates } from '@/lib/templates';
import Card from './ui/Card';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  disabled?: boolean;
}

export default function TemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
  disabled = false,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Choose a Style</h2>
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            disabled={disabled}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <h3 className="font-semibold text-white mb-1">{template.name}</h3>
            <p className="text-sm text-gray-400">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
