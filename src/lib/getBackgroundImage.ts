export type BackgroundImageType =
  | 'setup'
  | 'rewards'
  | 'freedom'
  | 'transparent'
  | 'oak';

const FILE_MAP: Record<BackgroundImageType, string> = {
  setup: 'setup.png',
  rewards: 'rewards.png',
  freedom: 'freedom.png',
  transparent: 'transparent.png',
  oak: 'oak.png',
};

export function getBackgroundImage(type: BackgroundImageType): string {
  return `${import.meta.env.BASE_URL}${FILE_MAP[type]}`;
}
