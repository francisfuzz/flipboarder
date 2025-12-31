# Flipboarder

Share animated flip-reveal messages with style. See [Plan](./docs/plan.md) for technical blueprint.

## How to Use

### Creating and Sharing Messages

1. **Type your message** - Enter up to 140 characters in the textarea
2. **See live preview** - Your message animates in real-time as you type
3. **Share** - Click the "Share" button to copy a shareable link to your clipboard
4. **See confirmation** - A green "✓ Copied to clipboard!" message confirms it's ready to share

### Viewing Shared Messages

Simply click on a shared link to see the message with the animated flip-reveal effect. The animation reveals one character at a time with a smooth 3D flip rotation.

### Message History

All messages you create are automatically saved to your browser's local storage:
- **Recent messages** section shows your last 10 messages
- **Copy button** next to each message lets you quickly re-share without retyping
- History persists even after closing the browser

### Offline Support

Flipboarder works completely offline! Once you visit the app, it's cached locally so you can:
- Create new messages offline
- View your message history
- Access previously shared links (by URL)

An offline indicator appears at the top when you lose connection, but you can keep using the app normally.

## Project Setup

### Local Development

#### Prerequisites
- Node.js 18+
- npm 9+

#### Installation

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

The app will hot-reload as you make changes.

### Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test -- --run

# View test UI (optional)
npm run test:ui
```

**Test Coverage:**
- Utility functions (encoding, sanitization)
- All React components with Testing Library
- User interactions and state management
- Offline functionality
- Total: 65 tests, 100% passing

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory, ready to deploy to any static hosting service.

### Architecture

- **React 19** - UI components
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing
- **Tailwind CSS** - Styling with dark mode support
- **Service Worker** - Offline support via caching
- **localStorage** - Persistent message history
- **Web App Manifest** - PWA support for installable app

## License

[GNU GPLv3](./LICENSE)
