import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <img
                src={theme === 'dark' ? '/dark-mode.png' : '/light-mode.png'}
                alt={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            />
        </button>
    );
}