// src/pages/admin/AdminAnnouncements.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import AdminLayout from '../layouts/AdminLayout'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    body_text: '',
    version_key: '',
    is_active: true
  })
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // 1. FETCH ALL RECORDS FROM THE DATABASE
  const fetchAllAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('site_announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnnouncements(data || [])
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to sync with announcement records.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllAnnouncements()
  }, [])

  // 2. TOGGLE STATUS (DISABLE/ENABLE INSTANTLY)
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('site_announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Announcement visibility updated successfully!' })
      fetchAllAnnouncements()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle visibility.' })
    }
  }

  // 3. DELETE RECORD
  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this announcement? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('site_announcements')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Announcement record permanently removed.' })
      
      // If we were editing the deleted record, clear the form wrapper
      if (editingId === id) {
        clearForm()
      }
      fetchAllAnnouncements()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete entry.' })
    }
  }

  // 4. LOAD ENTRY INTO FORM FOR EDITING
  const handleEditSelect = (item) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      body_text: item.body_text,
      version_key: item.version_key,
      is_active: item.is_active
    })
  }

  const clearForm = () => {
    setEditingId(null)
    setFormData({ title: '', subtitle: '', body_text: '', version_key: '', is_active: true })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      if (editingId) {
        const { error } = await supabase
          .from('site_announcements')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Announcement modified successfully.' })
      } else {
        const { error } = await supabase.from('site_announcements').insert([formData])
        if (error) throw error
        setMessage({ type: 'success', text: 'New announcement deployed live!' })
      }
      clearForm()
      fetchAllAnnouncements()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit operation.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-neutral-500 animate-pulse font-display text-sm">
          Loading platform announcements panel engine...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header segment */}
        <div>
          <h1 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
            {editingId ? 'Edit Announcement Entry' : 'Create New Site Announcement'}
          </h1>
          <p className="text-xs text-valo-muted font-body">
            Draft popup updates and manage historical records across the public site view.
          </p>
        </div>

        {/* Dynamic Alerts notification bars */}
        {message.text && (
          <div className={`p-4 rounded-lg text-xs font-semibold max-w-4xl ${
            message.type === 'success' 
              ? 'bg-[#53fc18]/10 border border-[#53fc18]/30 text-[#53fc18]' 
              : 'bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff4444]'
          }`}>
            {message.text}
          </div>
        )}

        {/* INPUT MANAGEMENT FORM */}
        <form onSubmit={handleSubmit} className="bg-valo-card border border-valo-border rounded-xl p-5 space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white uppercase tracking-wider font-display">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-black/40 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-valo-red"/>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white uppercase tracking-wider font-display">Version Tracking Key</label>
              <input type="text" name="version_key" value={formData.version_key} onChange={handleInputChange} required placeholder="e.g., v1, v2, updates_may" className="w-full bg-black/40 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-valo-red"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-white uppercase tracking-wider font-display">Subtitle Tagline</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full bg-black/40 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-valo-red"/>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-white uppercase tracking-wider font-display">Content Body text</label>
            <textarea name="body_text" value={formData.body_text} onChange={handleInputChange} required rows={4} className="w-full bg-black/40 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-valo-red font-body resize-y"/>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4 rounded border-neutral-800 bg-black text-valo-red focus:ring-0"/>
              <label htmlFor="is_active" className="text-xs font-semibold text-white select-none cursor-pointer">Make Active Immediately</label>
            </div>

            <div className="flex items-center gap-2">
              {editingId && (
                <button type="button" onClick={clearForm} className="px-4 py-2 border border-neutral-800 text-xs text-neutral-400 rounded font-display uppercase font-semibold hover:text-white">
                  Cancel Edit
                </button>
              )}
              <button type="submit" disabled={isSaving} className="bg-valo-red hover:bg-valo-red/90 disabled:bg-neutral-800 text-white font-display font-bold uppercase text-xs px-5 py-2.5 rounded">
                {isSaving ? 'Processing...' : editingId ? 'Update Record' : 'Publish Announcement'}
              </button>
            </div>
          </div>
        </form>

        {/* 📋 THE ANNOUNCEMENTS HISTORY LOG TABLE */}
        <div className="space-y-3 max-w-4xl">
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            All System Announcements ({announcements.length})
          </h2>

          <div className="bg-valo-card border border-valo-border rounded-xl overflow-hidden">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-xs text-valo-muted font-body">
                No history entries found inside the system database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-neutral-800 text-neutral-400 font-display font-bold uppercase tracking-wider">
                      <th className="p-3">Status</th>
                      <th className="p-3">Version Key</th>
                      <th className="p-3">Title Details</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-body">
                    {announcements.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/20 transition-colors">
                        {/* Status Toggle Badge column */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight transition-all border ${
                              item.is_active 
                                ? 'bg-[#53fc18]/10 border-[#53fc18]/30 text-[#53fc18]' 
                                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                            }`}
                          >
                            {item.is_active ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </td>

                        {/* Version identifier column */}
                        <td className="p-3 font-mono text-neutral-300 font-bold">
                          {item.version_key}
                        </td>

                        {/* Text values summary column */}
                        <td className="p-3">
                          <p className="text-white font-semibold truncate max-w-[240px]">{item.title}</p>
                          <p className="text-neutral-500 text-[11px] truncate max-w-[240px]">{item.body_text}</p>
                        </td>

                        {/* Action Control Trigger options */}
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEditSelect(item)}
                            className="text-neutral-400 hover:text-white transition-colors px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[#ff4444] hover:text-red-400 hover:bg-[#ff4444]/10 transition-all px-2 py-1 rounded text-[11px] font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}