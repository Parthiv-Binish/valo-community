import { useCallback, useEffect, useRef, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'

const creators = [
  { id: 'kingster', name: 'KINGSTER', x: 560, y: 430, color: '#ff4655', viewers: 12400, live: true, level: 12, type: 'War Room' },
  { id: 'nightowl', name: 'NIGHTOWL', x: 1540, y: 420, color: '#8b6cff', viewers: 8100, live: true, level: 10, type: 'Creator House' },
  { id: 'viper', name: 'VIPERLAB', x: 980, y: 900, color: '#36d399', viewers: 4600, live: true, level: 9, type: 'Creator House' },
  { id: 'ace', name: 'ACECLUB', x: 1760, y: 980, color: '#f5b83d', viewers: 0, live: false, level: 8, type: 'Training Camp' },
  { id: 'nova', name: 'NOVA', x: 430, y: 1080, color: '#35c7ff', viewers: 0, live: false, level: 7, type: 'Creator House' },
]

const trees = Array.from({ length: 42 }, (_, i) => ({
  x: 120 + ((i * 347) % 2050),
  y: 120 + ((i * 193) % 1260),
  s: 0.75 + ((i * 17) % 45) / 100,
})).filter(t => !creators.some(c => Math.hypot(c.x - t.x, c.y - t.y) < 180))

const rocks = Array.from({ length: 18 }, (_, i) => ({
  x: 90 + ((i * 521) % 2200),
  y: 110 + ((i * 271) % 1380),
}))

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function drawIsoTile(ctx, x, y, w, h, fill, stroke = 'rgba(255,255,255,.05)') {
  ctx.beginPath()
  ctx.moveTo(x, y - h / 2)
  ctx.lineTo(x + w / 2, y)
  ctx.lineTo(x, y + h / 2)
  ctx.lineTo(x - w / 2, y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.stroke()
}

function GameWorld({ onSelect, onStats }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    player: { x: 1180, y: 790, speed: 250, dir: 0, bob: 0 },
    camera: { x: 1180, y: 790, zoom: 0.72 },
    keys: {},
    selected: null,
    coins: 120,
    xp: 340,
    visited: new Set(),
    last: performance.now(),
    raf: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const s = stateRef.current
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const down = e => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D','e','E',' '].includes(e.key)) e.preventDefault()
      s.keys[e.key.toLowerCase()] = true
      if (e.key.toLowerCase() === 'e') interact()
    }
    const up = e => { s.keys[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    const pointer = e => {
      const r = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const cam = s.camera
      const wx = (mx - w / 2) / cam.zoom + cam.x
      const wy = (my - h / 2) / cam.zoom + cam.y
      const hit = creators.find(c => Math.hypot(c.x - wx, c.y - wy) < 135)
      if (hit) {
        s.selected = hit
        s.visited.add(hit.id)
        s.coins += hit.live ? 10 : 3
        s.xp += hit.live ? 25 : 8
        onSelect(hit, s.coins, s.xp, s.visited.size)
      }
    }
    canvas.addEventListener('pointerdown', pointer)

    function interact() {
      const p = s.player
      const hit = creators.find(c => Math.hypot(c.x - p.x, c.y - p.y) < 190)
      if (hit) {
        s.selected = hit
        s.visited.add(hit.id)
        s.coins += hit.live ? 10 : 3
        s.xp += hit.live ? 25 : 8
        onSelect(hit, s.coins, s.xp, s.visited.size)
      }
    }

    const draw = now => {
      const dt = Math.min((now - s.last) / 1000, 0.04)
      s.last = now
      const p = s.player
      const k = s.keys
      let dx = 0, dy = 0
      if (k.w || k.arrowup) dy -= 1
      if (k.s || k.arrowdown) dy += 1
      if (k.a || k.arrowleft) dx -= 1
      if (k.d || k.arrowright) dx += 1
      if (dx || dy) {
        const len = Math.hypot(dx, dy)
        dx /= len; dy /= len
        p.x = clamp(p.x + dx * p.speed * dt, 80, 2320)
        p.y = clamp(p.y + dy * p.speed * dt, 80, 1520)
        p.dir = Math.atan2(dy, dx)
        p.bob += dt * 12
      }
      s.camera.x += (p.x - s.camera.x) * Math.min(1, dt * 5)
      s.camera.y += (p.y - s.camera.y) * Math.min(1, dt * 5)

      const w = canvas.clientWidth, h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#101c16'
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.scale(s.camera.zoom, s.camera.zoom)
      ctx.translate(-s.camera.x, -s.camera.y)

      // Terrain
      ctx.fillStyle = '#4d8b48'
      ctx.fillRect(0, 0, 2400, 1600)
      for (let y = 0; y < 1600; y += 64) {
        for (let x = 0; x < 2400; x += 64) {
          drawIsoTile(ctx, x + 32, y + 32, 88, 44, ((x + y) / 64) % 2 ? '#548f4a' : '#518c47')
        }
      }

      // River
      ctx.beginPath()
      ctx.moveTo(0, 1380); ctx.bezierCurveTo(520, 1180, 820, 1450, 1200, 1260)
      ctx.bezierCurveTo(1580, 1080, 1900, 1320, 2400, 1120)
      ctx.lineWidth = 95; ctx.strokeStyle = '#3989a1'; ctx.stroke()
      ctx.lineWidth = 74; ctx.strokeStyle = '#55b1c4'; ctx.stroke()

      // Roads
      ctx.lineCap = 'round'
      ctx.lineWidth = 105; ctx.strokeStyle = '#a47b51'
      const road = p => { ctx.beginPath(); p(); ctx.stroke() }
      road(() => { ctx.moveTo(40, 790); ctx.lineTo(2360, 790) })
      road(() => { ctx.moveTo(1180, 80); ctx.lineTo(1180, 1510) })
      ctx.lineWidth = 72; ctx.strokeStyle = '#d0a16b'
      road(() => { ctx.moveTo(40, 790); ctx.lineTo(2360, 790) })
      road(() => { ctx.moveTo(1180, 80); ctx.lineTo(1180, 1510) })

      // Walls around the central village
      ctx.strokeStyle = '#d7c48e'; ctx.lineWidth = 22
      ctx.strokeRect(270, 250, 1820, 1110)
      ctx.strokeStyle = '#8d7c55'; ctx.lineWidth = 5
      ctx.strokeRect(270, 250, 1820, 1110)

      // Environment
      for (const t of trees) {
        ctx.save(); ctx.translate(t.x, t.y); ctx.scale(t.s, t.s)
        ctx.fillStyle = 'rgba(22,51,30,.28)'; ctx.beginPath(); ctx.ellipse(0, 32, 36, 12, 0, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#6b452b'; ctx.fillRect(-8, 4, 16, 34)
        ctx.fillStyle = '#2e6739'; ctx.beginPath(); ctx.arc(-18, 0, 30, 0, Math.PI*2); ctx.arc(16, -4, 34, 0, Math.PI*2); ctx.arc(0, -27, 29, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#4b8b49'; ctx.beginPath(); ctx.arc(-9, -30, 13, 0, Math.PI*2); ctx.fill()
        ctx.restore()
      }
      for (const r of rocks) {
        ctx.fillStyle = 'rgba(28,50,33,.25)'; ctx.beginPath(); ctx.ellipse(r.x, r.y+10, 24, 9, 0, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#778277'; ctx.beginPath(); ctx.moveTo(r.x-22,r.y+5);ctx.lineTo(r.x-9,r.y-18);ctx.lineTo(r.x+17,r.y-14);ctx.lineTo(r.x+25,r.y+4);ctx.lineTo(r.x+5,r.y+16);ctx.closePath();ctx.fill()
      }

      // Town hall
      drawBuilding(ctx, { x: 1080, y: 610, color: '#f0c65b', name: 'VALO TOWN HALL', level: 5, live: false, central: true })

      // Creator buildings + live beacons
      for (const c of creators) drawBuilding(ctx, c)

      // NPCs
      const npcs = [
        [760,690,'#4cc9f0'],[1430,690,'#f72585'],[820,1010,'#90be6d'],[1380,1040,'#f9c74f'],[1080,1040,'#577590']
      ]
      for (const [x,y,col] of npcs) drawCharacter(ctx, x, y, col, now / 300)

      // Player
      drawCharacter(ctx, p.x, p.y, '#ff4655', p.bob)

      ctx.restore()

      // Game HUD is intentionally minimal; gameplay remains visible.
      if (now - (s.lastHud || 0) > 250) { s.lastHud = now; onStats({ coins: s.coins, xp: s.xp, visited: s.visited.size, live: creators.filter(c => c.live).length }) }
      s.raf = requestAnimationFrame(draw)
    }

    function drawBuilding(ctx, c) {
      const x = c.x, y = c.y
      ctx.save()
      ctx.translate(x, y)
      ctx.fillStyle = 'rgba(20,42,27,.35)'; ctx.beginPath(); ctx.ellipse(0, 72, 105, 32, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = c.central ? '#a96d3e' : '#9b5c3b'
      ctx.beginPath(); ctx.moveTo(-82,5);ctx.lineTo(0,-45);ctx.lineTo(82,5);ctx.lineTo(82,66);ctx.lineTo(0,105);ctx.lineTo(-82,66);ctx.closePath();ctx.fill()
      ctx.fillStyle = c.color || '#c78d52'
      ctx.beginPath();ctx.moveTo(-82,5);ctx.lineTo(0,-45);ctx.lineTo(82,5);ctx.lineTo(0,50);ctx.closePath();ctx.fill()
      ctx.fillStyle = '#e8c38b'; ctx.fillRect(-18,50,36,55)
      ctx.fillStyle = '#b9e5e8'; ctx.fillRect(-57,22,25,22);ctx.fillRect(32,22,25,22)
      ctx.fillStyle = '#3a2b26'; ctx.fillRect(-7,74,14,31)
      if (c.live) {
        ctx.fillStyle = '#ff4655'; ctx.beginPath(); ctx.arc(0,-72,10,0,Math.PI*2);ctx.fill()
        ctx.strokeStyle = 'rgba(255,70,85,.35)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,-72,18,0,Math.PI*2);ctx.stroke()
      }
      ctx.fillStyle = '#fff'; ctx.font = '900 22px system-ui';ctx.textAlign='center';ctx.strokeStyle='#173021';ctx.lineWidth=6
      ctx.strokeText(c.name,0,145);ctx.fillText(c.name,0,145)
      ctx.fillStyle = '#f5d68b';ctx.font='800 15px system-ui';ctx.strokeStyle='#173021';ctx.lineWidth=4
      ctx.strokeText('LVL ' + c.level,0,167);ctx.fillText('LVL ' + c.level,0,167)
      ctx.restore()
    }

    function drawCharacter(ctx, x, y, color, phase) {
      ctx.save(); ctx.translate(x, y + Math.sin(phase) * 3)
      ctx.fillStyle='rgba(20,42,27,.35)';ctx.beginPath();ctx.ellipse(0,24,20,8,0,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#d89b70';ctx.beginPath();ctx.arc(0,-9,17,0,Math.PI*2);ctx.fill()
      ctx.fillStyle='#20252d';ctx.beginPath();ctx.arc(0,-15,17,Math.PI,Math.PI*2);ctx.fill()
      ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-17,7,34,32,7);ctx.fill()
      ctx.fillStyle='#20252d';ctx.fillRect(-14,38,10,20);ctx.fillRect(4,38,10,20)
      ctx.restore()
    }

    s.raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(s.raf)
      ro.disconnect()
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      canvas.removeEventListener('pointerdown', pointer)
    }
  }, [onSelect, onStats])

  return <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label="Playable VALO Community village game" />
}

export default function AdminWorldPreviewPage() {
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState({ coins: 120, xp: 340, visited: 0, live: 3 })
  const handleSelect = useCallback((c, coins, xp, visited) => setSelected({ ...c, coins, xp, visited }), [])
  const handleStats = useCallback(next => setStats(next), [])

  return <AdminLayout>
    <div className="relative min-h-[calc(100vh-105px)] overflow-hidden rounded-3xl border border-white/10 bg-[#101c16] shadow-2xl">
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#16271c]/90 px-4 py-3 backdrop-blur">
          <div className="text-[9px] font-black uppercase tracking-[.25em] text-[#f5d68b]">VALO COMMUNITY</div>
          <div className="text-xl font-black text-white">CREATOR KINGDOM</div>
          <div className="text-[10px] font-bold text-white/45">PLAYABLE ADMIN WORLD · {stats.visited}/5 HOUSES VISITED</div>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <div className="rounded-xl border border-white/10 bg-[#16271c]/90 px-4 py-2 text-center"><div className="text-[8px] text-white/40">LIVE</div><b className="text-white">{stats.live}</b></div>
          <div className="rounded-xl border border-white/10 bg-[#16271c]/90 px-4 py-2 text-center"><div className="text-[8px] text-white/40">COINS</div><b className="text-[#f5d68b]">{stats.coins}</b></div>
          <div className="rounded-xl border border-white/10 bg-[#16271c]/90 px-4 py-2 text-center"><div className="text-[8px] text-white/40">XP</div><b className="text-white">{stats.xp}</b></div>
        </div>
      </div>

      <GameWorld
        onSelect={handleSelect}
        onStats={handleStats}
      />

      <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-white/10 bg-[#16271c]/90 px-4 py-3 text-white/70 backdrop-blur">
        <div className="text-[9px] font-black uppercase tracking-[.2em] text-[#f5d68b]">HOW TO PLAY</div>
        <div className="mt-1 text-[11px]">WASD / Arrow Keys · Walk · E / Click · Interact</div>
      </div>

      {selected && <div className="absolute right-4 top-24 z-30 w-[300px] rounded-2xl border border-white/15 bg-[#14261b]/96 p-5 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div><div className="text-[8px] font-black tracking-[.25em] text-white/40">CREATOR HOUSE</div><div className="mt-1 text-2xl font-black">{selected.name}</div><div className="mt-1 text-[10px] font-bold text-white/45">{selected.type} · LEVEL {selected.level}</div></div>
          <button type="button" onClick={() => setSelected(null)} className="rounded-lg px-2 py-1 text-xl text-white/40 hover:bg-white/10">×</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-black/20 p-3"><div className="text-[8px] text-white/35">STATUS</div><div className={`mt-1 text-xs font-black ${selected.live ? 'text-red-300' : 'text-white/60'}`}>{selected.live ? '● LIVE' : 'OFFLINE'}</div></div>
          <div className="rounded-xl bg-black/20 p-3"><div className="text-[8px] text-white/35">VIEWERS</div><div className="mt-1 text-xs font-black">{selected.live ? selected.viewers.toLocaleString() : '—'}</div></div>
        </div>
        {selected.live && <button type="button" className="mt-3 w-full rounded-xl bg-[#ff4655] py-3 text-[10px] font-black uppercase tracking-widest text-white hover:brightness-110">Open Live Stream</button>}
        <div className="mt-3 text-[10px] text-white/45">{`Interaction reward: +${selected.live ? 10 : 3} coins · +${selected.live ? 25 : 8} XP`}</div>
      </div>
    </div>
  </AdminLayout>
}
