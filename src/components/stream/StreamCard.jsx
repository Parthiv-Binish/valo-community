return (
  <div className="group bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 animate-fade-in flex flex-col justify-between">

    {/* ─── Preview area (outside <a> when showing live embed) ─── */}
    <div className="relative aspect-video bg-[#111] overflow-hidden">

      {kickEmbedUrl ? (
        /* Kick live: iframe NOT inside <a> to avoid invalid nesting */
        <>
          <iframe
            src={kickEmbedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
          {/* Clickable overlay to open link — sits on top but lets iframe through on direct click */}
          
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-0 bottom-0 h-10 z-20"
          />
        </>
      ) : (
        /* Everything else wrapped in <a> as before */
        <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
          {youtubeThumbnail ? (
            <>
              <img
                src={youtubeThumbnail}
                alt={streamer.channelName}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                {streamer.avatar ? (
                  <img
                    src={streamer.avatar}
                    alt={streamer.channelName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-xl"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold"
                    style={{ background: `${cfg.accentColor}20`, color: cfg.accentColor }}
                  >
                    {avatarLetter}
                  </div>
                )}
                <div className="text-center space-y-1">
                  <p className="text-white font-display font-bold text-lg line-clamp-1">
                    {streamer.channelName}
                  </p>
                  <p className="text-sm text-valo-muted font-body">
                    {isLive ? `is live on ${cfg.label}` : `is offline on ${cfg.label}`}
                  </p>
                </div>
              </div>
            </>
          )}
        </a>
      )}

      {/* Badges always on top */}
      {isLive && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="live-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
            LIVE
          </span>
        </div>
      )}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
          <img
            src={cfg.logo}
            alt={cfg.label}
            className="h-3 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      </div>
      {isLive && streamer.viewerCount != null && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
          {formatViewerCount(streamer.viewerCount)} watching
        </div>
      )}
    </div>

    {/* Rest of card — meta row + footer, wrapped in <a> */}
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      <div className="px-3 pt-3">
        <p className="text-sm font-body text-valo-muted">
          {isLive
            ? `${streamer.channelName} is currently live`
            : `Visit ${streamer.channelName}'s channel`
          }
        </p>
      </div>
    </a>

    {/* Footer */}
    <div className="p-3 pt-1 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {streamer.avatar ? (
            <img
              src={streamer.avatar}
              alt={streamer.channelName}
              className="w-5 h-5 rounded-full object-cover shrink-0"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold font-display"
              style={{ background: `${cfg.accentColor}20`, color: cfg.accentColor }}
            >
              {avatarLetter}
            </div>
          )}
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs text-valo-muted font-body truncate">
              {streamer.channelName}
            </span>
            {streamer.verified && (
              <svg className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z"/>
              </svg>
            )}
          </div>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-display font-semibold px-2 py-0.5 rounded ${cfg.bgClass}`}>
          <img
            src={cfg.logo}
            alt={cfg.label}
            className="h-2.5 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          {cfg.label}
        </span>
      </div>

      <div className="flex gap-2 items-center w-full">
        
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex-1 text-center text-xs font-display font-semibold py-2 rounded transition-all duration-150 decoration-transparent select-none
            ${isLive
              ? 'bg-valo-red text-white hover:brightness-110'
              : 'border border-valo-border text-valo-muted hover:border-valo-muted hover:text-white'
            }
          `}
        >
          {isLive ? 'Watch Live' : 'View Channel'}
        </a>
        <NotifyButton streamerId={streamer.id || streamer.streamer_id || streamer.channelId} />
      </div>
    </div>
  </div>
);
