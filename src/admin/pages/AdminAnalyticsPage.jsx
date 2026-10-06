import {useEffect,useState} from 'react'
import AdminLayout from '../layouts/AdminLayout'
import Icon from '../components/common/Icon'
import {apiGet} from '../lib/api'

const cards=[['users','Users','users'],['posts','Posts','edit'],['likes','Likes','heart'],['comments','Comments','message'],['reports','Reports','flag'],['streamers','Streamers','eye'],['live_streamers','Live now','radio'],['subscriptions','Subscriptions','bell'],['notifications','Notifications','bell'],['email_queue','Emails queued','mail'],['banners','Banners','image'],['stream_history','Stream sessions','clock']]
export default function AdminAnalyticsPage(){
 const[data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('')
 async function load(){setLoading(true);try{setData(await apiGet('/api/admin/analytics'))}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 const m=data?.metrics||{}
 return <AdminLayout><div className="space-y-6">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">ADMIN / INSIGHTS</p><h1 className="mt-1 text-2xl font-display font-black uppercase text-white">Community analytics</h1><p className="mt-1 text-xs text-neutral-500">Live operational metrics across community, moderation and streaming.</p></div><button onClick={load} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white">Refresh</button></div>
  {error&&<div className="rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</div>}
  {loading?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({length:12}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-2xl border border-white/[.06] bg-white/[.02]"/>)}</div>:<>
   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{cards.map(([key,label,icon])=><div key={key} className="rounded-2xl border border-white/[.08] bg-white/[.02] p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-mono uppercase tracking-wider text-neutral-600">{label}</span><Icon name={icon} size={14} className="text-neutral-700"/></div><p className="mt-4 font-display text-2xl font-black text-white">{Number(m[key]||0).toLocaleString()}</p></div>)}</div>
   <div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5"><p className="text-[9px] font-mono uppercase tracking-[.2em] text-neutral-600">Moderation queue</p><div className="mt-5 grid grid-cols-4 gap-2">{[['open','Open'],['reviewing','Reviewing'],['resolved','Resolved'],['dismissed','Dismissed']].map(([k,l])=><div key={k} className="rounded-xl bg-white/[.03] p-3"><p className="text-[9px] uppercase text-neutral-600">{l}</p><p className="mt-2 text-lg font-black text-white">{m[k+'_reports']||0}</p></div>)}</div></section><section className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5"><p className="text-[9px] font-mono uppercase tracking-[.2em] text-neutral-600">Current signal</p><div className="mt-5 flex items-center gap-3"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff4655]"/><div><p className="text-sm font-bold text-white">{m.live_streamers||0} streamers live</p><p className="text-xs text-neutral-600">Metrics generated {data?.generated_at?new Date(data.generated_at).toLocaleString():'—'}</p></div></div></section></div>
  </>}
 </div></AdminLayout>
}