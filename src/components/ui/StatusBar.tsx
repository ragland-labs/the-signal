import { useState, useEffect } from 'react'

interface StatusProps {
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
    subMessage?: string
}

export function StatusBar({ status, message, subMessage }: StatusProps) {
    const [loadingStep, setLoadingStep] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (status === 'loading') {
            setLoadingStep(0)
            interval = setInterval(() => {
                setLoadingStep(s => (s < 2 ? s + 1 : s))
            }, 5500) // Change step every 5.5s
        }
        return () => clearInterval(interval)
    }, [status])

    const loadingMessages = [
        "Analyzing document structure...",
        "Extracting key intelligence...",
        "Generating executive briefing..."
    ]

    const displayMessage = status === 'loading' ? loadingMessages[loadingStep] : message

    if (status === 'idle' || status === 'success') return null

    if (status === 'error') {
        return (
            <div id="error-box" role="alert" aria-live="assertive" style={{ display: 'block' }}>
                {displayMessage || 'An error occurred'}
            </div>
        )
    }

    return (
        <div id="status-bar" role="status" aria-live="polite" style={{ display: 'flex' }}>
            <div className="status-spinner" aria-hidden="true"></div>
            <span id="status-text">{displayMessage || 'Processing...'}</span>
            {subMessage && <span id="status-sub">{subMessage}</span>}
        </div>
    )
}
