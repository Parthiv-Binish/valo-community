import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiPost } from '../lib/api'

const TERMS_VERSION = '2026-10-07'
const PRIVACY_VERSION = '2026-10-07'

export default function LegalGate({ onAccepted }) {
  const [dob, setDob] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!dob || !confirmed) {
      setError('Enter your date of birth and confirm that you are 18 or older.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await apiPost('/api/legal/accept', {
        terms_version: TERMS_VERSION,
        privacy_version: PRIVACY_VERSION,
        date_of_birth: dob,
        age_confirmed: true,
      })
      onAccepted()
    } catch (err) {
      setError(err.message || 'Unable to complete the legal confirmation.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl">
    <form onSubmit={submit} className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0c0c11] p-6 shadow-2xl sm:p-8">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[.22em] text-[#ff4655]">LEGAL / ACCOUNT ACCESS</p>
      <h1 className="mt-2 font-display text-2xl font-black uppercase text-white">Before you continue</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-400">VALO Community currently accepts users aged 18 or older. Please review the current legal documents and confirm your age before using community features.</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link to="/privacy" target="_blank" className="rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-neutral-300 hover:border-white/20 hover:text-white">Privacy Policy</Link>
        <Link to="/terms" target="_blank" className="rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-neutral-300 hover:border-white/20 hover:text-white">Terms & Conditions</Link>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-neutral-500">Date of birth</span>
        <input type="date" value={dob} onChange={e=>setDob(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/[.03] p-3 text-sm text-white outline-none focus:border-[#ff4655]/50"/>
      </label>
      <label className="mt-4 flex items-start gap-3 rounded-xl border border-white/[.06] bg-white/[.02] p-3">
        <input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1 accent-[#ff4655]"/>
        <span className="text-xs leading-5 text-neutral-400">I confirm that I am at least 18 years old and agree to the current Privacy Policy and Terms & Conditions.</span>
      </label>
      {error&&<p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">{error}</p>}
      <button disabled={busy||!dob||!confirmed} className="mt-5 w-full rounded-xl bg-[#ff4655] px-5 py-3 text-xs font-black uppercase text-white disabled:opacity-40">{busy?'Verifying…':'Continue to VALO Community'}</button>
      <p className="mt-4 text-[10px] leading-5 text-neutral-600">Your date of birth is used for age eligibility verification and is not stored by VALO Community.</p>
    </form>
  </div>
}
