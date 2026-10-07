import React from 'react'

const paths={
  menu:'M4 6h16M4 12h16M4 18h16',
  close:'M6 6l12 12M18 6L6 18',
  bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  heart:'M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A5.2 5.2 0 0 1 13 5.9a5.2 5.2 0 0 1 7.8 2.9Z',
  bookmark:'M6 4h12v17l-6-4-6 4V4Z',
  message:'M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4A8.5 8.5 0 1 1 21 11.5Z',
  share:'M4 12v7h16v-7M12 16V3m0 0-5 5m5-5 5 5',
  more:'M5 12h.01M12 12h.01M19 12h.01',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm6-2 4 4',
  plus:'M12 5v14M5 12h14',
  image:'M4 5h16v14H4zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 5-4-4-4 4-2-2-4 4',
  video:'M15 10l5-3v10l-5-3M4 6h11v12H4z',
  flag:'M5 21V4m0 0c4-3 7 3 14 0v9c-7 3-10-3-14 0',
  shield:'M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z',
  user:'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-3a4 4 0 0 1 0 8m2 5v-2a4 4 0 0 0-3-3',
  dashboard:'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
  database:'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0V6Zm0 0c0 2 16 2 16 0M4 12c0 2 16 2 16 0',
  settings:'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.4 1.4-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L9 17l.1-.1A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.6-1H7.6v-2h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L9 9l1.4-1.4.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 9l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2H21a1.7 1.7 0 0 0-1.6 1Z',
  logout:'M10 17l5-5-5-5M15 12H3m12-7h4v14h-4',
  arrow:'M5 12h14m-6-6 6 6-6 6',
  check:'m5 12 4 4L19 6',
  trash:'M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3',
  edit:'M4 20h4L19 9l-4-4L4 16v4Z',
  eye:'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  ban:'M18.4 5.6a9 9 0 1 0-12.8 12.8A9 9 0 0 0 18.4 5.6ZM5.6 5.6l12.8 12.8',
  filter:'M4 6h16M7 12h10M10 18h4',
  chevron:'m6 9 6 6 6-6'
}

export default function Icon({name,size=18,strokeWidth=1.8,fill='none',className=''}) {
 const d=paths[name]
 if(!d) return null
 return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d}/></svg>
}
