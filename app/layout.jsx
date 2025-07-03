import { icons } from 'lucide-react'
import './globals.css'
import { UserProvider } from '@/context/user-context'

export const metadata = {
  title: 'DentalisLux',
  description: 'Created with v0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}

