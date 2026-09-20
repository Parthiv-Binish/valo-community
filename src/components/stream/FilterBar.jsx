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

      {/* Desktop / mobile filter container */}
      <div
        className="
          inline-flex
          items-center
          gap-1
          p-1
          rounded-xl
          border
          border-valo-border
          bg-black/30
          backdrop-blur-md
          shadow-[0_8px_30px_rgba(0,0,0,0.18)]
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
                items-center
                justify-center
                gap-2
                min-h-[38px]
                px-3
                sm:px-4
                rounded-lg
                font-display
                font-semibold
                text-[11px]
                uppercase
                tracking-wider
                transition-all
                duration-200
                select-none
                outline-none
                focus-visible:ring-2
                focus-visible:ring-valo-red/70

                ${
                  isActive
                    ? `
                      bg-valo-red
                      text-white
                      shadow-[0_0_18px_rgba(255,68,68,0.22)]
                    `
                    : `
                      text-valo-muted
                      hover:text-white
                      hover:bg-white/[0.05]
                    `
                }
              `}
            >

              {/* Active indicator */}
              {isActive && (
                <span
                  className="
                    absolute
                    left-1.5
                    top-1/2
                    -translate-y-1/2
                    w-1
                    h-1
                    rounded-full
                    bg-white
                    shadow-[0_0_8px_rgba(255,255,255,0.8)]
                  "
                  aria-hidden="true"
                />
              )}

              {/* Platform logo */}
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
                        : 'opacity-60 group-hover:opacity-100'
                    }
                  `}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                /* All platforms icon */
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                  className={`
                    transition-transform
                    duration-200
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

              {/* Label */}
              <span className="hidden sm:inline">
                {filter.label}
              </span>

              {/* Mobile label */}
              <span className="sm:hidden">
                {filter.shortLabel}
              </span>

              {/* Count */}
              {count != null && (
                <span
                  className={`
                    min-w-[20px]
                    h-5
                    px-1.5
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    text-[9px]
                    font-mono
                    font-bold
                    leading-none
                    transition-colors
                    ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.05] text-neutral-400 group-hover:text-white'
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
