import { useMemo, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'

const creators = [
  { id: 'kingster', name: 'KINGSTER', x: 22, y: 25, color: '#ff4655', viewers: '12.4K', live: true, level: 12, type: 'War Room' },
  { id: 'nightowl', name: 'NIGHTOWL', x: 67, y: 24, color: '#7c5cff', viewers: '8.1K', live: true, level: 10, type: 'Creator House' },
  { id: 'viper', name: 'VIPERLAB', x: 42, y: 55, color: '#36d399', viewers: '4.6K', live: true, level: 9, type: 'Creator House' },
  { id: 'ace', name: 'ACECLUB', x: 78, y: 61, color: '#f5b83d', viewers: '—', live: false, level: 8, type: 'Training Camp' },
  { id: 'nova', name: 'NOVA', x: 18, y: 70, color: '#35c7ff', viewers: '—', live: false, level: 7, type: 'Creator House' },
]

const trees = [
  [7, 18], [13, 12], [31, 13], [54, 11], [86, 14], [93, 25], [9, 48], [30, 76],
  [53, 79], [91, 73], [86, 86], [12, 84], [59, 27], [36, 31], [74, 42], [4, 64],
]
const rocks = [[28, 43], [61, 17], [88, 48], [51, 68], [73, 78], [35, 84], [4, 34], [96, 58]]
const roads = [
  { d: 'M 5 54 C 23 51 29 48 43 52 C 56 55 65 50 78 48 C 88 46 94 42 100 39', w: 6 },
  { d: 'M 43 52 C 42 39 43 27 48 8', w: 5 },
  { d: 'M 43 52 C 51 61 61 68 72 91', w: 5 },
]

function Tree({ x, y, scale = 1 }) {
  return <g transform={`translate(${x * 10} ${y * 6.5}) scale(${scale})`} className="world-tree">
    <ellipse cx="0" cy="12" rx="11" ry="4" fill="#193e2a" opacity=".32" />
    <path d="M-2 8 L0-3 L3 8Z" fill="#704d2b" />
    <circle cx="-5" cy="0" r="7" fill="#245b36" />
    <circle cx="4" cy="-3" r="8" fill="#2e7140" />
    <circle cx="0" cy="-9" r="6" fill="#3b8750" />
    <circle cx="-2" cy="-11" r="2" fill="#65a85b" opacity=".7" />
  </g>
}

function Rock({ x, y }) {
  return <g transform={`translate(${x * 10} ${y * 6.5})`}>
    <ellipse cx="0" cy="5" rx="9" ry="3" fill="#274132" opacity=".3" />
    <path d="M-8 3 L-4-5 L4-7 L9 0 L5 6 L-5 7Z" fill="#738079" />
    <path d="M-4-5 L4-7 L2-1 L-3 1Z" fill="#a0a8a1" opacity=".65" />
  </g>
}

function House({ item, selected, onSelect }) {
  const sx = item.x * 10
  const sy = item.y * 6.5
  return <g
    transform={`translate(${sx} ${sy})`}
    onClick={() => onSelect(item)}
    className="world-building"
    role="button"
    tabIndex="0"
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(item)}
  >
    <ellipse cx="0" cy="31" rx="43" ry="12" fill="#193321" opacity=".38" />
    <path d="M-38 2 L0-15 L38 2 L38 25 L0 43 L-38 25Z" fill="#b66a3f" stroke="#5e3828" strokeWidth="1.5" />
    <path d="M-38 2 L0-15 L38 2 L0 21Z" fill={item.color} stroke="#4d2e27" strokeWidth="1.5" />
    <path d="M0 21 L38 2 L38 25 L0 43Z" fill="#8c4f36" />
    <path d="M-38 2 L0 21 L0 43 L-38 25Z" fill="#a45d3d" />
    <path d="M-24 1 L0-10 L24 1" fill="none" stroke="#ffd6a1" strokeWidth="3" opacity=".5" />
    <path d="M-8 27 L0 23 L8 27 L8 39 L-8 39Z" fill="#392c2b" />
    <rect x="-25" y="8" width="11" height="9" rx="1" fill="#d7f2ef" opacity=".85" />
    <rect x="14" y="8" width="11" height="9" rx="1" fill="#d7f2ef" opacity=".85" />
    <path d="M-25 12H-14M-19.5 8V17M14 12H25M19.5 8V17" stroke="#54706a" strokeWidth="1" />
    <rect x="-7" y="-9" width="14" height="5" rx="2" fill="#f6c35d" opacity=".9" />
    {item.live && <g className="live-beacon"><circle cx="0" cy="-24" r="5" fill="#ff4655" /><circle cx="0" cy="-24" r="9" fill="#ff4655" opacity=".18" /></g>}
    <text x="0" y="57" textAnchor="middle" className="world-label">{item.name}</text>
    <text x="0" y="67" textAnchor="middle" className="world-level">LVL {item.level}</text>
    {selected && <path d="M-45 34 Q0 51 45 34" fill="none" stroke="#fff" strokeWidth="2" opacity=".9" />}
  </g>
}

function Character({ x, y, color, flip = 1 }) {
  return <g transform={`translate(${x * 10} ${y * 6.5}) scale(${flip} 1)`} className="world-character">
    <ellipse cx="0" cy="15" rx="7" ry="2.5" fill="#163322" opacity=".45" />
    <path d="M-5 4 L5 4 L6 14 L-6 14Z" fill={color} stroke="#252d28" strokeWidth="1" />
    <circle cx="0" cy="-2" r="6" fill="#d99b70" stroke="#513a30" strokeWidth="1" />
    <path d="M-6-3 Q0-11 6-3 L5-6 Q0-12-5-6Z" fill="#2b2630" />
    <circle cx="-2" cy="-1" r="1" fill="#27221f" /><circle cx="2" cy="-1" r="1" fill="#27221f" />
    <path d="M-2 2 Q0 4 2 2" fill="none" stroke="#8d4e4a" strokeWidth="1" />
    <path d="M-7 7 L-11 11 M7 7 L11 11" stroke="#d99b70" strokeWidth="2" strokeLinecap="round" />
  </g>
}

function WorldSvg({ selected, onSelect }) {
  return <svg viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice" className="world-svg">
    <defs>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#68a84f"/><stop offset=".5" stopColor="#4f8d45"/><stop offset="1" stopColor="#3e753b"/></linearGradient>
      <pattern id="grassTexture" width="42" height="42" patternUnits="userSpaceOnUse">
        <path d="M5 25l3-5M19 8l2-4M31 31l3-5M36 13l2-3" stroke="#8fc56a" strokeWidth="1" opacity=".22" />
        <circle cx="12" cy="14" r="1" fill="#315f35" opacity=".25" /><circle cx="26" cy="20" r="1" fill="#315f35" opacity=".2" />
      </pattern>
      <filter id="softShadow"><feGaussianBlur stdDeviation="7" /></filter>
      <linearGradient id="road" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c79b68"/><stop offset="1" stopColor="#a87d50"/></linearGradient>
      <radialGradient id="water"><stop stopColor="#69cde1"/><stop offset="1" stopColor="#318ca6"/></radialGradient>
    </defs>
    <rect width="1000" height="650" fill="#24452d" />
    <path d="M35 0 H965 Q1010 0 1010 45 V605 Q1010 650 965 650 H35 Q0 650 0 605 V45Q0 0 35 0Z" fill="url(#grass)" />
    <rect x="0" y="0" width="1000" height="650" fill="url(#grassTexture)" opacity=".75" />
    <path d="M0 600 Q180 560 300 610 T600 600 T1000 590 V650 H0Z" fill="#2e6036" opacity=".5" />
    <path d="M30 475 Q140 430 220 455 T420 500 T620 475 T820 490 T1000 450" fill="none" stroke="#356b3a" strokeWidth="34" opacity=".28" />
    {roads.map((r, i) => <g key={i}><path d={r.d} fill="none" stroke="#8d6949" strokeWidth={r.w + 5} strokeLinecap="round" opacity=".45" /><path d={r.d} fill="none" stroke="url(#road)" strokeWidth={r.w} strokeLinecap="round" /></g>)}
    <path d="M7 54 C23 51 29 48 43 52 C56 55 65 50 78 48 C88 46 94 42 100 39" fill="none" stroke="#e1bb86" strokeWidth="1.5" strokeDasharray="2 8" opacity=".7" />
    <g transform="translate(455 310)">
      <ellipse cx="0" cy="26" rx="72" ry="22" fill="#24472d" opacity=".4" />
      <path d="M-48 0 L0-27 L48 0 L0 27Z" fill="#d6c08b" stroke="#806e4c" strokeWidth="2" />
      <path d="M-31 0 L0-17 L31 0 L0 17Z" fill="#9a7b54" />
      <path d="M-11 2 L0-4 L11 2 L11 20 L-11 20Z" fill="#3c342b" />
      <circle cx="0" cy="-3" r="5" fill="#f3ca58" opacity=".85" />
      <text x="0" y="46" textAnchor="middle" className="world-label">COMMUNITY TOWN HALL</text>
    </g>
    <g transform="translate(790 330)">
      <ellipse cx="0" cy="25" rx="58" ry="18" fill="#24472d" opacity=".35" />
      <path d="M-38 0 L0-20 L38 0 L0 20Z" fill="url(#water)" stroke="#2c6d7c" strokeWidth="2" />
      <path d="M-15-1 L0-9 L15-1 L0 7Z" fill="#d6c08b" />
      <path d="M-5 1 L0-2 L5 1 L5 11 L-5 11Z" fill="#765333" />
      <text x="0" y="38" textAnchor="middle" className="world-label">FAN LAKE</text>
    </g>
    {trees.map(([x,y], i) => <Tree key={i} x={x} y={y} scale={.72 + (i % 3) * .12} />)}
    {rocks.map(([x,y], i) => <Rock key={i} x={x} y={y} />)}
    <House item={creators[0]} selected={selected?.id === creators[0].id} onSelect={onSelect} />
    <House item={creators[1]} selected={selected?.id === creators[1].id} onSelect={onSelect} />
    <House item={creators[2]} selected={selected?.id === creators[2].id} onSelect={onSelect} />
    <House item={creators[3]} selected={selected?.id === creators[3].id} onSelect={onSelect} />
    <House item={creators[4]} selected={selected?.id === creators[4].id} onSelect={onSelect} />
    <Character x={34} y={50} color="#ff4655" />
    <Character x={55} y={48} color="#7c5cff" flip={-1} />
    <Character x={61} y={57} color="#36d399" />
    <Character x={28} y={61} color="#35c7ff" flip={-1} />
    <Character x={73} y={52} color="#f5b83d" />
    <Character x={48} y={38} color="#ff4655" />
  </svg>
}

export default function AdminWorldPreviewPage() {
  const [selected, setSelected] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const liveCount = useMemo(() => creators.filter(c => c.live).length, [])

  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  return <AdminLayout>
    <style>{`
      .world-shell{position:relative;height:calc(100vh - 105px);min-height:680px;overflow:hidden;border-radius:24px;background:#203b29;border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 80px rgba(0,0,0,.35)}
      .world-viewport{position:absolute;inset:0;overflow:hidden;cursor:grab;background:#24452d}
      .world-viewport:active{cursor:grabbing}
      .world-stage{position:absolute;left:50%;top:50%;width:min(1100px,100vw);height:715px;transform-origin:center;transition:transform .18s ease;will-change:transform}
      .world-svg{width:100%;height:100%;display:block;overflow:visible}
      .world-building{cursor:pointer;transition:filter .18s ease,transform .18s ease}
      .world-building:hover{filter:brightness(1.12) drop-shadow(0 8px 10px rgba(0,0,0,.25))}
      .world-character{animation:worldWalk 3.5s ease-in-out infinite}
      .world-character:nth-of-type(2n){animation-delay:-1.2s}
      .world-tree{transform-box:fill-box;transform-origin:center bottom}
      .world-label{font:900 12px Inter,system-ui,sans-serif;letter-spacing:1.4px;fill:#fff;paint-order:stroke;stroke:#173021;stroke-width:4px;stroke-linejoin:round}
      .world-level{font:800 9px Inter,system-ui,sans-serif;letter-spacing:1.5px;fill:#f5d68b;paint-order:stroke;stroke:#173021;stroke-width:3px}
      .world-ui{font-family:Inter,system-ui,sans-serif}
      @keyframes worldWalk{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      @media(max-width:900px){.world-shell{height:calc(100vh - 90px);min-height:620px}.world-stage{width:1000px;height:650px}.world-label{font-size:11px}}
    `}</style>
    <div className="world-shell world-ui">
      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between p-5 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl border border-white/20 bg-[#1d3325]/90 px-4 py-3 shadow-xl backdrop-blur-md">
          <div className="text-[9px] font-black uppercase tracking-[.28em] text-[#f4d78d]">VALO COMMUNITY</div>
          <div className="mt-1 text-xl font-black tracking-tight text-white">CREATOR VILLAGE</div>
          <div className="mt-1 text-[10px] font-bold text-white/55">WORLD 01 · ADMIN PREVIEW</div>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <div className="rounded-xl border border-white/15 bg-[#1d3325]/90 px-4 py-3 text-center shadow-xl backdrop-blur-md">
            <div className="text-[8px] font-black tracking-widest text-white/45">LIVE</div>
            <div className="text-lg font-black text-white">{liveCount}</div>
          </div>
          <div className="rounded-xl border border-white/15 bg-[#1d3325]/90 px-4 py-3 text-center shadow-xl backdrop-blur-md">
            <div className="text-[8px] font-black tracking-widest text-white/45">VILLAGE</div>
            <div className="mt-1 flex items-center gap-1.5 text-[9px] font-black text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> ONLINE</div>
          </div>
        </div>
      </div>

      <div className="world-viewport"
        onWheel={e => { e.preventDefault(); setZoom(z => Math.min(1.45, Math.max(.72, z - e.deltaY * .0007))) }}
        onPointerDown={e => {
          const start = {x:e.clientX,y:e.clientY,p:pan}
          e.currentTarget.setPointerCapture(e.pointerId)
          const move = ev => setPan({x:start.p.x + ev.clientX-start.x,y:start.p.y + ev.clientY-start.y})
          const up = () => { e.currentTarget.removeEventListener('pointermove',move); e.currentTarget.removeEventListener('pointerup',up) }
          e.currentTarget.addEventListener('pointermove',move); e.currentTarget.addEventListener('pointerup',up)
        }}>
        <div className="world-stage" style={{transform:`translate(calc(-50% + ${pan.x}px),calc(-50% + ${pan.y}px)) scale(${zoom})`}}>
          <WorldSvg selected={selected} onSelect={setSelected} />
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-30 flex items-center gap-1 rounded-2xl border border-white/15 bg-[#1d3325]/92 p-1.5 shadow-xl backdrop-blur-md">
        <button onClick={() => setZoom(z => Math.min(1.45,z+.1))} className="h-9 w-9 rounded-xl text-lg font-black text-white/80 hover:bg-white/10">+</button>
        <div className="w-12 text-center text-[9px] font-black text-white/55">{Math.round(zoom*100)}%</div>
        <button onClick={() => setZoom(z => Math.max(.72,z-.1))} className="h-9 w-9 rounded-xl text-lg font-black text-white/80 hover:bg-white/10">−</button>
        <button onClick={reset} className="ml-1 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white">Reset</button>
      </div>

      <div className="absolute bottom-5 right-5 z-30 max-w-[330px] rounded-2xl border border-white/15 bg-[#1d3325]/94 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.2em] text-white/45"><span className="h-2 w-2 rounded-full bg-[#f5d68b]" /> World controls</div>
        <div className="mt-2 text-[10px] font-semibold leading-relaxed text-white/65">Drag to explore · scroll to zoom · tap a creator house for details</div>
      </div>

      {selected && <div className="absolute right-5 top-28 z-40 w-[290px] overflow-hidden rounded-2xl border border-white/15 bg-[#173021]/96 shadow-2xl backdrop-blur-xl">
        <div className="h-2" style={{background:selected.color}} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div><div className="text-[8px] font-black tracking-[.25em] text-white/40">CREATOR HOUSE</div><div className="mt-1 text-xl font-black text-white">{selected.name}</div><div className="mt-1 text-[10px] font-bold text-white/45">{selected.type} · LEVEL {selected.level}</div></div>
            <button onClick={() => setSelected(null)} className="rounded-lg px-2 py-1 text-xl text-white/40 hover:bg-white/10 hover:text-white">×</button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-black/15 p-3"><div className="text-[8px] font-black tracking-widest text-white/35">STATUS</div><div className={`mt-1 text-xs font-black ${selected.live?'text-red-300':'text-white/65'}`}>{selected.live?'● LIVE':'OFFLINE'}</div></div>
            <div className="rounded-xl bg-black/15 p-3"><div className="text-[8px] font-black tracking-widest text-white/35">VIEWERS</div><div className="mt-1 text-xs font-black text-white">{selected.viewers}</div></div>
          </div>
          {selected.live && <button className="mt-3 w-full rounded-xl py-3 text-[9px] font-black uppercase tracking-[.18em] text-white" style={{background:selected.color,boxShadow:`0 8px 22px ${selected.color}44`}}>Open Live Stream</button>}
        </div>
      </div>
    </div>
  </AdminLayout>
}
