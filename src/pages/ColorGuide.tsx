import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../contexts/ToastContext';

interface ColorItem {
  name: string;
  cssVar: string;
  lightHex: string;
  darkHex: string;
  description?: string;
}

const colorCategories = {
  'Background & Layout': [
    {
      name: 'Background',
      cssVar: '--background',
      lightHex: '#FFFFFF',
      darkHex: '#171717',
      description: 'Main background color'
    },
    {
      name: 'Foreground',
      cssVar: '--foreground',
      lightHex: '#343434',
      darkHex: '#FAFAFA',
      description: 'Primary text color'
    },
    {
      name: 'Faded',
      cssVar: '--faded',
      lightHex: '#E5E5E5',
      darkHex: '#E5E5E5',
      description: 'Faded/disabled elements'
    },
    {
      name: 'Card',
      cssVar: '--card',
      lightHex: '#FFFFFF',
      darkHex: '#1A1A1A',
      description: 'Card background'
    },
    {
      name: 'Card Foreground',
      cssVar: '--card-foreground',
      lightHex: '#343434',
      darkHex: '#FAFAFA',
      description: 'Card text color'
    },
    {
      name: 'Popover',
      cssVar: '--popover',
      lightHex: '#FFFFFF',
      darkHex: '#171717',
      description: 'Popover background'
    },
    {
      name: 'Popover Foreground',
      cssVar: '--popover-foreground',
      lightHex: '#343434',
      darkHex: '#FAFAFA',
      description: 'Popover text color'
    }
  ],
  'Primary & Secondary': [
    {
      name: 'Primary',
      cssVar: '--primary',
      lightHex: '#0EA5E9',
      darkHex: '#CBB9B9',
      description: 'Primary brand color'
    },
    {
      name: 'Primary Foreground',
      cssVar: '--primary-foreground',
      lightHex: '#FAFAFA',
      darkHex: '#171717',
      description: 'Text on primary background'
    },
    {
      name: 'Secondary',
      cssVar: '--secondary',
      lightHex: '#EBEBEB',
      darkHex: '#2B2B2B',
      description: 'Secondary background'
    },
    {
      name: 'Secondary Foreground',
      cssVar: '--secondary-foreground',
      lightHex: '#343434',
      darkHex: '#FAFAFA',
      description: 'Text on secondary background'
    }
  ],
  'Muted & Accent': [
    {
      name: 'Muted',
      cssVar: '--muted',
      lightHex: '#EBEBEB',
      darkHex: '#212121',
      description: 'Muted background'
    },
    {
      name: 'Muted Foreground',
      cssVar: '--muted-foreground',
      lightHex: '#8E8E8E',
      darkHex: '#B5B5B5',
      description: 'Muted text color'
    },
    {
      name: 'Accent',
      cssVar: '--accent',
      lightHex: '#EBEBEB',
      darkHex: '#262626',
      description: 'Accent background'
    },
    {
      name: 'Accent Foreground',
      cssVar: '--accent-foreground',
      lightHex: '#343434',
      darkHex: '#FAFAFA',
      description: 'Text on accent background'
    }
  ],
  'Status Colors': [
    {
      name: 'Destructive',
      cssVar: '--destructive',
      lightHex: '#EF4444',
      darkHex: '#9C1A1A',
      description: 'Error/danger color'
    },
    {
      name: 'Destructive Foreground',
      cssVar: '--destructive-foreground',
      lightHex: '#FAFAFA',
      darkHex: '#FAFAFA',
      description: 'Text on destructive background'
    },
    {
      name: 'Success',
      cssVar: '--success',
      lightHex: '#16A34A',
      darkHex: '#1AE66F',
      description: 'Success color'
    },
    {
      name: 'Success Foreground',
      cssVar: '--success-foreground',
      lightHex: '#FAFAFA',
      darkHex: '#FAFAFA',
      description: 'Text on success background'
    },
    {
      name: 'Warning',
      cssVar: '--warning',
      lightHex: '#FACC15',
      darkHex: '#FACC15',
      description: 'Warning color'
    },
    {
      name: 'Warning Foreground',
      cssVar: '--warning-foreground',
      lightHex: '#451A03',
      darkHex: '#451A03',
      description: 'Text on warning background'
    },
    {
      name: 'Info',
      cssVar: '--info',
      lightHex: '#0EA5E9',
      darkHex: '#0EA5E9',
      description: 'Info color'
    },
    {
      name: 'Info Foreground',
      cssVar: '--info-foreground',
      lightHex: '#FAFAFA',
      darkHex: '#FAFAFA',
      description: 'Text on info background'
    }
  ],
  'Borders & Inputs': [
    {
      name: 'Border',
      cssVar: '--border',
      lightHex: '#DEDEDE',
      darkHex: '#262626',
      description: 'Border color'
    },
    {
      name: 'Input',
      cssVar: '--input',
      lightHex: '#DEDEDE',
      darkHex: '#2E2E2E',
      description: 'Input border color'
    },
    {
      name: 'Ring',
      cssVar: '--ring',
      lightHex: '#343434',
      darkHex: '#707070',
      description: 'Focus ring color'
    }
  ]
};

const ColorCard: React.FC<{ color: ColorItem; isDark: boolean }> = ({ color, isDark }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const hexValue = isDark ? color.darkHex : color.lightHex;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('success', 'Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('error', 'Failed to copy');
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" 
          onClick={() => copyToClipboard(hexValue)}>
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-border flex-shrink-0 group-hover:scale-105 transition-transform"
          style={{ backgroundColor: hexValue }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">{color.name}</h3>
            <span className={`text-xs px-2 py-1 rounded transition-colors ${
              copied ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {copied ? 'Copied!' : hexValue}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">{color.cssVar}</p>
          {color.description && (
            <p className="text-xs text-muted-foreground opacity-75">{color.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export const ColorGuide: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <PageHeader title="Color Guide" />
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Design system colors for the crypto platform. Click any color to copy its hex value.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={toggleTheme}
            className="ml-4"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </Button>
        </div>

        <div className="grid gap-8">
          {Object.entries(colorCategories).map(([categoryName, colors]) => (
            <div key={categoryName} className="space-y-4">
              <div className="border-b border-border pb-2">
                <h2 className="text-heading-3 font-semibold">{categoryName}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {colors.length} color{colors.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color) => (
                  <ColorCard 
                    key={color.cssVar} 
                    color={color} 
                    isDark={isDarkMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="p-6 bg-muted/50">
          <h3 className="text-heading-4 mb-3">Usage Instructions</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Click any color</strong> to copy its hex value to clipboard</p>
            <p>• <strong>CSS Variables:</strong> Use <code className="bg-background px-1 py-0.5 rounded text-xs">hsl(var(--variable-name))</code> in CSS</p>
            <p>• <strong>Tailwind:</strong> Use utility classes like <code className="bg-background px-1 py-0.5 rounded text-xs">bg-primary</code>, <code className="bg-background px-1 py-0.5 rounded text-xs">text-foreground</code></p>
            <p>• <strong>Toggle theme</strong> to see how colors adapt between light and dark modes</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ColorGuide;
