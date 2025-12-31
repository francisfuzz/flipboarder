import { useMemo } from 'react';
import MessageEncoder from './components/MessageEncoder';
import FlipBoard from './components/FlipBoard';
import { decode } from './utils/encoding';
import { sanitize } from './utils/sanitizer';

export default function App() {
  const message = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('m');

    if (!encoded) {
      return null;
    }

    const decoded = decode(encoded);
    return decoded ? sanitize(decoded) : null;
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {message ? <FlipBoard message={message} /> : <MessageEncoder />}
      </div>
    </div>
  );
}
