# Orokai Crypto Platform

A modern crypto investment platform built with React, TypeScript, and Vite.

## Features

### Transaction Management
- **Pending Transactions**: Investment and withdrawal transactions start in pending state
- **Cancel Transactions**: Cancel pending transactions before they complete
- **Speed Up Transactions**: Instantly complete pending transactions instead of waiting
- **Transaction History**: View detailed transaction history with status tracking

### Wallet Management
- **Multi-Currency Support**: Support for ETH, BTC, SOL, USDT, and more
- **Card Management**: Add and manage payment cards
- **Withdrawal System**: Withdraw funds with pending transaction tracking

### Investment Features
- **Investment Tracking**: Track investments with APY and earnings
- **Investment Closure**: Close investments and track closure transactions
- **Reward System**: View and track investment rewards

## Recent Updates

### Pending Withdrawal Transactions (Latest)
- Withdrawal transactions now have a 20-second pending state
- Users can cancel or speed up pending withdrawals
- Consistent transaction handling across investment and withdrawal flows

See [CHANGELOG.md](./CHANGELOG.md) for full release history.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch.

Manual deployment:
```bash
npm run deploy
```

Live URL: https://olekdesign.github.io/orokai/

For detailed deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)
