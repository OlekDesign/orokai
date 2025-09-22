# Typography System

A comprehensive, semantic typography system for consistent text styling across the application.

## Quick Start

```tsx
import { Heading1, BodyText, Caption } from '@/components/ui/typography';

function MyComponent() {
  return (
    <div>
      <Heading1>Page Title</Heading1>
      <BodyText>This is body content with proper line height.</BodyText>
      <Caption>Secondary information</Caption>
    </div>
  );
}
```

## Available Components

### Headings
- `<Display>` - Hero/display text (text-5xl font-bold)
- `<Heading1>` - Page titles (text-3xl font-bold) 
- `<Heading2>` - Section headers (text-2xl font-semibold)
- `<Heading3>` - Subsections (text-xl font-semibold)
- `<Heading4>` - Card titles (text-lg font-medium)

### Body Text
- `<BodyTextLarge>` - Hero descriptions (text-lg leading-relaxed)
- `<BodyText>` - Standard content (text-base leading-normal)
- `<BodyTextSmall>` - Secondary content (text-sm leading-normal)

### UI Text
- `<Label>` - Form labels (text-sm font-medium)
- `<Caption>` - Hints, metadata (text-xs text-muted-foreground)
- `<Overline>` - Categories, navigation (text-xs font-medium uppercase)

## Advanced Usage

### Typography Component
```tsx
import { Typography } from '@/components/ui/typography';

<Typography variant="heading-2" as="h3" className="text-primary">
  Custom heading
</Typography>
```

### Custom Styling
```tsx
<Heading1 className="text-center text-primary mb-8">
  Centered primary heading
</Heading1>
```

## CSS Classes

You can also use the CSS classes directly:

```css
.text-heading-1    /* Display titles */
.text-heading-2    /* Section headers */
.text-body         /* Standard text */
.text-caption      /* Secondary text */
.text-label        /* Form labels */
.text-overline     /* Navigation */
```

## Migration Guide

### Before (Inconsistent)
```tsx
<h1 className="text-3xl font-bold tracking-tight">Title</h1>
<p className="text-lg text-muted-foreground leading-relaxed">Description</p>
<span className="text-xs text-muted-foreground">Caption</span>
```

### After (Semantic)
```tsx
<Heading1>Title</Heading1>
<BodyTextLarge className="text-muted-foreground">Description</BodyTextLarge>
<Caption>Caption</Caption>
```

## Benefits

✅ **Consistent hierarchy** - Clear heading levels
✅ **Proper line heights** - Optimized for readability  
✅ **Semantic HTML** - Better accessibility
✅ **Design system** - Single source of truth
✅ **Easy theming** - Change styles in one place
✅ **Type safety** - Catch errors at compile time
