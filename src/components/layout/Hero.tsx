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
                    <span className="hero-meta-label">Accepts</span>
                    <span className="hero-meta-value">Docs, Audio &amp; Video</span>
                </div>
                <div className="hero-meta-divider"></div>
                <div className="hero-meta-item">
                    <span className="hero-meta-label">Analysis</span>
                    <span className="hero-meta-value">AI-Powered</span>
                </div>
                <div className="hero-meta-divider"></div>
                <div className="hero-meta-item">
                    <span className="hero-meta-label">Output</span>
                    <span className="hero-meta-value">Intelligence Brief</span>
                </div>
            </div>
        </section>
    )
}
