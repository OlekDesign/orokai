export type BackgroundImageType =
  | 'setup'
  | 'rewards'
  | 'freedom'
  | 'transparent'
  | 'oak'
  | 'staking-savings'
  | 'staking-different'
  | 'staking-earns'
  | 'staking-ready';

const FILE_MAP: Record<BackgroundImageType, string> = {
  setup: 'setup.png',
  rewards: 'rewards.png',
  freedom: 'freedom.png',
  transparent: 'transparent.png',
  oak: 'oak.png',
  'staking-savings': 'staking-savings.png',
  'staking-different': 'staking-different.png',
  'staking-earns': 'staking-earns.png',
  'staking-ready': 'staking-ready.png',
};

export function getBackgroundImage(type: BackgroundImageType): string {
  return `${import.meta.env.BASE_URL}${FILE_MAP[type]}`;
}
