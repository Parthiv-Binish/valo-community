export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-valo-dark flex flex-col items-center justify-center z-[100]">
      <img
        src="https://iili.io/Bp6m8Xa.png"
        alt="VALO Community"
        className="h-16 w-16 rounded-lg object-contain mb-6 animate-pulse"
      />
      <h1 className="font-display font-bold text-2xl text-white mb-1">
        Let's Build <span className="text-valo-red">VALO Community</span>
      </h1>
      <p className="text-valo-muted text-sm mb-8">Fetching live streams...</p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-valo-red"
            style={{ animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to   { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
