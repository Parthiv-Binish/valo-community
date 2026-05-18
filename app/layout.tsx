import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Valorant Community",
  description: "Find all live Valorant streamers in one place",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
