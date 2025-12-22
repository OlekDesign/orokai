# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-XX

#### Transaction Details Dialog
- **New Component**: Created `TransactionDetailsDialog` component for viewing detailed transaction information
  - Displays comprehensive transaction details including status, date, time, token, and transaction ID
  - Visual status indicators with icons (completed, pending, failed)
  - Color-coded transaction type icons (rewards, withdrawals, investments, top-ups, internal transfers)
  - Error details display for failed transactions
  - Responsive design with mobile and desktop layouts

#### Enhanced Transaction Interactions
- **Clickable Transaction Rows**: Transaction rows are now clickable across Dashboard, Transactions, and Wallet pages
  - Added onClick handler support to `TransactionRow` component
  - Hover effects for better UX feedback
  - Opens transaction details dialog on click
  - Integrated in Dashboard, Transactions, and Wallet pages

#### Expanded Cryptocurrency Support
- **Additional Cryptocurrencies**: Added support for 6 new cryptocurrencies in TransactionReview page
  - USDT (Tether)
  - USDC (USD Coin)
  - ATOM (Cosmos)
  - MATIC (Polygon)
  - AVAX (Avalanche)
  - DOT (Polkadot)
  - Scrollable currency selection dropdown with custom scrollbar styling
  - Improved mobile responsiveness with max-height constraints

### Changed - 2024-12-XX

#### Dashboard UI Improvements
- **Simplified Reward Display**: Refactored the investment details section in the Dashboard to improve UI consistency and reduce visual clutter
  - Removed separate "Reward frequency" row from the investment details table
  - Combined reward value and frequency into a single "Reward" field
  - Updated display format to show reward amount with frequency inline (e.g., "$2.14 every 24h")
  - Maintains all functionality while providing a cleaner, more compact interface
- **Button Styling**: Updated "See rewards history" button from ghost variant to link variant for better visual consistency
- **Investment Modal**: Improved responsive design with better padding and max-width constraints

#### Transaction Context Enhancements
- **Failed Transaction Support**: Added failed transaction examples to demo data
- **Transaction Status Handling**: Enhanced transaction status display and filtering

#### Styling Improvements
- **Custom Scrollbar**: Added custom scrollbar styling for currency selection dropdowns
- **CSS Enhancements**: Added scrollbar utility classes to `index.css`

### Technical Details
- Created `src/components/TransactionDetailsDialog.tsx`
- Modified `src/components/TransactionRow.tsx` - Added onClick prop support
- Modified `src/pages/Dashboard.tsx` - Integrated transaction details dialog
- Modified `src/pages/Transactions.tsx` - Added clickable rows and dialog integration
- Modified `src/pages/TransactionReview.tsx` - Expanded cryptocurrency options and improved scrolling
- Modified `src/pages/Wallet.tsx` - Enhanced transaction interactions
- Modified `src/contexts/TransactionsContext.tsx` - Added failed transaction support
- Modified `src/index.css` - Added scrollbar styling utilities
- Removed `DEPLOYMENT_SUMMARY.md` - Consolidated documentation

### Impact
- Improved user experience with detailed transaction views
- Better accessibility with clickable transaction rows
- Expanded cryptocurrency support for broader user base
- Enhanced mobile responsiveness
- Cleaner, more maintainable code structure

---

## Notes

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

