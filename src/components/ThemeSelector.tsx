import React, { useState } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { Theme, CustomTheme } from '../hooks/useTheme';

interface ThemeSelectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onCustomThemeChange?: (colors: CustomTheme) => void;
}

export function ThemeSelector({ theme, onThemeChange, onCustomThemeChange }: ThemeSelectorProps) {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [tempCustomTheme, setTempCustomTheme] = useState<CustomTheme>({
    primary: '#4F46E5',
    secondary: '#6B7280',
    background: '#F3F4F6',
    text: '#1F2937',
    accent: '#818CF8'
  });

  const handleCustomThemeChange = (key: keyof CustomTheme, value: string) => {
    setTempCustomTheme(prev => ({ ...prev, [key]: value }));
    onCustomThemeChange?.({ ...tempCustomTheme, [key]: value });
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <button
          onClick={() => onThemeChange('light')}
          className={`p-2 rounded-lg ${
            theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
          } hover:bg-indigo-50 transition-colors`}
          title="Light Mode"
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
          } hover:bg-indigo-50 transition-colors`}
          title="Dark Mode"
        >
          <Moon className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setShowCustomizer(!showCustomizer);
            if (!showCustomizer) onThemeChange('custom');
          }}
          className={`p-2 rounded-lg ${
            theme === 'custom' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
          } hover:bg-indigo-50 transition-colors`}
          title="Custom Theme"
        >
          <Palette className="w-5 h-5" />
        </button>
      </div>

      {showCustomizer && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-64">
          <h3 className="text-sm font-semibold mb-3">Customize Theme</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Primary Color</label>
              <input
                type="color"
                value={tempCustomTheme.primary}
                onChange={(e) => handleCustomThemeChange('primary', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Secondary Color</label>
              <input
                type="color"
                value={tempCustomTheme.secondary}
                onChange={(e) => handleCustomThemeChange('secondary', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Background Color</label>
              <input
                type="color"
                value={tempCustomTheme.background}
                onChange={(e) => handleCustomThemeChange('background', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Text Color</label>
              <input
                type="color"
                value={tempCustomTheme.text}
                onChange={(e) => handleCustomThemeChange('text', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Accent Color</label>
              <input
                type="color"
                value={tempCustomTheme.accent}
                onChange={(e) => handleCustomThemeChange('accent', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
          <button
            onClick={() => setShowCustomizer(false)}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Theme</span>
          </button>
        </div>
      )}
    </div>
  );
}