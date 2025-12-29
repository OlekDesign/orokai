# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

