import { useState } from 'react';
import { encode } from '../utils/encoding';
import FlipBoard from './FlipBoard';

const MAX_LENGTH = 140;

export default function MessageEncoder() {
  const [message, setMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

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

      <button
        onClick={handleShare}
        disabled={!message.trim()}
        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      >
        {copied ? 'Copied!' : 'Share'}
      </button>

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
    </div>
  );
}
