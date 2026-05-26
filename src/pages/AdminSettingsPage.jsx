import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../layouts/AdminLayout'

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Direct configuration hooks mapped directly to seeder metrics
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [gateHome, setGateHome] = useState(true)
  const [gateSubs, setGateSubs] = useState(true)
  const [gateSubmit, setGateSubmit] = useState(true)
  const [gateAbout, setGateAbout] = useState(true)
  const [gateLeaderboard, setGateLeaderboard] = useState(true)
  const [gatePredictions, setGatePredictions] = useState(true)

  useEffect(() => {
    async function fetchAllGatingMetrics() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from('app_settings').select('key, value_bool')

        if (data && !error) {
          setMaintenanceMode(data.find(f => f.key === 'maintenance_mode')?.value_bool ?? false)
          setGateHome(data.find(f => f.key === 'page_home')?.value_bool ?? true)
          setGateSubs(data.find(f => f.key === 'page_subscriptions')?.value_bool ?? true)
          setGateSubmit(data.find(f => f.key === 'page_submit')?.value_bool ?? true)
          setGateAbout(data.find(f => f.key === 'page_about')?.value_bool ?? true)
          setGateLeaderboard(data.find(f => f.key === 'page_leaderboard')?.value_bool ?? true)
          setGatePredictions(data.find(f => f.key === 'page_predictions')?.value_bool ?? true)
        }
      } catch (err) {
        console.error('Error compiling settings nodes:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllGatingMetrics()
  }, [])

  async function handleDeployGates() {
    try {
      setIsSaving(true)
      setSaveSuccess(false)

      const payload = [
        { key: 'maintenance_mode', value_bool: maintenanceMode },
        { key: 'page_home', value_bool: gateHome },
        { key: 'page_subscriptions', value_bool: gateSubs },
        { key: 'page_submit', value_bool: gateSubmit },
        { key: 'page_about', value_bool: gateAbout },
        { key: 'page_leaderboard', value_bool: gateLeaderboard },
        { key: 'page_predictions', value_bool: gatePredictions }
      ]

      for (const node of payload) {
        const { error } = await supabase
          .from('app_settings')
          .update({ value_bool: node.value_bool, updated_at: new Date() })
          .eq('key', node.key)
        if (error) throw error
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert('Error updating system configurations.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleItems = [
    { id: 'home', label: 'All Streamers (Home Feed)', state: gateHome, setter: setGateHome, desc: 'Controls main landing layout feed aggregation arrays.' },
    { id: 'subs', label: 'My Subscriptions Feed', state: gateSubs, setter: setGateSubs, desc: 'Controls customized notification mapping rosters for users.' },
    { id: 'submit', label: 'Streamer Submission Node', state: gateSubmit, setter: setGateSubmit, desc: 'Controls access point handlers for request submissions forms.' },
    { id: 'about', label: 'About Project Page', state: gateAbout, setter: setGateAbout, desc: 'Toggles project metadata framework overview notes.' },
    { id: 'lead', label: 'Leaderboard Rankings Component', state: gateLeaderboard, setter: setGateLeaderboard, desc: 'Toggles point trackers and scoreboard metrics sheets.' },
    { id: 'pred', label: 'Radar Habit Predictions Matrix', state: gatePredictions, setter: setGatePredictions, desc: 'Toggles access for scheduling charts and habits calendars.' }
  ]

  return (
    <AdminLayout>
      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-8 animate-fade-in font-mono text-neutral-300">
        
        {/* HEADER BRAND */}
        <div className="border-b border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-xl tracking-wider text-white uppercase flex items-center gap-3">
              <span className="w-1.5 h-5 bg-[#ff4655] rounded-full inline-block" />
              MASTER SYSTEM // <span className="text-[#ff4655]">FEATURE CONTROLS</span>
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
              Live gating controls for all client-facing pages and layouts
            </p>
          </div>
          <button
            onClick={handleDeployGates}
            disabled={isLoading || isSaving}
            className="px-6 py-2.5 bg-[#ff4655] hover:bg-[#e03e4c] disabled:bg-neutral-900 text-white disabled:text-neutral-600 font-mono text-[11px] font-black tracking-widest uppercase rounded active:scale-[0.98] shrink-0 min-w-[140px]"
          >
            {isSaving ? 'UPDATING...' : 'DEPLOY SETTINGS'}
          </button>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-wider px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
            Database feature configurations synchronized successfully. Updates are live.
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-20 w-full bg-neutral-950 border border-neutral-900 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {/* MASTER SYSTEM MAINTENANCE INTERCEPT */}
            <div className={`p-5 rounded-xl border flex items-center justify-between gap-6 ${maintenanceMode ? 'bg-[#ff4655]/5 border-[#ff4655]/30' : 'bg-neutral-950/20 border-neutral-900'}`}>
              <div className="space-y-1">
                <h3 className="text-white text-xs font-black uppercase tracking-wide flex items-center gap-2">
                  Global Maintenance Shield {maintenanceMode && <span className="text-[8px] bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] px-1 rounded">ACTIVE</span>}
                </h3>
                <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">Locks down user routes globally. Admins retain full validation bypass access to test live configurations across pages.</p>
              </div>
              <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 border ${maintenanceMode ? 'bg-[#ff4655] border-[#ff4655]/40' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="h-px bg-neutral-900 w-full" />
            <h2 className="text-[10px] text-neutral-400 tracking-widest uppercase font-bold px-1">// Component Route Access Toggles</h2>

            {/* DYNAMIC COMPONENT LIST GENERATOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toggleItems.map((tab) => (
                <div key={tab.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 transition-colors ${!tab.state ? 'border-amber-500/20 bg-amber-500/[0.01]' : ''}`}>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-neutral-200 text-xs font-bold truncate uppercase tracking-wide flex items-center gap-2">
                      {tab.label}
                      {!tab.state && <span className="text-[7px] bg-amber-500/10 text-amber-500 px-1 rounded border border-amber-500/20">DISABLED</span>}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans line-clamp-2 leading-relaxed">{tab.desc}</p>
                  </div>
                  <button onClick={() => tab.setter(!tab.state)} className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 border shrink-0 ${tab.state ? 'bg-emerald-600 border-emerald-500/40' : 'bg-neutral-900 border-neutral-800'}`}>
                    <div className={`bg-white w-3.5 h-3.5 rounded-full transform transition-transform duration-200 ${tab.state ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}