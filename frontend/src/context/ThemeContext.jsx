import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    /* Commented out dark mode state
    const [isDark, setIsDark] = useState(() => {
        // Always default to light — only switch to dark if the user has explicitly chosen it
        const saved = typeof window !== 'undefined' ? localStorage.getItem('w2f-theme') : null;
        return saved === 'dark' ? true : false;
    });

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('w2f-theme', theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
    };
    */

    // Force light theme
    const isDark = false;
    const toggleTheme = () => {};

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('w2f-theme', 'light');
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
