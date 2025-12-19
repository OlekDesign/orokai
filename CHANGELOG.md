# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-12-19

#### InfoTooltip Component Enhancement
- **Video Support**: Added video playback capability to InfoTooltip component
  - New `videoUrl` prop allows embedding videos in tooltips
  - Video player with controls, autoplay, and loop functionality
  - Responsive video container with aspect ratio preservation
  - Falls back to default video path if no URL provided

**Technical Details:**
- Modified `src/components/InfoTooltip.tsx`
- Added video element with controls and playsInline attributes
- Maintains backward compatibility with existing tooltip usage

**Impact:**
- Enables richer, more interactive tooltip content
- Better user education through video demonstrations
- Enhanced user experience for complex feature explanations

---

### Changed - 2025-12-19

#### Dashboard Chart Tooltip Improvements
- **Enhanced Tooltip Formatting**: Improved chart tooltip display in Dashboard
  - Added automatic year detection and display for date labels
  - Improved visual hierarchy with better text styling
  - Consolidated tooltip layout for better readability
  - Updated color scheme using CSS variables for consistency

**Technical Details:**
- Modified `src/pages/Dashboard.tsx`
- Enhanced CustomTooltip component with year formatting logic
- Improved styling with flexbox layout and proper spacing

**Impact:**
- More informative tooltips with complete date information
- Better visual consistency across the application
- Improved user experience when hovering over chart data points

---

#### Investments Page UI Refinements
- **Simplified Reward Display**: Consolidated reward information display
  - Removed redundant "Reward frequency" field
  - Combined reward value and frequency into single "Reward" field
  - Updated display format to show reward amount with frequency inline (e.g., "$2.14 every 24h")
  - Improved modal responsiveness for better mobile experience

**Technical Details:**
- Modified `src/pages/Investments.tsx`
- Reduced code complexity by removing duplicate UI elements
- Enhanced modal width handling for responsive design
- Updated padding and max-width constraints for better mobile support

**Impact:**
- Cleaner, more compact investment details interface
- Better mobile responsiveness
- Reduced visual clutter while maintaining all functionality

---

#### Transaction Review Crypto Support
- **Crypto Currency Conversion**: Added support for displaying amounts in cryptocurrency
  - Automatic conversion from USD to selected cryptocurrency for crypto wallet payments
  - Proper decimal formatting based on currency type (BTC: 6 decimals, ETH: 4 decimals, others: 2 decimals)
  - Consistent amount display across all transaction review fields
  - Maintains USD display for non-crypto payment methods

**Technical Details:**
- Modified `src/pages/TransactionReview.tsx`
- Added `convertToCrypto()` function for currency conversion
- Added `formatAmount()` function for consistent amount formatting
- Updated all amount displays (Investment Amount, Yearly Return, Transaction Fee, Total Due)

**Impact:**
- Better user experience for crypto wallet users
- Accurate currency conversion display
- Consistent formatting across all transaction amounts
- Proper decimal precision for different cryptocurrencies

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

