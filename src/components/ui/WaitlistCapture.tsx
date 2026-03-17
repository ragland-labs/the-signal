import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useState } from "react"

export function WaitlistCapture() {
    const joinWaitlist = useMutation(api.waitlist.joinWaitlist)
    const [email, setEmail] = useState("")
    const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || state === "loading") return
        setState("loading")
        setErrorMsg("")
        try {
            await joinWaitlist({ email, source: "demo-briefing" })
            setState("done")
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong."
            setErrorMsg(msg)
            setState("error")
        }
    }

    if (state === "done") {
        return (
            <div className="waitlist-confirmation" role="status" aria-live="polite">
                <span className="waitlist-check" aria-hidden="true">✓</span>
                <span>You're on the list — we'll be in touch.</span>
            </div>
        )
    }

    return (
        <div className="waitlist-section">
            <p className="waitlist-eyebrow">Early Access</p>
            <p className="waitlist-headline">Interested in the full product?</p>
            <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
                <input
                    className="waitlist-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (state === "error") setState("idle")
                    }}
                    disabled={state === "loading"}
                    aria-label="Email address for waitlist"
                    autoComplete="email"
                    required
                />
                <button
                    className="waitlist-btn"
                    type="submit"
                    disabled={state === "loading" || !email.trim()}
                >
                    {state === "loading" ? "Joining\u2026" : "Join Waitlist"}
                </button>
            </form>
            {state === "error" && (
                <p className="waitlist-error" role="alert">{errorMsg}</p>
            )}
        </div>
    )
}
