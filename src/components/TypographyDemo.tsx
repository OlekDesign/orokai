import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Typography, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  BodyText, 
  BodyTextLarge, 
  BodyTextSmall, 
  Label, 
  Caption, 
  Overline,
  Display 
} from "./ui/typography";

export function TypographyDemo() {
  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Typography System Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Display & Headings */}
          <section className="space-y-4">
            <Overline>Display & Headings</Overline>
            <div className="space-y-4">
              <Display>Display Text (Hero)</Display>
              <Heading1>Heading 1 - Page Titles</Heading1>
              <Heading2>Heading 2 - Section Headers</Heading2>
              <Heading3>Heading 3 - Subsections</Heading3>
              <Heading4>Heading 4 - Card Titles</Heading4>
            </div>
          </section>

          {/* Body Text */}
          <section className="space-y-4">
            <Overline>Body Text</Overline>
            <div className="space-y-4">
              <BodyTextLarge>
                Large body text for hero descriptions and important content. 
                This has relaxed line height for better readability.
              </BodyTextLarge>
              <BodyText>
                Regular body text for general content. This is the standard text size 
                with normal line height for comfortable reading.
              </BodyText>
              <BodyTextSmall>
                Small body text for secondary information, form descriptions, 
                and supporting content.
              </BodyTextSmall>
            </div>
          </section>

          {/* UI Text */}
          <section className="space-y-4">
            <Overline>UI Text</Overline>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Form Label</Label>
                <BodyText>Form labels are medium weight with tight line height</BodyText>
              </div>
              <div className="space-y-2">
                <Caption>Caption Text</Caption>
                <BodyText>For hints, metadata, and secondary information</BodyText>
              </div>
              <div className="space-y-2">
                <Overline>Overline Text</Overline>
                <BodyText>For categories, sections, and navigation</BodyText>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-4">
            <Overline>Real-world Examples</Overline>
            <Card>
              <CardHeader>
                <Heading3>Investment Card</Heading3>
                <Caption>Example with proper typography hierarchy</Caption>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Investment Amount</Label>
                  <Heading2 className="text-primary">$25,000</Heading2>
                  <Caption>Current Value</Caption>
                </div>
                <BodyTextSmall>
                  Your investment has grown by 7.8% APY since inception.
                </BodyTextSmall>
              </CardContent>
            </Card>
          </section>

          {/* All variants using Typography component */}
          <section className="space-y-4">
            <Overline>Typography Component API</Overline>
            <div className="space-y-2 font-mono text-sm bg-muted p-4 rounded">
              <div>&lt;Typography variant="display"&gt;Display&lt;/Typography&gt;</div>
              <div>&lt;Typography variant="heading-1"&gt;H1&lt;/Typography&gt;</div>
              <div>&lt;Typography variant="body"&gt;Body&lt;/Typography&gt;</div>
              <div>&lt;Typography variant="caption"&gt;Caption&lt;/Typography&gt;</div>
            </div>
            <BodyTextSmall className="text-muted-foreground">
              Or use convenience components: Heading1, BodyText, Caption, etc.
            </BodyTextSmall>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
