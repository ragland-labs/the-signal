import { useMutation, useAction } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useState, useRef } from "react"
import type { Id } from "../../../convex/_generated/dataModel"

export function Dropzone({ onSessionCreated }: { onSessionCreated: (id: Id<"sessions">) => void }) {
    const createSession = useMutation(api.sessions.createSession)
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const saveFileMetadata = useMutation(api.files.saveFileMetadata)
    const generateBriefing = useAction(api.gemini.generateBriefing)

    const [stagedFiles, setStagedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSelectFileClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return
        setStagedFiles(prev => [...prev, ...files])
        if (event.target) event.target.value = ''
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        // Only clear when leaving the drop zone itself, not a child element
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            setStagedFiles(prev => [...prev, ...files])
        }
    }

    const removeFile = (index: number) => {
        setStagedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleGenerate = async () => {
        if (stagedFiles.length === 0) return
        setIsUploading(true)
        try {
            const sessionId = await createSession({})
            onSessionCreated(sessionId)

            const uploadPromises = stagedFiles.map(async (file) => {
                const postUrl = await generateUploadUrl()
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                })
                const { storageId } = await result.json()
                await saveFileMetadata({
                    sessionId,
                    storageId,
                    format: file.type || "application/octet-stream",
                    name: file.name,
                    size: file.size
                })
            })

            await Promise.all(uploadPromises)
            await generateBriefing({ sessionId })
        } catch (error) {
            console.error("Upload/generation failed:", error)
        } finally {
            setIsUploading(false)
            setStagedFiles([])
        }
    }

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '🖼️'
        if (type.startsWith('video/')) return '🎥'
        if (type.startsWith('audio/')) return '🎵'
        if (type === 'application/pdf') return '📄'
        if (type.startsWith('text/')) return '📝'
        return '📎'
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }

    return (
        <div className="w-full">
            <div
                id="drop-zone"
                role="button"
                tabIndex={0}
                aria-label="Document drop zone. Click to select files or drag and drop."
                className={isDragging ? 'drag-over' : ''}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleSelectFileClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectFileClick() }}
            >
                <div className="drop-glyph" aria-hidden="true">&#11041;</div>
                <p className="drop-title">Drop your documents here</p>
                <div className="tooltip-trigger">
                    <p className="drop-hint">PDF · Images · Audio · Video · Text &mdash; drag &amp; drop or tap to browse</p>
                    <div className="tooltip-content">
                        Upload earnings calls, pitch decks, legal filings, audio recordings, or any document for an instant intelligence briefing.
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.txt,.md,image/*,audio/*,video/*,text/*"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div className="drop-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={handleSelectFileClick}
                        disabled={isUploading}
                    >
                        Browse Files
                    </button>
                </div>
            </div>

            {stagedFiles.length > 0 && (
                <div className="staged-files-container animate-fade-in-up">
                    {stagedFiles.map((f, idx) => (
                        <div key={idx} className="staged-file-item">
                            <span className="staged-file-icon" aria-hidden="true">{getFileIcon(f.type)}</span>
                            <div className="staged-file-info">
                                <span className="staged-file-name">{f.name}</span>
                                <span className="staged-file-size">{formatSize(f.size)}</span>
                            </div>
                            <button
                                className="remove-file-btn"
                                onClick={() => removeFile(idx)}
                                disabled={isUploading}
                                aria-label={`Remove ${f.name}`}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {stagedFiles.length > 0 && (
                <div className="generate-btn-container animate-fade-in-up">
                    <button className="btn-premium" onClick={handleGenerate} disabled={isUploading}>
                        {isUploading
                            ? "Uploading & Processing\u2026"
                            : `Generate Briefing \u00b7 ${stagedFiles.length} file${stagedFiles.length > 1 ? 's' : ''}`}
                        <div className="btn-premium-shimmer" aria-hidden="true"></div>
                    </button>
                </div>
            )}
        </div>
    )
}
