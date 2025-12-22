# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - 2024-12-22

#### UI/UX Enhancements
- **PageHeader Logo Display**: Added logo image display for "Orokai" title instead of text
  - Shows Orokai full white logo when title is "Orokai"
  - Maintains text display for other page titles
  - Improved brand consistency across the application

- **Card Component Padding Fix**: Fixed card content padding
  - Changed top padding from `pt-0` to `pt-6` for better visual spacing
  - Improved content readability and visual hierarchy

- **CreateProfile Photo Button**: Dynamic button text based on avatar state
  - Shows "Change photo" when avatar exists
  - Shows "Add a photo" when no avatar is set
  - Better user feedback and clarity

- **Investment Tables Layout Improvements**: Enhanced table layout across Dashboard, Investments, and Investments-empty pages
  - Removed separate "Frequency" column from investment tables
  - Combined reward value and frequency into a single "Rewards" column
  - Updated display format to show reward amount with frequency inline (e.g., "$2.14 every 24h")
  - Added responsive min-widths for better mobile/tablet display
  - Updated tooltip content to reflect combined information
  - Improved table responsiveness and visual consistency

- **Investments Page Enhancements**:
  - Added mobile drawer currency prioritization logic
  - Prioritizes selected currency options on first drawer open
  - Maintains user's sort order when currency changes
  - Changed withdraw button variant from `outline` to `secondary` for better visual consistency

- **TransactionReview Page Refinements**:
  - Increased checkbox icon size from `h-3 w-3` to `h-4 w-4` for better visibility
  - Removed unnecessary spacing (`pt-2`) from terms checkbox section
  - Improved visual consistency across all checkboxes

**Technical Details:**
- Modified `src/components/PageHeader.tsx`
- Modified `src/components/ui/card.tsx`
- Modified `src/pages/CreateProfile.tsx`
- Modified `src/pages/Dashboard.tsx`
- Modified `src/pages/Investments.tsx`
- Modified `src/pages/Investments-empty.tsx`
- Modified `src/pages/TransactionReview.tsx`

**Impact:**
- Better brand consistency with logo display
- Improved visual spacing and hierarchy
- More intuitive user interactions
- Cleaner, more compact table layouts
- Enhanced mobile experience with responsive design
- Better visual consistency across components

---

## Notes

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

