import { Topbar } from './components/layout/Topbar'
import { Hero } from './components/layout/Hero'
import { Footer } from './components/layout/Footer'
import { Dropzone } from './components/ui/Dropzone'
import { StatusBar } from './components/ui/StatusBar'
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { useState } from "react"
import type { Id } from "../convex/_generated/dataModel"

function App() {
  const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null)

  const session = useQuery(api.sessions.getSession, sessionId ? { sessionId } : "skip")
  const briefing = useQuery(api.briefings.getBriefingForSession, sessionId ? { sessionId } : "skip")

  const isProcessing = session?.status === "files_uploaded" || session?.status === "processing"
  const isFailed = session?.status === "failed"

  const handleNewBriefing = () => setSessionId(null)

  return (
    <>
      <Topbar />

      <main id="main">
        {!briefing ? (
          <>
            <Hero />
            <Dropzone onSessionCreated={setSessionId} />
            <StatusBar
              status={isProcessing ? "loading" : isFailed ? "error" : "idle"}
              message={isFailed ? "Analysis failed. Please try again." : ""}
              subMessage={isProcessing ? "AI Analysis in Progress" : ""}
            />
          </>
        ) : (
          <div id="briefing-section" className="animate-fade-in-up">
            <div className="briefing-header">
              <h2 className="briefing-title">Intelligence Briefing</h2>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={handleNewBriefing}
                aria-label="Start a new briefing"
              >
                ← New Briefing
              </button>
            </div>

            <div className="briefing-grid">
              <div className="briefing-card">
                <h3 className="briefing-card-header" style={{ color: 'var(--red)' }}>
                  <span className="briefing-card-accent" style={{ background: 'var(--red)' }}></span>
                  Strategic Risks
                </h3>
                <ul className="briefing-list">
                  {briefing.strategicRisks?.map((risk: string, i: number) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="briefing-card">
                <h3 className="briefing-card-header" style={{ color: 'var(--amber)' }}>
                  <span className="briefing-card-accent" style={{ background: 'var(--amber)' }}></span>
                  Immediate Actions
                </h3>
                <ul className="briefing-list">
                  {briefing.immediateActions?.map((action: string, i: number) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="briefing-card briefing-card-full">
                <h3 className="briefing-card-header" style={{ color: 'var(--green)' }}>
                  <span className="briefing-card-accent" style={{ background: 'var(--green)' }}></span>
                  Key Financials &amp; Metrics
                </h3>
                <ul className="briefing-list">
                  {briefing.keyFinancials?.map((fin: string, i: number) => (
                    <li key={i}>{fin}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="briefing-meta">
              <span>Confidence Score: <span style={{ color: 'var(--accent)' }}>{briefing.confidenceScore}%</span></span>
              <span>Generated {new Date(briefing.generatedAt).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: '64px' }}>
          <Footer />
        </div>
      </main>
    </>
  )
}

export default App
