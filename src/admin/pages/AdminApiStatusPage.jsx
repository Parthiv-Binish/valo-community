import { useCallback, useEffect, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import Icon from '../../components/common/Icon'
import { apiGet } from '../../lib/api'

const POLL_MS = 30000

function StatusDot({ status }) {
  const good = status === 'ok' || status === 'healthy'
  const warning = status === 'degraded' || status === 'warning'
  return <span className={'inline-block h-2.5 w-2.5 rounded-full ' + (good ? 'bg-emerald-400' : warning ? 'bg-amber-400' : 'bg-red-400')} />
}

function Card({ title, value, subtitle, status }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.02] p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[9px] font-mono uppercase tracking-[.18em] text-neutral-500">{title}</p>
      {status && <StatusDot status={status} />}
    </div>
    <p className="mt-3 text-xl font-display font-black uppercase text-white">{value ?? '—'}</p>
    {subtitle && <p className="mt-1 text-[10px] text-neutral-600">{subtitle}</p>}
  </div>
}

export default function AdminApiStatusPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const result = await apiGet('/api/admin/system-status')
      setData(result)
      setError('')
      setUpdatedAt(new Date())
    } catch (e) {
      setError(e.message || 'Unable to load system status')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, POLL_MS)
    return () => clearInterval(id)
  }, [load])

  const sync = data?.sync || {}
  const db = data?.database || {}
  const failures = sync.source_failures || {}
  const incidents = data?.incidents || []
  const operational = data?.status === 'ok' && db.status === 'ok'

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">ADMIN / SYSTEM MONITOR</p>
          <h1 className="mt-1 text-2xl font-display font-black uppercase text-white">Infrastructure status</h1>
          <p className="mt-1 text-xs text-neutral-500">Live health, sync ownership, database connectivity, source failures and recent incidents.</p>
        </div>
        <button onClick={load} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:bg-white/[.04]">
          <Icon name="refresh" size={13} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-[#ff4655]/25 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Overall" value={loading ? 'Checking' : operational ? 'Operational' : 'Degraded'} status={operational ? 'ok' : 'degraded'} subtitle={updatedAt ? 'Updated ' + updatedAt.toLocaleTimeString() : 'Waiting for health data'} />
        <Card title="Instance role" value={data?.instance_role === 'sync-worker' ? 'Sync worker' : data?.instance_role === 'api-replica' ? 'API replica' : data?.instance_role} subtitle={sync.enabled ? 'Owns background polling' : 'No background polling'} status="ok" />
        <Card title="Database" value={db.status || 'Unknown'} status={db.status} subtitle={db.latency_ms != null ? db.latency_ms + ' ms response' : 'Latency unavailable'} />
        <Card title="Sync cycles" value={sync.cycle_count ?? 0} subtitle={sync.last_success_at ? 'Last success ' + new Date(sync.last_success_at).toLocaleString() : 'No successful cycle recorded'} status={sync.enabled ? 'ok' : 'healthy'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/[.02] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><p className="text-[9px] font-mono uppercase tracking-[.18em] text-neutral-500">Background engine</p><h2 className="mt-1 text-sm font-black uppercase text-white">Streamer synchronization</h2></div>
            <StatusDot status={sync.enabled ? (sync.failure_count ? 'degraded' : 'ok') : 'healthy'} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Enabled" value={sync.enabled ? 'YES' : 'NO'} subtitle={sync.enabled ? 'This instance polls sources' : 'API-only instance'} status="ok" />
            <Card title="Streamers" value={sync.streamer_count ?? 0} subtitle="Enabled records in latest cycle" />
            <Card title="Failures" value={sync.failure_count ?? 0} subtitle="Scheduler-level failures" status={sync.failure_count ? 'degraded' : 'ok'} />
            <Card title="Last cycle" value={sync.last_cycle_at ? new Date(sync.last_cycle_at).toLocaleTimeString() : '—'} subtitle="Latest polling start" />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.02] p-5">
          <p className="text-[9px] font-mono uppercase tracking-[.18em] text-neutral-500">Source failures</p>
          <div className="mt-4 space-y-3">
            {Object.entries(failures).map(([name, count]) => <div key={name} className="flex items-center justify-between rounded-xl border border-white/[.06] bg-black/20 px-3 py-2.5"><span className="text-xs font-bold uppercase text-neutral-300">{name}</span><span className={count ? 'text-xs font-black text-amber-400' : 'text-xs font-black text-emerald-400'}>{count}</span></div>)}
          </div>
          <p className="mt-4 text-[10px] leading-5 text-neutral-600">Failure emails are cooldown-protected to avoid inbox flooding during transient upstream outages.</p>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[.02] p-5">
        <div className="flex items-center justify-between"><div><p className="text-[9px] font-mono uppercase tracking-[.18em] text-neutral-500">Incident feed</p><h2 className="mt-1 text-sm font-black uppercase text-white">Recent failures</h2></div><span className="text-[10px] text-neutral-600">{incidents.length} recorded</span></div>
        <div className="mt-4 space-y-2">
          {incidents.length === 0 && <p className="rounded-xl border border-white/[.06] p-4 text-xs text-emerald-400">No incidents recorded on this instance.</p>}
          {incidents.map((incident, index) => <div key={incident.time + index} className="rounded-xl border border-white/[.06] bg-black/20 p-3">
            <div className="flex flex-wrap items-center gap-2"><StatusDot status={incident.severity === 'warning' ? 'warning' : 'degraded'} /><b className="text-xs text-white">{incident.kind}</b><span className="ml-auto text-[9px] text-neutral-600">{new Date(incident.time).toLocaleString()}</span></div>
            <p className="mt-2 text-[11px] leading-5 text-neutral-400">{incident.message}</p>
          </div>)}
        </div>
      </section>

      <details className="rounded-2xl border border-white/10 bg-white/[.02] p-5">
        <summary className="cursor-pointer text-[9px] font-mono uppercase tracking-[.18em] text-neutral-500">Raw diagnostic payload</summary>
        <pre className="mt-4 max-h-[500px] overflow-auto rounded-xl border border-white/[.06] bg-black/30 p-4 text-[10px] leading-5 text-neutral-500">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  </AdminLayout>
}
