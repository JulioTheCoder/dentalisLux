import { icons } from 'lucide-react'
import './globals.css'
export const metadata = {
  title: 'DentalisLux',
  description: 'Created with v0',

 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

