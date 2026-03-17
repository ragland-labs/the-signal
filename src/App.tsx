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
              subMessage={isProcessing ? "Gemini 2.5 Pro · Multimodal Inference" : ""}
            />
          </>
        ) : (
          <div className="mx-auto max-w-4xl pt-10 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.1 }}>
                Intelligence Briefing
              </h2>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={handleNewBriefing}
                aria-label="Start a new briefing"
              >
                ← New Briefing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow rounded">
                <h3 style={{ fontFamily: 'var(--fm)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '3px', height: '14px', background: 'var(--red)', borderRadius: '2px', flexShrink: 0 }}></span>
                  Strategic Risks
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {briefing.strategicRisks?.map((risk: string, i: number) => (
                    <li key={i} style={{ fontFamily: 'var(--fb)', fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow rounded">
                <h3 style={{ fontFamily: 'var(--fm)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '3px', height: '14px', background: 'var(--amber)', borderRadius: '2px', flexShrink: 0 }}></span>
                  Immediate Actions
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {briefing.immediateActions?.map((action: string, i: number) => (
                    <li key={i} style={{ fontFamily: 'var(--fb)', fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow rounded md:col-span-2">
                <h3 style={{ fontFamily: 'var(--fm)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '3px', height: '14px', background: 'var(--green)', borderRadius: '2px', flexShrink: 0 }}></span>
                  Key Financials &amp; Metrics
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {briefing.keyFinancials?.map((fin: string, i: number) => (
                    <li key={i} style={{ fontFamily: 'var(--fb)', fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{fin}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--fm)', fontSize: '0.68rem', color: 'var(--text-mute)', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap', gap: '8px' }}>
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
