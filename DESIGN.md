---
name: Bembe Cafe
description: A community cafe in Alexandra Park, Manchester, offering halal, homemade food.
colors:
  primary: "#6B7C47"
  primary-dark: "#4A5C2F"
  primary-light: "#8A9E62"
  background: "#F5F0E8"
  background-soft: "#EDE8DC"
  accent: "#6B2737"
  accent-dark: "#8B3A4A"
  accent-light: "#9E4A5C"
  secondary: "#7C5C3E"
  secondary-light: "#A0784F"
  text-deep: "#2C1810"
  warm-white: "#FDFAF5"
  card: "#F0EBE0"
  border-warm: "#D4C9B0"
  ring: "#6B7C47"
typography:
  sans:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
  display:
    fontFamily: "Playfair Display, serif"
  accent:
    fontFamily: "DM Serif Display, serif"
rounded:
  sm: "0.75rem" # Corresponds to 12px based on common Tailwind defaults, also --radius from shadcn overrides.
  lg: "12px" # --radius-lg
  xl: "16px" # --radius-xl
  "2xl": "24px" # --radius-2xl
  "3xl": "32px" # --radius-3xl
spacing: {} # No explicit spacing tokens found yet, primarily controlled by Tailwind defaults and utility classes.
components: {} # Will be populated in DESIGN.json and referenced here.
---

# Design System: Bembe Cafe

## 1. Overview

**Creative North Star: "The Warm Hearth Cafe"**

Bembe Cafe's design system is built on editorial warmth — the feeling of a well-loved neighborhood cafe that happens to be beautifully designed, where every visual choice feels intentional but never cold or corporate. The mood is the visual equivalent of wrapping your hands around a hot coffee cup on a rainy Manchester morning inside a park pavilion surrounded by people you recognize — comfortable, genuine, and quietly special. Every design decision must reject the transactional sterility of delivery platforms, the intimidating minimalism of concept coffee brands, and the soulless uniformity of template-built sites, in favor of bold earthy typography, warm beige and olive tones, and layouts that feel handcrafted for this specific community in this specific park.

**Key Characteristics:**
- Authentic and inviting aesthetic that fosters a sense of belonging.
- Purposeful warmth conveyed through color, typography, and visual depth.
- Rejection of generic, transactional, or overly corporate design patterns.
- Design that emphasizes the cafe's community roots and handmade quality.
- Strategic use of visual elements to create appetite and trust.

## 2. Colors: The Earthy & Luxurious Palette

This palette is earthy, grounded, and quietly luxurious, evoking immediate trust and appetite.

### Primary
- **Deep Olive Green** (`#6B7C47`): Used for primary calls to action, important headings, and elements that require strong emphasis. It signifies growth, naturalness, and calm.
- **Dark Forest Green** (`#4A5C2F`): A darker variant of the primary, used for hover states, active elements, and deeper textual elements where primary might feel too light.
- **Soft Moss Green** (`#8A9E62`): A lighter variant of the primary, used for subtle accents, highlights, and secondary interactive elements.

### Neutral
- **Warm Beige Background** (`#F5F0E8`): The dominant background color, providing a sense of comfort, cleanliness, and a canvas for other elements. It feels like natural linen.
- **Soft Cream Background** (`#EDE8DC`): A slightly softer background tone, used for subtle visual separation and muted elements.
- **Deep Text Brown** (`#2C1810`): Used for main body text, navigation elements, and icons, ensuring high contrast and readability while maintaining warmth.
- **Warm White Popover** (`#FDFAF5`): Used for popovers, modals, and elements requiring a bright, clean, yet still warm background.
- **Creamy Card** (`#F0EBE0`): The background color for cards and contained content, offering a soft distinction from the main background.
- **Warm Border Tone** (`#D4C9B0`): Used for borders, separators, and input fields, providing a gentle visual structure.

### Accent
- **Rich Maroon** (`#6B2737`): Used for secondary calls to action, important notifications, and elements that require a distinct, inviting accent without being aggressive. It signifies indulgence and warmth (like mulled wine or cherries).
- **Darker Berry Red** (`#8B3A4A`): A darker variant of the accent, for hover states and stronger emphasis.
- **Soft Rose Red** (`#9E4A5C`): A lighter variant, used for subtle accents or destructive actions (e.g., delete buttons).

### Secondary
- **Earthy Brown** (`#7C5C3E`): Used for tertiary information, muted elements, and as a complementary earth tone.
- **Light Tan** (`#A0784F`): A lighter variant, for subtle textural elements or less prominent information.

### Named Rules
**The Halal Palette Rule.** The palette is exclusively warm beige, olive green, and maroon, avoiding cold blues, stark whites, or harsh blacks anywhere in the design to reinforce the cafe's warmth and commitment to halal offerings.

## 3. Typography

**Display Font:** "Playfair Display", serif
**Body Font:** "Lato", ui-sans-serif, system-ui, sans-serif
**Accent Font:** "DM Serif Display", serif

**Character:** The typography pairing strikes a balance between classic elegance (Playfair Display, DM Serif Display) for headlines and a friendly, highly readable sans-serif (Lato) for body text. This creates an inviting yet sophisticated feel, suitable for a cafe that values both tradition and community.

### Hierarchy
- **Display** (serif, bold weights): Used for hero sections and major page titles, evoking a sense of heritage and impact.
- **Headline** (serif, medium to bold weights): For section titles and prominent information, drawing attention with a touch of elegance.
- **Body** (sans-serif, regular to medium weights): For all paragraph text, descriptions, and general content, prioritizing legibility and a welcoming tone. Cap line length at 65–75ch for optimal readability.
- **Label/Accent** (DM Serif Display, serif): Used for special callouts, smaller accents, or where a decorative yet readable element is desired.

### Named Rules
**The Editorial Warmth Rule.** Typography choices should prioritize readability and a warm, inviting tone. Headings use classic serif fonts to convey heritage and craft, while body text uses a clean, approachable sans-serif.

## 4. Elevation: Warmly Layered with Purposeful Restraint

The interface conveys depth through subtle overlapping layers, soft warm shadows that mimic natural light, and gentle background tints. It avoids flatness to maintain warmth and avoids aggressive shadows that feel corporate. Depth is primarily used to signal interactivity and importance.

### Shadow Vocabulary
- **Tinted Shadow Small** (`0 8px 20px -8px rgba(44, 24, 16, 0.06)`): For subtle lift on smaller interactive elements or cards at rest.
- **Tinted Shadow Medium** (`0 20px 40px -15px rgba(44, 24, 16, 0.08)`): For default elevation of cards, sections, and slightly more prominent elements.
- **Tinted Shadow Large** (`0 32px 64px -20px rgba(44, 24, 16, 0.12)`): For significant elevation on hover states, modals, or focused interactive components, signaling high importance.
- **Liquid Glass** (`backdrop-filter: blur(40px) saturate(1.2); -webkit-backdrop-filter: blur(40px) saturate(1.2); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 40px -15px rgba(44, 24, 16, 0.08);`): For frosted, translucent elements that need to stand out while allowing background content to subtly show through.

### Named Rules
**The Natural Light Rule.** Shadows should always be warm-tinted (using `rgba(44, 24, 16, X)`) to mimic natural light, never cold grey. They are reserved for signaling interaction or separation, not for decorative flourish.

## 5. Components

Components should feel warm and trustworthy. They are designed for clarity, ease of interaction, and to reinforce the cafe's inviting brand.

### Buttons
- **Shape:** Gently rounded corners (e.g., `0.75rem` or `12px` radius for standard, up to `32px` for large/pill-shaped).
- **Primary:** Strong contrast with `primary` background and `warm-white` text. Padding should ensure comfortable touch targets and visual balance.
- **Hover / Focus:** Subtle background shifts to `primary-dark`, gentle `transform: translateY(-2px)` for an engaging, tactile response, and a clear `ring` for focus. Transitions are smooth and brief.
- **Secondary / Ghost / Tertiary:** Use `secondary` or `muted` colors for background, `primary` or `text-deep` for text, with minimal borders or transparent backgrounds for less prominent actions.

### Cards / Containers
- **Corner Style:** Rounded corners, typically `0.75rem` or `12px` (`--radius-lg`), providing a softer, more approachable feel.
- **Background:** `card` color (`#F0EBE0`) for content separation, offering a warm, slightly differentiated surface.
- **Shadow Strategy:** Utilizes `tinted-shadow` or `tinted-shadow-lg` for gentle lift and separation from the `background`, avoiding harsh visual breaks.
- **Border:** `border-warm` for subtle definition where needed.
- **Internal Padding:** Generous and consistent padding, scaled to create a comfortable reading and interaction experience.

### Inputs / Fields
- **Style:** `border-warm` for strokes, `background-soft` for background, with rounded corners (`0.75rem` or `12px`).
- **Focus:** Highlighted with a `ring` color (`#6B7C47`), providing a clear visual cue for active input.
- **Error / Disabled:** Clearly indicated with `accent-light` (`#9E4A5C`) for error states and reduced opacity or muted `border-warm` for disabled states.

## 6. Do's and Don'ts

### Do:
- **Do** prioritize readability and comfort in all textual content.
- **Do** use authentic, high-quality photography that feels specific to Bembe Cafe and Alexandra Park.
- **Do** ensure generous and consistent spacing to create a calm and inviting visual rhythm.
- **Do** use warm-tinted shadows and subtle background layering to convey depth.
- **Do** ensure interactive elements provide clear, warm, and trustworthy feedback on hover and focus.

### Don't:
- **Don't** make the site look like a generic food delivery platform (Uber Eats, Deliveroo) – avoid transactional, cluttered, or soul-less designs.
- **Don't** adopt the loud, aggressive, or impulse-optimized aesthetic of fast-food chain websites (McDonald's, KFC).
- **Don't** mimic corporate hotel restaurant websites with cold, overly formal, stiff photography, or zero personality.
- **Don't** use template-built Wix or Squarespace cafe site aesthetics (default blocks, system fonts, generic colors).
- **Don't** resemble dark, moody specialty coffee brands that are cold, unwelcoming, or intimidating. Bembe is not a concept cafe for coffee snobs.
- **Don't** use purple gradients, glassmorphism effects, neon accents, or any design trend that feels techy, digital, or artificial.
- **Don't** use stock photography of generic smiling models in cafes.
- **Don't** have an overwhelming homepage with too many popups, cookie banners blocking content, newsletter modals appearing immediately, or autoplay videos with sound.
- **Don't** use cold blues, stark whites, or harsh blacks anywhere in the design.
- **Don't** make the site feel like it was built from a template; every section should feel custom-designed.
