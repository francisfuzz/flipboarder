import { useMemo, useState, useEffect } from 'react';
import MessageEncoder from './components/MessageEncoder';
import FlipBoard from './components/FlipBoard';
import ThemeToggle from './components/ThemeToggle';
import { decode } from './utils/encoding';
import { sanitize } from './utils/sanitizer';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const message = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('m');

    if (!encoded) {
      return null;
    }

    const decoded = decode(encoded);
    return decoded ? sanitize(decoded) : null;
  }, []);

  const handleCreateOwn = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {!isOnline && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded border border-yellow-300 dark:border-yellow-700 text-sm">
          📴 You're offline - but you can still use the app!
        </div>
      )}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {message ? (
          <>
            <div>
              <FlipBoard message={message} />
            </div>
            <button
              onClick={handleCreateOwn}
              className="self-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded font-medium hover:opacity-90 transition-opacity"
            >
              ✨ Create your own message here
            </button>
          </>
        ) : (
          <MessageEncoder />
        )}
      </div>
    </div>
  );
}
