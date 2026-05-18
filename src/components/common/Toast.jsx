import { useState, useEffect } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  return { toasts, show }
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            px-4 py-3 rounded shadow-xl border text-sm font-body font-medium animate-slide-up
            ${t.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-red-100'
              : 'bg-valo-card border-valo-red/30 text-valo-text'
            }
          `}
        >
          {t.type === 'success' && <span className="text-green-400 mr-2">✓</span>}
          {t.type === 'error' && <span className="text-red-400 mr-2">✕</span>}
          {t.message}
        </div>
      ))}
    </div>
  )
}
