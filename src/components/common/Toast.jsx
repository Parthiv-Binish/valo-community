// Toast.jsx
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
            px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-slide-up backdrop-blur-md
            ${t.type === 'error'
              ? 'bg-red-950/90 border border-red-800 text-red-200'
              : 'bg-neutral-900/90 border border-neutral-800 text-white'
            }
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
} 