import FlipChar from './FlipChar';
import { sanitize } from '../utils/sanitizer';

interface FlipBoardProps {
  message: string;
}

export default function FlipBoard({ message }: FlipBoardProps) {
  const sanitized = sanitize(message);
  const isEmpty = !sanitized.trim();

  if (isEmpty) {
    return (
      <div
        className="text-center text-gray-400 text-lg"
        data-testid="flip-board-placeholder"
      >
        Share a message
      </div>
    );
  }

  return (
    <div
      role="text"
      aria-label={sanitized}
      aria-live="polite"
      className="font-mono text-2xl tracking-widest whitespace-pre-wrap break-words"
    >
      {sanitized.split('').map((char, index) => (
        <FlipChar key={index} char={char} delay={index * 50} />
      ))}
    </div>
  );
}
