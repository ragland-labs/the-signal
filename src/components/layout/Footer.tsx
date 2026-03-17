export function Footer() {
    return (
        <footer id="dash-footer">
            <span className="footer-text">The Signal &mdash; Intelligence Briefing System &mdash; Confidential</span>
            <a href="https://www.raglandlabs.com" target="_blank" rel="noopener noreferrer" className="rl-minimal-logo" aria-label="Built by Ragland Labs" style={{ margin: '0 auto' }}>
                <img src="https://ik.imagekit.io/xrtdefb8l/favicon_logo_ragland_labs_v2.jpg?updatedAt=1768359858839" alt="Ragland Labs" width="24" height="24" />
                <div className="rl-minimal-shimmer"></div>
            </a>
            <span className="footer-text" id="footer-ts"></span>
        </footer>
    )
}
