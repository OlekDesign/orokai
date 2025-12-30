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

### Developer Tools
- **Design System**: A comprehensive visual overview of all React components used in the project. Accessible at `#/design-system`.

## Recent Updates

### Design System & Component Unification (Latest)
- Added a new **Design System** page to visualize all project components in dark mode.
- Unified dropdown menu styles across the application (Affiliate and Dashboard).
- Standardized `StatsCard` and `Avatar` typography to match the brand aesthetic.
- Organized component library into Atoms, Molecules, Organisms, and Orphan components.

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
