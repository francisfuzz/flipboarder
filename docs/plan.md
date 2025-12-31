# Plan: Flipboard Message App (TDD)

## Tech Stack
- React + Vite
- Vitest + React Testing Library
- Tailwind CSS (dark mode via `prefers-color-scheme`)

## Architecture

**URL Structure:** `/?m=base64EncodedMessage`

**Components:**
1. `App` - routing logic, reads URL param
2. `MessageEncoder` - input form for creating messages
3. `FlipBoard` - animated reveal display
4. `FlipChar` - individual character with flip animation

## Implementation Order (TDD)

### 1. Sanitizer Utility (`src/utils/sanitizer.ts`)
```
Tests:
- truncates to 140 chars
- removes script tags
- removes HTML entities
- allows alphanumeric, spaces, basic punctuation
- handles empty string
- handles null/undefined
```

### 2. URL Encoding Utility (`src/utils/encoding.ts`)
```
Tests:
- encodes string to base64
- decodes base64 to string
- handles special characters
- returns empty string for invalid base64
```

### 3. FlipChar Component
```
Tests:
- renders single character
- applies flip animation class
- respects animation delay prop
- handles space character (non-breaking)
```

### 4. FlipBoard Component
```
Tests:
- renders sanitized message
- splits into individual FlipChar components
- staggers animation delays
- shows placeholder when empty
```

### 5. MessageEncoder Component
```
Tests:
- renders textarea with 140 char limit
- shows character count
- disables submit when empty
- generates shareable URL on submit
- copies URL to clipboard
```

### 6. App Component
```
Tests:
- shows encoder when no message param
- shows flipboard when message param exists
- sanitizes decoded message before display
```

## Styling Spec

**Typography:** System font stack, monospace for flipboard
**Dark mode:** `bg-black text-white` (default follows system)
**Light mode:** `bg-white text-black`

**FlipBoard:**
- Grid of fixed-width character cells
- CSS `@keyframes` flip animation (rotateX)
- Staggered reveal: 50ms delay per character

**Layout:**
- Centered, max-width 600px
- Generous whitespace (Aesop/Swedish minimal)
- Single column, no decorative elements

## File Structure
```
src/
  components/
    FlipChar.tsx
    FlipChar.test.tsx
    FlipBoard.tsx
    FlipBoard.test.tsx
    MessageEncoder.tsx
    MessageEncoder.test.tsx
  utils/
    sanitizer.ts
    sanitizer.test.ts
    encoding.ts
    encoding.test.ts
  App.tsx
  App.test.tsx
  index.css
```

## Accessibility
- `aria-live="polite"` on flipboard
- `role="text"` with full message in `aria-label`
- Focus management on encoder form
- Sufficient color contrast (pure black/white)
- Reduced motion: skip animation if `prefers-reduced-motion`