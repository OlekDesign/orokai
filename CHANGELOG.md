# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-01-XX

#### Pending Withdrawal Transactions with Cancel and Speed Up
- **Pending Withdrawal State**: Withdrawal transactions now start in pending state for 20 seconds (matching investment transaction pattern)
- **Cancel Transaction**: Users can cancel pending withdrawal transactions, which removes the transaction and keeps funds available
- **Speed Up Transaction**: Users can immediately complete pending withdrawal transactions instead of waiting for the 20-second timeout
- **Transaction Management**: Enhanced TransactionsContext to support different timeout durations (20s for withdrawals, 10s for investments)
- **Fund Management**: Funds are only deducted when withdrawal transaction completes (either after timeout or when sped up)
- **UI Consistency**: Cancel and Speed Up buttons appear in TransactionDetailsDialog for pending withdrawal transactions, matching the investment transaction UI

**Technical Details:**
- Modified `src/contexts/TransactionsContext.tsx` - Added timeout management, `completeTransaction()` method, and timeout cancellation support
- Modified `src/pages/Wallet.tsx` - Updated withdrawal handler to create pending transactions immediately, added tracking for multiple pending withdrawals
- Modified `src/components/TransactionDetailsDialog.tsx` - Added Cancel/Speed Up buttons and handlers for pending withdrawal transactions
- Withdrawal transactions auto-complete after 20 seconds if not cancelled or sped up

**Impact:**
- Better user control over withdrawal transactions
- Consistent transaction handling across investment and withdrawal flows
- Improved user experience with ability to cancel or speed up pending transactions

### Fixed - 2025-01-XX

#### Wallet Page Loading and Display Improvements
- **Fixed Wallet Page Loading**: Resolved issue where Wallet.tsx component failed to load
  - Replaced undefined `getCryptoIcon` function with proper icon mapping
  - Added React import for proper type support
- **Crypto Icon Design Consistency**: Updated crypto icons to match TransactionReview.tsx design
  - ETH displays as emoji (⟠) with text-xl styling
  - BTC displays as emoji (₿) with text-xl styling  
  - USDT and other currencies use Coins icon component
  - Consistent styling across wallet and transaction review pages
- **Table Layout Improvements**:
  - Removed Price column from crypto assets table for cleaner display
  - Reordered balance display: USD value now appears above crypto amount
  - Balance column aligns right on mobile, left on desktop
  - Improved visual hierarchy and readability
- **Wallet Display Updates**:
  - Changed crypto wallet from clickable button to non-clickable div with border
  - Removed background from wallet container (transparent)
  - Aligned Copy button with wallet address text
  - Made Copy button smaller (h-5 w-5) with reduced icon size
  - Removed gap between wallet address and MetaMask label
- **Text Size Consistency**:
  - Updated all wallet and transaction text to use `text-foreground` for consistent sizing
  - Wallet address, card numbers, and crypto symbols now match Investment text size
  - Removed custom font weights to maintain design consistency
- **Add Payment Method Dialog**:
  - Fixed padding-top to 24px (pt-6)
  - Added close button in top-right corner

**Technical Details:**
- Modified `src/pages/Wallet.tsx` - Fixed loading issue, updated icon system, improved table layout, wallet display improvements
- Modified `src/pages/Wallet-empty.tsx` - Fixed dialog padding and added close button
- Removed dependency on CryptoIcon component in favor of inline icon mapping
- Added `getCryptoIcon` helper function matching TransactionReview.tsx pattern

**Impact:**
- Wallet page now loads correctly
- Consistent crypto icon design across platform
- Better balance information display
- Cleaner table layout
- Improved wallet display consistency
- Better mobile responsiveness

---

### Changed - 2025-01-XX

#### Investments Page Input Improvements
- **Currency-Aware Input**: Investment amount input now displays value in selected currency
  - Shows `$10,000` for USD or `10,000 ETH` for crypto currencies
  - Placeholder updates dynamically based on selected currency
  - Input value formatting matches currency selector display
- **Text Size Consistency**: Updated input text size to match currency selector
  - Changed from `text-xl font-semibold` to `text-sm font-medium`
  - Consistent typography across investment form elements

**Technical Details:**
- Modified `src/pages/Investments.tsx` - Updated input value display and text sizing

**Impact:**
- Better user experience with currency-aware input
- Consistent typography across form elements
- Clearer indication of selected currency

---

### Changed - 2025-01-XX

#### Date Formatting and UI Improvements
- **Date Format Update**: Changed date display format from `DD/MM/YYYY` to `DD MMM YYYY` (e.g., "29 Dec 2025")
  - Applied to all transaction dates in Dashboard and Transactions pages
  - More readable and user-friendly date format
- **Wallet Component Fixes**:
  - Fixed Wallet component not rendering when profile is null
  - Removed chevron icon from crypto wallet button
  - Updated credit card button to show "No credit card added" when empty
  - Added 24px padding to Payment Methods dialog
  - Changed dialog title to use Heading2 typography
- **Card Management**:
  - Added new card form that appears when no cards exist
  - Updated form fields: Card Number, Card Holder Name, Expiry Date, Security Code
  - Expiry Date and Security Code fields are displayed side-by-side
  - Added proper form validation and formatting
- **Transaction Details**:
  - Updated transaction failure message to include fund return information
  - Prevented auto-focus on transaction details dialog close button
- **Investments Table Enhancements**:
  - Added dropdown menu to investments table with "Close this investment" option
  - Changed Close button to more icon (three vertical dots) button
  - Updated "Next reward" column to show reward value and time (e.g., "$2.14 in 3h 32min")
  - Flipped column order: Next reward now appears before All rewards
  - Renamed "Rewards" column to "All rewards"
  - Removed Actions column header label
  - Improved mobile layout spacing with proper row gaps (mt-6)

**Technical Details:**
- Modified `src/components/TransactionRow.tsx` - Updated date formatting
- Modified `src/components/TransactionDetailsDialog.tsx` - Updated messages and focus behavior
- Modified `src/pages/Wallet.tsx` - Fixed rendering, added card form, improved UI
- Modified `src/pages/Investments.tsx` - Added menu, updated columns, improved mobile layout

**Impact:**
- Better date readability across the platform
- Improved wallet management experience
- Enhanced investments table functionality
- Better mobile user experience

---

### Added - 2025-01-XX

#### Closure Transaction Type
- **New Transaction Type**: Added "Closure" transaction type to track investment closures
  - Automatically created when users close an investment on the Investments page
  - Initially shows as "pending" status
  - Automatically transitions to "completed" status after 10 seconds
  - Displays with XCircle icon and destructive styling (red) to indicate fund withdrawal
  - Shows negative amount format (e.g., "-$10,000") to indicate funds being returned
  - Full transaction details available in transaction dialog

**Technical Details:**
- Added `'closure'` to `TransactionType` in `src/types/index.ts`
- Updated `TransactionRow` component to handle closure transactions with proper icon, label, and styling
- Updated `TransactionDetailsDialog` to display closure-specific transaction details
- Integrated closure transaction creation in `Investments.tsx` when investment is closed
- Added `getTokenForChain` helper function to map blockchain chains to token symbols

**Files Modified:**
- `src/types/index.ts` - Added closure transaction type
- `src/components/TransactionRow.tsx` - Added closure handling
- `src/components/TransactionDetailsDialog.tsx` - Added closure details view
- `src/pages/Investments.tsx` - Added transaction creation on investment closure

**Impact:**
- Users can now track when investments are closed
- Better transaction history visibility
- Consistent transaction tracking across the platform

---

### Changed - 2025-01-XX

#### Card Component Spacing
- **Reduced Card Padding**: Updated default padding-top for `CardContent` component
  - Changed from `pt-6` (24px) to `pt-2` (8px) for tighter spacing
  - Applies to all cards using default `CardContent` padding
  - Reduces vertical space between card headers and content
  - Improves visual density and information hierarchy

**Technical Details:**
- Modified `src/components/ui/card.tsx`
- Updated both mobile (`pt-2`) and desktop (`sm:pt-2`) breakpoints
- Cards with custom padding overrides remain unchanged

**Impact:**
- More compact card layouts
- Better use of vertical space
- Improved visual consistency across cards

---

### Changed - 2024-12-XX

#### Dashboard UI Improvements
- **Simplified Reward Display**: Refactored the investment details section in the Dashboard to improve UI consistency and reduce visual clutter
  - Removed separate "Reward frequency" row from the investment details table
  - Combined reward value and frequency into a single "Reward" field
  - Updated display format to show reward amount with frequency inline (e.g., "$2.14 every 24h")
  - Maintains all functionality while providing a cleaner, more compact interface

**Technical Details:**
- Modified `src/pages/Dashboard.tsx`
- Reduced code complexity by removing redundant UI elements
- Improved user experience with consolidated information display

**Impact:**
- Better visual hierarchy in the investment details section
- Reduced vertical space usage
- More intuitive information presentation

---

## Notes

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

