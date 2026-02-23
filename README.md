# Orokai Crypto Platform

A modern crypto investment platform built with React, TypeScript, and Vite.

## Features

### Transaction Management
- **Task-Driven Widget**: A new system to display interactive tasks at the top of the layout to guide users through essential actions.
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

### UI & UX Enhancements (Latest)
- **New Task-Driven Widget**: Introduced a interactive task widget at the top of the platform to guide users through essential actions.
- **Onboarding Experience Refinement**: Reimagined the mobile profile creation flow with a more intuitive vertical layout and better input focus management.
- **Dashboard Task List**: Added a "Do these first" task card to prompt users to complete their profile and other key actions.
- **Design System Expansion**: Added `Heading3` to the global typography system for better visual hierarchy.
- **Unified Avatar Navigation**: Integrated dynamic user avatars in the Dashboard's mobile view with support for both uploaded images and name-based initials.
- **My NFT Page & Modal Refinements**: 
  - Optimized the NFT minting flow with improved button layouts and a new "Nevermind" cancel action.
  - Refined description texts for both minted and non-minted states for better clarity on NFT rights and transfers.
  - Switched to an elegant `text-muted-foreground` aesthetic for descriptive content.
- **Affiliate Page Enhancements**:
  - Added instructional text to the referral link card to encourage sharing.
- **User Profile & Navigation**:
  - Integrated dynamic user avatars in the sidebar and Wallet page with support for both uploaded images and name-based initials.
- **Input Styling Refinement**: Updated global input components with themed backgrounds and better hover states.
- **Investments Page Layout**: Optimized vertical spacing on the investments page for a more compact and readable form.
- **Global Scrollbar Design**: Implemented a sleek, elegant custom scrollbar globally across the platform.
- **New SegmentedSwitch Component**: Introduced a generic, animated switch component using Framer Motion's `layoutId` for smooth transitions.
- **UI Polishing**: Replaced specialized selectors with the unified `SegmentedSwitch` across Dashboard, Transactions, and Analytics pages.
- **Simplified Navigation**: Refactored transaction filters for better visual density and smoother user experience.
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
