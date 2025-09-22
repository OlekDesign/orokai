import * as React from "react"
import { cn } from "@/lib/utils"

// Typography variant types
export type TypographyVariant = 
  | "display"
  | "heading-1" 
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "body-large"
  | "body"
  | "body-small"
  | "label"
  | "caption"
  | "overline"

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  as?: React.ElementType
  children: React.ReactNode
}

const typographyVariants: Record<TypographyVariant, string> = {
  display: "text-display",
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2", 
  "heading-3": "text-heading-3",
  "heading-4": "text-heading-4",
  "body-large": "text-body-large",
  body: "text-body",
  "body-small": "text-body-small",
  label: "text-label",
  caption: "text-caption",
  overline: "text-overline"
}

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3", 
  "heading-4": "h4",
  "body-large": "p",
  body: "p",
  "body-small": "p", 
  label: "label",
  caption: "span",
  overline: "span"
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body", as, className, children, ...props }, ref) => {
    const Component = as || defaultElements[variant]
    
    return React.createElement(
      Component,
      {
        ref,
        className: cn(typographyVariants[variant], className),
        ...props
      },
      children
    )
  }
)

Typography.displayName = "Typography"

// Convenience components for common use cases
export const Heading1 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="heading-1" {...props} />
)
Heading1.displayName = "Heading1"

export const Heading2 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="heading-2" {...props} />
)
Heading2.displayName = "Heading2"

export const Heading3 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="heading-3" {...props} />
)
Heading3.displayName = "Heading3"

export const Heading4 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="heading-4" {...props} />
)
Heading4.displayName = "Heading4"

export const BodyText = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="body" {...props} />
)
BodyText.displayName = "BodyText"

export const BodyTextLarge = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="body-large" {...props} />
)
BodyTextLarge.displayName = "BodyTextLarge"

export const BodyTextSmall = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="body-small" {...props} />
)
BodyTextSmall.displayName = "BodyTextSmall"

export const Label = React.forwardRef<HTMLLabelElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="label" {...props} />
)
Label.displayName = "Label"

export const Caption = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="caption" {...props} />
)
Caption.displayName = "Caption"

export const Overline = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="overline" {...props} />
)
Overline.displayName = "Overline"

export const Display = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="display" {...props} />
)
Display.displayName = "Display"
