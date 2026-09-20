const FILTERS = [
  {
    id: 'all',
    label: 'All',
    shortLabel: 'ALL',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    shortLabel: 'YT',
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
  },
  {
    id: 'kick',
    label: 'Kick',
    shortLabel: 'KICK',
    logo: 'https://kick.com/img/kick-logo.svg',
  },
]

export default function FilterBar({
  active,
  onChange,
  counts = {},
}) {
  return (
    <div className="w-full">
      <div
        className="
          flex
          w-full
          items-center
          gap-2
          overflow-x-auto
          scrollbar-none
          rounded-2xl
          border
          border-white/[0.07]
          bg-[#0b0c10]/90
          p-1.5
          backdrop-blur-xl
          shadow-[0_12px_40px_rgba(0,0,0,0.2)]
        "
      >
        {FILTERS.map((filter) => {
          const isActive = active === filter.id
          const count = counts[filter.id]

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id)}
              aria-pressed={isActive}
              className={`
                group
                relative
                flex
                min-h-[42px]
                shrink-0
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                px-3
                sm:px-5
                font-display
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                outline-none
                transition-all
                duration-200
                focus-visible:ring-2
                focus-visible:ring-valo-red/70
                ${
                  isActive
                    ? `
                      bg-valo-red
                      text-white
                      shadow-[0_0_24px_rgba(255,68,68,0.16)]
                    `
                    : `
                      text-neutral-500
                      hover:bg-white/[0.035]
                      hover:text-white
                    `
                }
              `}
            >
              {isActive && (
                <span
                  className="
                    absolute
                    bottom-1.5
                    left-1/2
                    h-0.5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    bg-white
                    shadow-[0_0_8px_rgba(255,255,255,0.75)]
                  "
                  aria-hidden="true"
                />
              )}

              {filter.logo ? (
                <img
                  src={filter.logo}
                  alt=""
                  aria-hidden="true"
                  className={`
                    h-3
                    max-w-[42px]
                    object-contain
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? 'opacity-100'
                        : 'opacity-45 group-hover:opacity-100'
                    }
                  `}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                  className={`
                    transition-transform
                    duration-300
                    ${
                      isActive
                        ? 'rotate-90'
                        : 'group-hover:rotate-45'
                    }
                  `}
                >
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M3.5 12h17" />
                  <path d="M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5" />
                  <path d="M12 3.5C9.5 5.9 8.2 8.7 8.2 12s1.3 6.1 3.8 8.5" />
                </svg>
              )}

              <span className="hidden sm:inline">
                {filter.label}
              </span>

              <span className="sm:hidden">
                {filter.shortLabel}
              </span>

              {count != null && (
                <span
                  className={`
                    inline-flex
                    min-w-[22px]
                    h-5
                    items-center
                    justify-center
                    rounded-md
                    px-1.5
                    text-[9px]
                    font-mono
                    font-bold
                    leading-none
                    transition-colors
                    ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.05] text-neutral-500 group-hover:text-white'
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
