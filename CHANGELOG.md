# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - 2024-12-22

#### Transaction Review Page Improvements
- **Full-Screen Layout**: Refactored TransactionReview page to use full-screen layout without Layout wrapper
  - Removed Layout component wrapper from route definition
  - Changed from fixed positioning to scrollable layout with proper spacing
  - Improved mobile responsiveness and scrolling behavior
  - Better visual consistency with full-page experience

#### Transaction Management Enhancements
- **Remove Transaction Functionality**: Added ability to remove transactions from context
  - Added `removeTransaction` function to TransactionsContext
  - Enables better transaction lifecycle management
  - Supports future features requiring transaction deletion

#### Dashboard UI Improvements
- **Simplified Reward Display**: Refactored the investment details section in the Dashboard to improve UI consistency and reduce visual clutter
  - Removed separate "Reward frequency" row from the investment details table
  - Combined reward value and frequency into a single "Reward" field
  - Updated display format to show reward amount with frequency inline (e.g., "$2.14 every 24h")
  - Maintains all functionality while providing a cleaner, more compact interface

**Technical Details:**
- Modified `src/App.tsx` - Removed Layout wrapper from TransactionReview route
- Modified `src/pages/TransactionReview.tsx` - Changed layout from fixed to scrollable with proper spacing
- Modified `src/contexts/TransactionsContext.tsx` - Added removeTransaction function
- Simplified `CHANGELOG.md` structure for better maintainability

**Impact:**
- Better user experience with full-screen transaction review flow
- Improved transaction management capabilities
- Better visual hierarchy in the investment details section
- Reduced vertical space usage
- More intuitive information presentation

---

## Notes

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

