import { useState, useEffect } from 'react';
import { encode } from '../utils/encoding';
import FlipBoard from './FlipBoard';

const MAX_LENGTH = 140;
const MAX_HISTORY = 10;

interface HistoryItem {
  id: string;
  message: string;
  timestamp: number;
}

export default function MessageEncoder() {
  const [message, setMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('flipboard_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('flipboard_history', JSON.stringify(newHistory));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setShareUrl('');
    setCopied(false);
  };

  const handleShare = async () => {
    if (!message.trim()) return;

    const encoded = encode(message);
    const url = `${window.location.origin}/?m=${encoded}`;
    setShareUrl(url);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        message: message.trim(),
        timestamp: Date.now(),
      };
      const newHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY);
      saveHistory(newHistory);

      setTimeout(() => setCopied(false), 2000);
      setMessage('');
      setShareUrl('');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 pb-6 border-b border-gray-200 dark:border-gray-800">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Live preview
        </label>
        <div className="py-4">
          <FlipBoard message={message} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message-input" className="text-sm text-gray-600 dark:text-gray-400">
          Share a message
        </label>
        <textarea
          id="message-input"
          value={message}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          placeholder="Type your message here..."
          className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          rows={4}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {message.length} / {MAX_LENGTH}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleShare}
          disabled={!message.trim()}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        >
          Share
        </button>
        {copied && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            ✓ Copied to clipboard!
          </span>
        )}
      </div>

      {shareUrl && (
        <div className="flex flex-col gap-2">
          <label htmlFor="share-url" className="text-sm text-gray-600 dark:text-gray-400">
            Shareable link
          </label>
          <input
            id="share-url"
            type="text"
            value={shareUrl}
            readOnly
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm break-all"
          />
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-2 pt-6 border-t border-gray-200 dark:border-gray-800">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Recent messages
          </label>
          <div className="flex flex-col gap-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                    {item.message}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const encoded = encode(item.message);
                    const url = `${window.location.origin}/?m=${encoded}`;
                    navigator.clipboard.writeText(url).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="flex-shrink-0 px-2 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
