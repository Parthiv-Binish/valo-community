import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Icon from './Icon'

const MAX_SIZE = 50 * 1024 * 1024
const ACCEPT = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']

export default function MediaUploader({ userId, value, onChange }) {
  const inputRef=useRef(null)
  const [uploading,setUploading]=useState(false)
  const [error,setError]=useState('')
  const [preview,setPreview]=useState(value?.url||'')

  useEffect(()=>{setPreview(value?.url||'')},[value?.url])

  async function upload(file){
    setError('')
    if(!file)return
    if(!ACCEPT.includes(file.type)){setError('Use JPG, PNG, WEBP, GIF, MP4, WEBM or MOV.');return}
    if(file.size>MAX_SIZE){setError('Media must be 50 MB or smaller.');return}
    if(!userId){setError('Sign in before uploading media.');return}

    setUploading(true)
    const ext=(file.name.split('.').pop()||'bin').toLowerCase()
    const path=`${userId}/${crypto.randomUUID()}.${ext}`
    const {error:uploadError}=await supabase.storage.from('community-media').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type})
    if(uploadError){setError(uploadError.message);setUploading(false);return}
    const {data}=supabase.storage.from('community-media').getPublicUrl(path)
    const mediaType=file.type.startsWith('video/')?'video':'image'
    const next={url:data.publicUrl,type:mediaType,path}
    setPreview(data.publicUrl)
    onChange?.(next)
    setUploading(false)
  }

  async function remove(){
    if(value?.path) await supabase.storage.from('community-media').remove([value.path])
    setPreview('')
    onChange?.(null)
    if(inputRef.current) inputRef.current.value=''
  }

  const isVideo=value?.type==='video'
  return <div className="mt-4">
    {preview ? <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
      {isVideo?<video src={preview} controls playsInline className="max-h-[520px] w-full object-contain"/>:<img src={preview} alt="Post media preview" className="max-h-[520px] w-full object-contain"/>}
      <button type="button" onClick={remove} disabled={uploading} aria-label="Remove media" title="Remove media" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/75 text-neutral-200 hover:text-[#ff4655]"><Icon name="trash" size={16}/></button>
    </div> : <button type="button" onClick={()=>inputRef.current?.click()} disabled={uploading} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[.02] px-5 py-8 text-sm text-neutral-400 transition hover:border-[#ff4655]/30 hover:bg-white/[.04] hover:text-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.05] text-[#ff4655]"><Icon name="image" size={19}/></span>
      <span className="text-left"><span className="block font-bold">{uploading?'Uploading…':'Add photo or video'}</span><span className="mt-1 block text-[11px] text-neutral-600">Up to 50 MB · images and short clips</span></span>
    </button>}
    <input ref={inputRef} hidden type="file" accept={ACCEPT.join(',')} onChange={e=>upload(e.target.files?.[0])}/>
    {error&&<p className="mt-2 text-xs text-[#ff6674]">{error}</p>}
  </div>
}
