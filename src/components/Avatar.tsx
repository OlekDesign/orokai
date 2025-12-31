import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  singleLetter?: boolean;
}

// Predefined color combinations for avatars
const avatarColors = [
  'bg-red-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-lime-500',
];

// Simple hash function to get consistent color for a name
function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

// Extract initials from full name
function getInitials(name: string = ''): string {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ name = '', size = 'md', className, singleLetter = false }: AvatarProps) {
  const initials = singleLetter 
    ? (name?.trim().charAt(0).toUpperCase() || '?')
    : getInitials(name);
  const bgColor = getColorForName(name || 'default');
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        bgColor,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
