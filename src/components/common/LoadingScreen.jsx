// LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <img
        src="https://iili.io/Bp6m8Xa.png"
        alt="VALO Community"
        className="h-12 w-12 rounded-lg object-contain mb-4"
      />
      <div className="relative">
        <div className="absolute inset-0 blur-md bg-valo-red/20 rounded-full" />
        <div className="relative w-8 h-8 border-2 border-valo-red/30 border-t-valo-red rounded-full animate-spin" />
      </div>
    </div>
  )
}