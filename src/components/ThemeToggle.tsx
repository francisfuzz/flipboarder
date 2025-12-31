import { useTheme } from '../contexts/ThemeContext';
import type { ThemeMode } from '../types/theme';

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['auto', 'light', 'dark'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const getThemeDisplay = () => {
    switch (mode) {
      case 'auto':
        return { icon: '🌓', label: 'Auto' };
      case 'light':
        return { icon: '☀️', label: 'Light' };
      case 'dark':
        return { icon: '🌙', label: 'Dark' };
    }
  };

  const { icon, label } = getThemeDisplay();

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Current theme: ${label}`}
    >
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
