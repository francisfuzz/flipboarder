interface FlipCharProps {
  char: string;
  delay: number;
}

export default function FlipChar({ char, delay }: FlipCharProps) {
  const displayChar = char === ' ' ? '\u00A0' : char; // non-breaking space

  return (
    <span
      data-testid="flip-char"
      className="animate-flip inline-block w-4 h-8"
      style={{ animationDelay: `${delay}ms` }}
    >
      {displayChar}
    </span>
  );
}
