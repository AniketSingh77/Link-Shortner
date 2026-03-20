import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.style.setProperty('--bg', '#050505');
            root.style.setProperty('--bg-alt', '#101012');
            root.style.setProperty('--text', '#ffffff');
            root.style.setProperty('--text-dim', 'rgba(255,255,255,0.4)');
            root.style.setProperty('--border', 'rgba(255,255,255,0.1)');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--bg', '#ffffff');
            root.style.setProperty('--bg-alt', '#f8f9ff');
            root.style.setProperty('--text', '#1a1a1a');
            root.style.setProperty('--text-dim', '#666666');
            root.style.setProperty('--border', '#eeeeee');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
