export function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer id="dash-footer">
            <span className="footer-text">The Signal &mdash; Intelligence Briefing System &mdash; Confidential</span>
            <span className="footer-text">&copy; {year} &mdash; Built by <a
                href="https://www.raglandlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credit-link"
            >Ragland Labs</a></span>
        </footer>
    )
}
