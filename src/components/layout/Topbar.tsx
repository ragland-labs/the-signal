import { useState, useEffect } from 'react'

export function Topbar() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <header id="topbar">
            <a href="/" className="wordmark" aria-label="The Signal — Back to home">
                <div className="wordmark-dot" aria-hidden="true"></div>
                The Signal
            </a>
            <div className="topbar-right">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    type="button"
                    aria-label="Toggle color theme"
                >
                    <span aria-hidden="true">{theme === 'dark' ? '☽' : '☀'}</span>
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
            </div>
        </header>
    )
}
