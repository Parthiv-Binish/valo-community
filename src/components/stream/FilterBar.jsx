const FILTERS = [
  { id: 'all', label: 'All Platforms' },
  {
    id: 'youtube',
    label: 'YouTube',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/500px-YouTube_2024.svg.png',
  },
  {
    id: 'kick',
    label: 'Kick',
    logo: 'https://kick.com/img/kick-logo.svg',
  },
]

export default function FilterBar({ active, onChange, counts = {} }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`
            flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-display font-semibold
            border transition-all duration-150
            ${active === f.id
              ? 'bg-valo-red border-valo-red text-white'
              : 'border-valo-border text-valo-muted hover:border-valo-muted hover:text-valo-text'
            }
          `}
        >
          {f.logo && (
            <img
              src={f.logo}
              alt={f.label}
              className="h-3.5 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
          {f.label}
          {counts[f.id] != null && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
              active === f.id ? 'bg-white/20' : 'bg-valo-card'
            }`}>
              {counts[f.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
