import { ToastProvider } from '@/components/Toast/ToastContext'
import ToastErrorWrapper from '@/components/Toast/ToastErrorWrapper'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <ToastProvider>
      <ToastErrorWrapper />
      <div className={inter.className}>{children}</div>
    </ToastProvider>
    
  )
}
