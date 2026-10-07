import { useState } from 'react'
import InfoPage from '../components/common/InfoPage'
import { apiPost } from '../lib/api'

const TYPES = [
  ['privacy_question','Privacy / data question'],
  ['access','Data access request'],
  ['correction','Correction / update request'],
  ['erasure','Erasure / deletion request'],
  ['grievance','General grievance'],
  ['moderation_grievance','Moderation appeal / grievance'],
]

export default function ContactPage(){
 const [type,setType]=useState('privacy_question')
 const [email,setEmail]=useState('')
 const [details,setDetails]=useState('')
 const [busy,setBusy]=useState(false)
 const [result,setResult]=useState('')
 const [error,setError]=useState('')
 async function submit(e){
  e.preventDefault(); setBusy(true); setError(''); setResult('')
  try{
   const r=await apiPost('/api/privacy-requests',{request_type:type,email:email.trim()||undefined,details:details.trim()},{auth:false})
   setResult(`Request received. Reference: ${r.request_id || 'submitted'}`)
   setDetails('')
  }catch(err){setError(err.message||'Unable to submit the request.')}
  finally{setBusy(false)}
 }
 return <InfoPage eyebrow="SUPPORT / CONTACT" title="Talk to the team" intro="For account, moderation, privacy, legal or technical issues, use the request form below. We issue a reference so the request can be tracked.">
  <div className="grid gap-4 md:grid-cols-2">
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#00e5ff]">GRIEVANCE OFFICER</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">VALO Community Grievance Officer</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">For privacy, moderation, account or unlawful-content grievances, submit the form below or email the grievance channel. Requests are recorded with a reference and can be reviewed by the moderation team.</p>
    <a href="mailto:menatarmsclipz@gmail.com?subject=VALO%20Community%20Grievance" className="mt-5 inline-flex rounded-xl border border-[#ff4655]/25 px-4 py-2.5 text-xs font-black uppercase text-[#ff6674]">Email grievance channel</a>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">RESPONSE TARGETS</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Tracked requests</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">Requests are acknowledged when received and assigned a status. Content-removal complaints are prioritised according to applicable IT Rules timelines.</p>
    <p className="mt-4 text-[11px] leading-5 text-neutral-600">For emergency or unlawful-content matters, include the exact post, comment, account or URL reference.</p>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6 md:col-span-2">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-neutral-600">PRIVACY / GRIEVANCE REQUEST</p>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
       <label><span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-neutral-500">Request type</span><select value={type} onChange={e=>setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#121218] p-3 text-sm text-white outline-none">{TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
       <label><span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-neutral-500">Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/[.03] p-3 text-sm text-white outline-none"/></label>
      </div>
      <label><span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-neutral-500">Details</span><textarea required maxLength={10000} value={details} onChange={e=>setDetails(e.target.value)} rows={6} placeholder="Describe the request, account, content reference or decision you want reviewed…" className="w-full resize-y rounded-xl border border-white/10 bg-white/[.03] p-3 text-sm leading-6 text-white outline-none placeholder:text-neutral-600"/></label>
      {error&&<div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">{error}</div>}
      {result&&<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300">{result}</div>}
      <button disabled={busy} className="rounded-xl bg-[#ff4655] px-5 py-3 text-xs font-black uppercase text-white disabled:opacity-40">{busy?'Submitting…':'Submit request'}</button>
    </form>
   </section>
   <section className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-6 md:col-span-2">
    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-neutral-600">IN-APP REPORTING</p>
    <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Report community content</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-400">For a specific post, comment, user or streamer, the in-app report flow is the fastest route because it preserves the target reference for moderators.</p>
    <a href="/report" className="mt-5 inline-flex rounded-xl bg-white/[.05] px-4 py-2.5 text-xs font-black uppercase text-neutral-200">Open report form</a>
   </section>
  </div>
 </InfoPage>
}
