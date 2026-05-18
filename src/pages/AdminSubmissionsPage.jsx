import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import { getAllSubmissions, updateSubmissionStatus } from '../services/streamerService'
import ToastContainer, { useToast } from '../components/common/Toast'

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  approved: { label: 'Approved', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Rejected', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const { toasts, show } = useToast()

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllSubmissions()
      setSubmissions(data)
    } catch (err) {
      show(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatus = async (id, status) => {
    try {
      const updated = await updateSubmissionStatus(id, status)
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)))
      show(`Submission ${status}`)
    } catch (err) {
      show(err.message, 'error')
    }
  }

  const visible = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter)

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? submissions.length : submissions.filter((s) => s.status === f).length
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Submissions</h1>
          <p className="text-valo-muted text-sm font-body mt-0.5">
            User-submitted streamer links for review
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold capitalize border transition-all
                ${filter === f
                  ? 'bg-valo-red border-valo-red text-white'
                  : 'border-valo-border text-valo-muted hover:border-valo-muted hover:text-white'
                }`}
            >
              {f} <span className="ml-1 font-mono opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-lg shimmer" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-valo-card border border-valo-border rounded-xl p-12 text-center">
            <p className="text-valo-muted font-body">No {filter !== 'all' ? filter : ''} submissions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((sub) => {
              const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending
              return (
                <div
                  key={sub.id}
                  className="bg-valo-card border border-valo-border rounded-xl p-4 flex items-center gap-4 animate-fade-in hover:border-valo-border/80 transition-colors"
                >
                  {/* Platform badge */}
                  <div className={`shrink-0 text-xs font-display font-semibold uppercase px-2.5 py-1 rounded ${
                    sub.platform === 'youtube' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {sub.platform}
                  </div>

                  {/* URL */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-body text-valo-text hover:text-valo-red transition-colors truncate block"
                    >
                      {sub.url}
                    </a>
                    <p className="text-xs text-valo-muted mt-0.5">
                      {new Date(sub.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`shrink-0 text-xs font-display font-semibold uppercase px-2.5 py-1 rounded border ${cfg.class}`}>
                    {cfg.label}
                  </span>

                  {/* Actions */}
                  {sub.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleStatus(sub.id, 'approved')}
                        className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-xs font-display font-semibold px-3 py-1.5 rounded transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(sub.id, 'rejected')}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-display font-semibold px-3 py-1.5 rounded transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {sub.status !== 'pending' && (
                    <button
                      onClick={() => handleStatus(sub.id, 'pending')}
                      className="shrink-0 text-xs text-valo-muted hover:text-white border border-valo-border hover:border-valo-muted px-3 py-1.5 rounded font-display transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} />
    </AdminLayout>
  )
}
