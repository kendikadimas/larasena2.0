# Larasena Landing Page - Design Specs & Assets

## 🎨 Complete Design System

### Color Specifications

#### Primary Palette
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Navy (Deep) | #1A332F | 26, 51, 47 | Headings, Primary CTAs |
| Navy (Dark) | #2C5E54 | 44, 94, 84 | Secondary buttons, Backgrounds |
| Sage Green | #3A7F75 | 58, 127, 117 | Accent gradients, Hovers |

#### Warm Palette
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Cream | #FBF8F1 | 251, 248, 241 | Main background |
| Soft Cream | #F5E6D3 | 245, 230, 211 | Section backgrounds |
| Pale Sand | #FEF5EC | 254, 245, 236 | Hero gradient |
| Earthy Brown | #8B6F47 | 139, 111, 71 | Text, Details |
| Warm Brown | #A68066 | 166, 128, 102 | Secondary details |
| Dark Brown | #6B5B47 | 107, 91, 71 | Shadows |

#### Accent Palette
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Gold | #D4A574 | 212, 165, 116 | Premium accents |
| Light Gold | #E8D5C4 | 232, 213, 196 | Soft backgrounds |
| Muted Gold | #C9BFB5 | 201, 191, 181 | Subtle decorations |
| Amber | #FCD34D | 252, 211, 77 | CTA button (golden) |

---

### Typography System

#### Font Stack
```css
/* Headings (Serif) */
font-family: 'Georgia', 'Playfair Display', serif;

/* Body (Sans-serif) */
font-family: 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;
```

#### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 48-64px | 600 | 1.2 |
| H2 (Section) | 36-48px | 600 | 1.3 |
| H3 (Subsection) | 24-32px | 600 | 1.4 |
| Body Large | 18px | 400 | 1.6 |
| Body Regular | 16px | 400 | 1.6 |
| Body Small | 14px | 400 | 1.5 |
| Overline | 12px | 600 | 1.4 |

---

### Spacing System

#### Base Unit: 4px

| Scale | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro-spacing |
| sm | 8px | Small gaps |
| md | 12px | Padding within elements |
| base | 16px | Standard padding |
| lg | 24px | Section padding |
| xl | 32px | Section spacing |
| 2xl | 48px | Major section spacing |
| 3xl | 64px | Hero/CTA spacing |

#### Common Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

### Component Specifications

#### Buttons

**Primary Button**
```
Height: 44px (mobile), 48px (desktop)
Padding: 12px 24px (mobile), 16px 32px (desktop)
Border-radius: 24px (pill shape)
Background: Linear gradient #1A332F to #2C5E54
Text: White, 14px, semibold
Shadow: 0 4px 12px rgba(26, 51, 47, 0.2)
Hover: Shadow increase, Y-offset -2px
```

**Secondary Button**
```
Height: 44px (mobile), 48px (desktop)
Padding: 12px 24px (mobile), 16px 32px (desktop)
Border: 2px solid #8B6F47
Border-radius: 24px
Text: #8B6F47, 14px, semibold
Background: Transparent
Hover: Background rgba(139, 111, 71, 0.05), Y-offset -2px
```

**Icon Button**
```
Width/Height: 48px
Border-radius: 50% (circle)
Border: 2px solid #999
Hover: Border-color #1A332F, Background #FBF8F1
```

#### Cards

**Feature Card**
```
Padding: 32px
Border-radius: 16px
Border: 1px solid #E5E7EB
Background: White
Hover: 
  - Border-color: #FCD34D
  - Shadow: 0 10px 25px rgba(0,0,0,0.08)
  - Bottom accent line slides in
```

**Gallery Card**
```
Border-radius: 16px
Aspect ratio: 3:4
Overflow: hidden
Hover:
  - Image scale: 1.1
  - Overlay gradient fade in
  - Text slides up from bottom
Shadow: Increases on hover
```

#### Input Fields (if applicable)
```
Height: 44px
Padding: 12px 16px
Border-radius: 8px
Border: 1px solid #D1D5DB
Font: 14px, regular
Focus: Border-color #8B6F47, outline: none
```

---

### Icon Specifications

#### Icon Size Standards
- Small (Navigation): 16-20px
- Medium (UI): 24px
- Large (Hero): 32-48px

#### Icon Style
- Line icons (stroke-based)
- Weight: 1.5-2px stroke
- Fill: Currently "none" (outline style)

---

### Illustration Guidelines

#### Illustration Style
- **Medium**: Digital/SVG-based, watercolor-inspired
- **Strokes**: Soft, rounded line caps
- **Fills**: Soft gradients, slight transparency
- **Shadows**: Gaussian blur filter, subtle
- **Colors**: Use palette colors at varying opacities

#### Hero Illustration (Designer)
```
Canvas: 400x500px viewBox
Elements:
  - Head: 45px radius circle
  - Body: 50px wide rectangle
  - Arms: 20px radius ellipse
  - Hands: 15px radius circles
  - Tablet: 120x160px rounded rectangle
  - Decorative batik: ~20-25% opacity

Animation: float 6s ease-in-out infinite (-20px Y-offset)
```

#### Feature Illustrations
```
Canvas: 300x300px viewBox
Container: 130-140px radius circle
Content: 60-70% of container
Colors: Palette colors at 40-70% opacity
Strokes: 2-2.5px width
```

#### Process Step Illustrations
```
Canvas: 200x200px viewBox
Container: 75px radius circle
Content: Centered, 50-60% of container
Strokes: 2-2.5px width
Animation: None (or subtle on hover)
```

---

### Gradient Specifications

#### Hero Gradient Background
```css
background: linear-gradient(
  135deg,
  #FBF8F1 0%,
  #F5F0E8 50%,
  #FEF5EC 100%
);
```

#### Primary Button Gradient
```css
background: linear-gradient(
  135deg,
  #1A332F 0%,
  #2C5E54 100%
);
```

#### Text Gradient (Brown accent)
```css
background: linear-gradient(
  135deg,
  #8B6F47 0%,
  #A68066 50%,
  #D4A574 100%
);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

#### CTA Section Gradient
```css
background: linear-gradient(
  135deg,
  #1A332F 0%,
  #2C5E54 50%,
  #3A7F75 100%
);
```

---

### Shadow System

#### Shadow Scale
```css
/* Soft Shadow (Illustrations) */
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));

/* Light Shadow (Hover states) */
box-shadow: 0 4px 12px rgba(26, 51, 47, 0.15);

/* Medium Shadow (Cards) */
box-shadow: 0 10px 25px rgba(0,0,0,0.1);

/* Heavy Shadow (CTA hover) */
box-shadow: 0 20px 40px rgba(26, 51, 47, 0.25);

/* Depth Shadow (Gallery featured) */
box-shadow: 0 25px 60px rgba(0,0,0,0.3);
```

---

### Animation Library

#### Transition Durations
- Quick: 200ms (color changes)
- Standard: 300ms (hovers, button states)
- Medium: 500ms (gallery movement)
- Slow: 800ms (fade in on scroll)

#### Easing Functions
```css
/* Standard */
cubic-bezier(0.3, 0, 0.7, 1)      /* ease */

/* Smooth entrance */
cubic-bezier(0, 0, 0.2, 1)        /* ease-out */

/* Natural movement */
cubic-bezier(0.3, 0, 0.8, 1)      /* ease-in-out */

/* Bouncy gallery */
cubic-bezier(0.34, 1.56, 0.64, 1) /* overshoot */
```

#### Keyframe Animations
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

### Responsive Adjustments

#### Hero Section
```
Mobile:
  - Text: 32px (H1), 16px (body)
  - Layout: Stacked (text above, illustration below)
  - Illustration: 100% width, 300px height
  
Tablet:
  - Text: 40px (H1), 18px (body)
  - Layout: 2-column (45/55 split)
  
Desktop:
  - Text: 56px (H1), 18px (body)
  - Layout: 2-column (45/55 split)
  - Illustration: 65% viewport width
```

#### Section Padding
```
Mobile: py-12 (48px) vertical
Tablet: py-20 (80px) vertical
Desktop: py-24 md:py-32 (96px-128px) vertical
```

---

### Decorative Elements

#### Batik Ornament Pattern
```
Type: SVG Circle + Diamond
Sizes: 
  - Small (sm): 12px
  - Medium (md): 20px
  - Large (lg): 32px
  
Opacity: 0.15 - 0.3 (varies by placement)
Stroke: 1.5px
```

#### Divider Lines
```css
height: 1px;
background: linear-gradient(
  90deg,
  transparent,
  rgba(139, 111, 71, 0.1),
  transparent
);
```

---

### Filter Effects

#### Soft Shadow Filter
```xml
<filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
</filter>
```

#### Drop Shadow Filter
```xml
<filter id="dropShadow">
  <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
</filter>
```

---

### Accessibility Specifications

#### Color Contrast Ratios
- Text on backgrounds: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- UI components: 3:1 minimum

#### Touch Targets
- Minimum: 44x44px (mobile)
- Comfortable: 48x48px
- Safe zone: 56x56px

#### Focus States
```css
:focus {
  outline: 2px solid #8B6F47;
  outline-offset: 2px;
}
```

---

### Performance Targets

#### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

#### Bundle Sizes
- Main CSS: < 50KB
- Main JS: < 100KB
- Total images: < 500KB

---

## 🎯 Design Consistency Checklist

- [ ] All headings use serif font
- [ ] All body text uses sans-serif
- [ ] Buttons follow button specifications
- [ ] Colors from palette only
- [ ] Spacing follows scale
- [ ] Shadows from shadow system
- [ ] Animations use specified durations
- [ ] Icons consistent style (outline)
- [ ] Illustrations use palette colors
- [ ] Responsive breakpoints applied
- [ ] Focus states on interactive elements
- [ ] Contrast ratios meet WCAG AA

---

## 📊 Asset Inventory

### Images Required
- Logo: 1 file (SVG or PNG)
- Gallery: 7 files (JPG, 3:4 ratio)
- Illustrations: 6 inline SVGs (no files needed)

### Fonts Required
- 1 Serif font (headings)
- 1 Sans-serif font (body)

### CSS Variables Needed
- --color-navy: #1A332F
- --color-sage: #2C5E54
- --color-cream: #F5E6D3
- --color-brown: #8B6F47
- --color-gold: #D4A574

---

**This design system ensures consistency, accessibility, and performance across the Larasena landing page. Follow these specifications for any future updates or additional components.**
