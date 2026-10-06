import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import {apiDelete} from '../lib/api'
import Icon from '../components/common/Icon'

export default function DeleteAccountPage(){
 const{user,logout}=useAuth();const nav=useNavigate();const[confirm,setConfirm]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('')
 async function remove(){if(confirm!=='DELETE')return;setBusy(true);setError('');try{await apiDelete('/api/account');await logout();nav('/')}catch(e){setError(e.message)}finally{setBusy(false)}}
 if(!user)return <MainLayout><div className="mx-auto max-w-xl py-16 text-center"><Icon name="shield" size={28} className="mx-auto text-neutral-500"/><p className="mt-4 text-sm text-neutral-400">Sign in to manage your account.</p></div></MainLayout>
 return <MainLayout><div className="mx-auto max-w-xl space-y-5 py-6 sm:py-10"><div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-red-400">ACCOUNT / DANGER ZONE</p><h1 className="mt-1 text-3xl font-display font-black uppercase text-white">Delete account</h1><p className="mt-2 text-sm leading-6 text-neutral-500">This permanently removes your account and user-owned community data. This action cannot be undone.</p></div><div className="rounded-2xl border border-red-500/20 bg-red-500/[.03] p-5"><label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Confirmation</label><input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Type DELETE to confirm" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-red-500/50"/>{error&&<p className="mt-3 text-xs text-red-400">{error}</p>}<button disabled={busy||confirm!=='DELETE'} onClick={remove} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Icon name="trash" size={15}/>{busy?'Deleting…':'Permanently delete account'}</button></div></div></MainLayout>
}
