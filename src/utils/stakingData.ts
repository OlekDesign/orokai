// Helper function to format date based on time range
export const formatDate = (date: Date, timeRange: 'week' | 'month' | 'all'): string => {
  switch (timeRange) {
    case 'week':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    case 'month':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    case 'all':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    default:
      return date.toLocaleDateString();
  }
};

// Last 5 rewards data
export const rewardTransactions = [
  {
    id: '1',
    type: 'rewards',
    amount: 52.75,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Daily staking reward',
  },
  {
    id: '2',
    type: 'rewards',
    amount: 48.90,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Daily staking reward',
  },
  {
    id: '3',
    type: 'rewards',
    amount: 51.20,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    description: 'Daily staking reward',
  },
  {
    id: '4',
    type: 'rewards',
    amount: 49.95,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    description: 'Daily staking reward',
  },
  {
    id: '5',
    type: 'rewards',
    amount: 53.15,
    token: 'USDT',
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: 'Daily staking reward',
  },
];

// Generate chart data based on rewards and time range
export const generateChartData = (timeRange: 'week' | 'month' | 'all') => {
  const today = new Date();
  const data = [];
  let baseValue = 1000; // Initial investment of 1,000 USDT
  
  // Calculate total rewards up to the start date
  const totalPastRewards = 255.95; // Sum of the 5 rewards above
  baseValue += totalPastRewards;

  let daysToShow: number;
  switch (timeRange) {
    case 'week':
      daysToShow = 7;
      break;
    case 'month':
      daysToShow = 30;
      break;
    case 'all':
      daysToShow = 730; // 2 years
      break;
    default:
      daysToShow = 7;
  }

  for (let i = daysToShow - 1; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    
    // Find any rewards for this date
    const reward = rewardTransactions.find(tx => {
      const txDate = new Date(tx.timestamp);
      return txDate.toDateString() === currentDate.toDateString();
    });

    if (reward) {
      baseValue += reward.amount;
    }

    data.push({
      date: formatDate(currentDate, timeRange),
      value: Number(baseValue.toFixed(2)),
      reward: reward ? reward.amount : 0
    });
  }

  return data;
};