import { useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import { useStreamers } from '../hooks/useStreamers'
import ToastContainer, { useToast } from '../components/common/Toast'

function AddStreamerModal({ onClose, onAdd }) {
  const [platform, setPlatform] = useState('youtube')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!value.trim()) return
    setLoading(true)
    setError('')
    try {
      const payload = { platform }
      if (platform === 'youtube') payload.youtube_channel_id = value.trim()
      else payload.kick_username = value.trim()
      await onAdd(payload)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-valo-card border border-valo-border rounded-xl w-full max-w-md p-6 space-y-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">Add Streamer</h3>
          <button onClick={onClose} className="text-valo-muted hover:text-white transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {['youtube', 'kick'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setPlatform(p); setValue('') }}
                className={`py-2.5 rounded-lg border-2 font-display font-semibold text-sm capitalize transition-all
                  ${platform === p ? 'border-valo-red bg-valo-red/10 text-valo-red' : 'border-valo-border text-valo-muted hover:border-valo-muted'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">
            {platform === 'youtube' ? 'YouTube Channel ID' : 'Kick Username'}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={platform === 'youtube' ? 'UCxxxxxxxxxxxxxxxxxxxxxx' : 'shroud'}
            className="input-field"
            autoFocus
          />
          <p className="text-valo-muted text-xs mt-1.5 font-body">
            {platform === 'youtube'
              ? 'Find channel ID from youtube.com/channel/ID or use a tool like channelid.com'
              : 'The username as it appears in kick.com/username'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded p-3 text-xs text-red-300">{error}</div>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="valo-btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={handleAdd} disabled={loading || !value.trim()} className="valo-btn flex-1 py-2.5 text-sm">
            {loading ? 'Adding…' : 'Add Streamer'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ streamer, onClose, onSave }) {
  const [value, setValue] = useState(
    streamer.platform === 'youtube' ? streamer.youtube_channel_id : streamer.kick_username
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const updates = streamer.platform === 'youtube'
        ? { youtube_channel_id: value.trim() }
        : { kick_username: value.trim() }
      await onSave(streamer.id, updates)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-valo-card border border-valo-border rounded-xl w-full max-w-md p-6 space-y-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">Edit Streamer</h3>
          <button onClick={onClose} className="text-valo-muted hover:text-white transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div>
          <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">
            {streamer.platform === 'youtube' ? 'YouTube Channel ID' : 'Kick Username'}
          </label>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="input-field" />
        </div>
        {error && <div className="bg-red-900/20 border border-red-700/30 rounded p-3 text-xs text-red-300">{error}</div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="valo-btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={loading || !value.trim()} className="valo-btn flex-1 py-2.5 text-sm">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminStreamersPage() {
  const { streamers, isLoading, error, add, edit, remove, toggle } = useStreamers()
  const { toasts, show } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const handleAdd = async (payload) => {
    await add(payload)
    show('Streamer added successfully')
  }

  const handleEdit = async (id, updates) => {
    await edit(id, updates)
    show('Streamer updated')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this streamer?')) return
    try {
      await remove(id)
      show('Streamer deleted')
    } catch (err) {
      show(err.message, 'error')
    }
  }

  const handleToggle = async (id, current) => {
    try {
      await toggle(id, !current)
      show(`Streamer ${!current ? 'enabled' : 'disabled'}`)
    } catch (err) {
      show(err.message, 'error')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Streamers</h1>
            <p className="text-valo-muted text-sm font-body mt-0.5">{streamers.length} total streamers</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="valo-btn flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Streamer
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded p-4 text-sm text-red-300">{error}</div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg shimmer" />
            ))}
          </div>
        ) : streamers.length === 0 ? (
          <div className="bg-valo-card border border-valo-border rounded-xl p-12 text-center">
            <p className="text-valo-muted font-body">No streamers yet. Add your first one!</p>
          </div>
        ) : (
          <div className="bg-valo-card border border-valo-border rounded-xl overflow-hidden">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-valo-border">
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-valo-muted uppercase tracking-wider">Platform</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-valo-muted uppercase tracking-wider">ID / Username</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-valo-muted uppercase tracking-wider hidden sm:table-cell">Added</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-valo-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-display font-semibold text-valo-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streamers.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-valo-border/50 hover:bg-white/2 transition-colors ${i === streamers.length - 1 ? 'border-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`text-xs font-display font-semibold uppercase px-2 py-1 rounded ${
                        s.platform === 'youtube' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {s.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-valo-text bg-black/30 px-2 py-1 rounded">
                        {s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-valo-muted text-xs hidden sm:table-cell">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(s.id, s.enabled)}
                        className={`text-xs px-2.5 py-1 rounded-full font-display font-semibold transition-all ${
                          s.enabled
                            ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                            : 'bg-valo-border text-valo-muted hover:bg-green-500/10 hover:text-green-400'
                        }`}
                      >
                        {s.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditTarget(s)}
                          className="text-valo-muted hover:text-white transition-colors p-1.5 hover:bg-valo-border rounded"
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-valo-muted hover:text-valo-red transition-colors p-1.5 hover:bg-valo-red/10 rounded"
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddStreamerModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {editTarget && <EditModal streamer={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}
      <ToastContainer toasts={toasts} />
    </AdminLayout>
  )
}
