# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - 2024-12-XX

#### Transaction Details Dialog Enhancements
- **Enhanced Transaction Details Dialog**: Major improvements to transaction detail views with transaction-specific information and actions
  - Added action buttons for pending investment transactions ("Cancel Transaction" and "Speed Up")
  - Improved date/time formatting with compact display format (e.g., "15 Dec, 2:30 PM")
  - Transaction-specific detail sections:
    - **Investment transactions**: Shows payment source, fee, token, and status-specific details
    - **Reward transactions**: Displays investment amount, provider information
    - **Withdrawal transactions**: Shows withdrawal destination and fee details
  - Enhanced visual hierarchy with improved typography (Heading1 for amounts, muted labels)
  - Better status badge styling with improved color contrast for pending status

**Technical Details:**
- Modified `src/components/TransactionDetailsDialog.tsx`
- Added `formatCompactDate` function for improved date display
- Implemented conditional rendering based on transaction type
- Added Button component import for action buttons

**Impact:**
- More actionable transaction details for users
- Better information architecture with transaction-specific fields
- Improved user experience for managing pending investments

#### UI/UX Improvements
- **InfoTooltip Animation Enhancements**: Added smooth transition animations to info tooltip icons
  - Added `transition-colors duration-200 delay-100` classes to all InfoTooltip icons
  - Improved hover feedback with smooth color transitions
  - Applied consistently across Dashboard, Investments, and Investments-empty pages

- **CreateProfile Page Styling**: Updated background and button styling
  - Changed background from `bg-muted/50` to `bg-background` for better consistency
  - Updated file upload button variant from `outline` to `secondary`

**Technical Details:**
- Modified `src/components/InfoTooltip.tsx` (default iconClassName)
- Updated `src/pages/Dashboard.tsx` (10 InfoTooltip instances)
- Updated `src/pages/Investments.tsx` and `src/pages/Investments-empty.tsx` (multiple InfoTooltip instances)
- Modified `src/pages/CreateProfile.tsx` (background and button styling)

**Impact:**
- Smoother, more polished user interactions
- Consistent visual feedback across the application
- Better visual consistency with design system

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

