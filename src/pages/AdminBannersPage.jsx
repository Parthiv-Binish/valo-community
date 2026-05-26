import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../layouts/AdminLayout'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    label: '',
    media_url: '',
    media_type: 'image',
    redirect_url: '',
    placement: 'feed_sidebar',
    is_active: true
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from('platform_banners')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setBanners(data || [])
    } catch (err) {
      console.error('Error fetching advertisements:', err)
      setError('Failed to download active ad placement rosters.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      const { error: insertError } = await supabase
        .from('platform_banners')
        .insert([formData])

      if (insertError) throw insertError

      setSuccessMessage('✨ Promotion node successfully bound to system layout.')
      setFormData({
        label: '',
        media_url: '',
        media_type: 'image',
        redirect_url: '',
        placement: 'feed_sidebar',
        is_active: true
      })
      await fetchBanners()
    } catch (err) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to inject banner data profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleBannerState = async (id, currentStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('platform_banners')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) throw updateError
      
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: !currentStatus } : b))
      )
    } catch (err) {
      console.error('Failed toggling ad availability profile:', err)
      alert('Error updating live node access permissions.')
    }
  }

  const deleteBanner = async (id) => {
    if (!window.confirm('Terminate this promotion vector permanently?')) return
    try {
      const { error: deleteError } = await supabase
        .from('platform_banners')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      setBanners((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Deletion operation error:', err)
      alert('Failed cleaning reference from tracking stack.')
    }
  }

  // Calculate Click-Through Rate Helper
  const calculateCTR = (clicks, impressions) => {
    if (!impressions || impressions === 0) return '0.0%'
    return `${((clicks / impressions) * 100).toFixed(1)}%`
  }

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto px-2 space-y-10">
        
        {/* Header Block */}
        <div className="border-b border-neutral-900 pb-5">
          <h1 className="font-display font-black text-xl tracking-wider text-white uppercase">
            PROMOTIONAL <span className="text-[#ff4655]">TERMINAL</span>
          </h1>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
            Core Panel Interface // Active Advertising Configuration Node
          </p>
        </div>

        {/* Dashboard Split Canvas Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: ADD NEW BANNER CONTEXT BOX CONTAINER */}
          <div className="lg:col-span-1 bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-5">
            <div>
              <h2 className="text-white font-display font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655]" />
                Deploy Objective
              </h2>
              <div className="h-[1px] bg-neutral-900 w-full mt-2" />
            </div>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded font-mono text-[10px] uppercase text-red-400 tracking-wide">
                ⚠️ {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded font-mono text-[10px] uppercase text-emerald-400 tracking-wide">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 uppercase tracking-wider text-[10px]">Internal Label Nickname</label>
                <input
                  type="text"
                  name="label"
                  required
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g., VCT Masters Banner 1"
                  className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#ff4655] transition-colors font-sans font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 uppercase tracking-wider text-[10px]">Media Format</label>
                  <select
                    name="media_type"
                    value={formData.media_type}
                    onChange={handleInputChange}
                    className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#ff4655] transition-colors uppercase tracking-wider text-[11px]"
                  >
                    <option value="image">IMAGE BANNER</option>
                    <option value="video">MP4 VIDEO LOOP</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 uppercase tracking-wider text-[10px]">Placement Layout Site Zone</label>
                  <select
                    name="placement"
                    value={formData.placement}
                    onChange={handleInputChange}
                    className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#ff4655] transition-colors uppercase tracking-wider text-[11px]"
                  >
                    <option value="feed_sidebar">FEED SIDEBAR</option>
                    <option value="grid_break">GRID BREAK LINK</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 uppercase tracking-wider text-[10px]">Asset URL Address (Media URL)</label>
                <input
                  type="url"
                  name="media_url"
                  required
                  value={formData.media_url}
                  onChange={handleInputChange}
                  placeholder="https://supabase-bucket-link.com/banner.jpg"
                  className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#ff4655] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 uppercase tracking-wider text-[10px]">Target Landing Node (Redirect URL)</label>
                <input
                  type="url"
                  name="redirect_url"
                  required
                  value={formData.redirect_url}
                  onChange={handleInputChange}
                  placeholder="https://target-destination.com"
                  className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#ff4655] transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 py-1 select-none">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="accent-[#ff4655] w-3.5 h-3.5"
                />
                <label htmlFor="is_active" className="text-neutral-300 uppercase tracking-wider text-[10px] cursor-pointer">
                  Activate terminal routing immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ff4655] text-white py-2.5 font-display font-black tracking-widest text-[11px] uppercase rounded hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 shadow-md shadow-[#ff4655]/10"
              >
                {isSubmitting ? 'Injecting Node Metrics...' : '⚡ Broadcast Campaign Node'}
              </button>
            </form>
          </div>

          {/* RIGHT: INVENTORY STATUS TRACKER SYSTEM ROSTER */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-white font-display font-black text-xs uppercase tracking-widest">
                Active Tactical Inventory [{banners.length}]
              </h2>
              <div className="h-[1px] bg-neutral-900 w-full mt-2" />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 w-full bg-neutral-900/40 border border-neutral-800/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center border border-dashed border-neutral-800 rounded-xl py-14 font-mono uppercase tracking-tight text-neutral-600 text-xs">
                No inventory active in system logs.
              </div>
            ) : (
              <div className="space-y-3.5">
                {banners.map((adItem) => (
                  <div
                    key={adItem.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-950 border p-3.5 rounded-xl transition-colors ${
                      adItem.is_active ? 'border-neutral-800/80' : 'border-neutral-900 opacity-60'
                    }`}
                  >
                    {/* Element Preview / Label Section */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-16 aspect-[16/10] rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 relative select-none">
                        {adItem.media_type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500 font-mono font-bold bg-neutral-900">MP4</div>
                        ) : (
                          <img src={adItem.media_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="min-w-0 flex flex-col">
                        <span className="text-neutral-200 text-sm font-semibold truncate uppercase tracking-wide">
                          {adItem.label}
                        </span>
                        
                        {/* Placement Status Tag Matrix */}
                        <div className="flex items-center gap-2 mt-1 select-none font-mono text-[9px]">
                          <span className="text-neutral-500 uppercase tracking-tight">{adItem.placement}</span>
                          <span className="text-neutral-800">•</span>
                          <span className={adItem.is_active ? 'text-emerald-500 font-bold' : 'text-neutral-600'}>
                            {adItem.is_active ? '● OPERATIONAL' : '○ STANDBY_LOCK'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Dashboard Grid Metrics (Impressions, Clicks, CTR) */}
                    <div className="grid grid-cols-3 gap-x-5 sm:gap-x-7 text-center font-mono select-none py-1 sm:py-0 border-t border-b sm:border-none border-neutral-900 w-full sm:w-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">VIEWS</span>
                        <span className="text-neutral-300 font-bold text-xs mt-0.5">{adItem.impressions || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">CLICKS</span>
                        <span className="text-[#ff4655] font-bold text-xs mt-0.5">{adItem.clicks || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">CTR</span>
                        <span className="text-neutral-400 font-bold text-xs mt-0.5">
                          {calculateCTR(adItem.clicks || 0, adItem.impressions || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Modification Action Hub Toggles */}
                    <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
                      <button
                        onClick={() => toggleBannerState(adItem.id, adItem.is_active)}
                        className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${
                          adItem.is_active
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                            : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400 hover:brightness-110'
                        }`}
                        title="Toggle Operational Visibility Status"
                      >
                        {adItem.is_active ? 'DISABLE' : 'ENABLE'}
                      </button>

                      <button
                        onClick={() => deleteBanner(adItem.id)}
                        className="p-1.5 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/50 text-neutral-500 hover:text-red-400 rounded transition-colors"
                        title="Purge Node Record"
                      >
                        <TrashIcon />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}