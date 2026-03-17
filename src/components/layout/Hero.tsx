export function Hero() {
    return (
        <section id="hero" aria-labelledby="hero-title">
            {/* Ambient background */}
            <div className="hero-orb hero-orb-1" aria-hidden="true"></div>
            <div className="hero-orb hero-orb-2" aria-hidden="true"></div>

            <p className="hero-eyebrow vis">Intelligence Briefing System &mdash; v2.0</p>
            <h1 id="hero-title" className="hero-title vis">From <em>chaos</em> to<br />clarity. In seconds.</h1>
            <p className="hero-sub vis">Ingest any document &mdash; RFP, legal filing, earnings release &mdash; and receive a
                precision executive briefing: strategic risks, immediate actions, and key financials.</p>

            {/* Meta strip */}
            <div className="hero-meta vis" aria-hidden="true">
                <div className="hero-meta-item">
                    <span className="hero-meta-label">Engine</span>
                    <span className="hero-meta-value">Gemini 2.5 Pro</span>
                </div>
                <div className="hero-meta-divider"></div>
                <div className="hero-meta-item">
                    <span className="hero-meta-label">Formats</span>
                    <span className="hero-meta-value">Multimodal</span>
                </div>
                <div className="hero-meta-divider"></div>
                <div className="hero-meta-item">
                    <span className="hero-meta-label">Output</span>
                    <span className="hero-meta-value">Briefing Dash</span>
                </div>
            </div>
        </section>
    )
}
