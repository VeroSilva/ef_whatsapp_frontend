import './globals.css'
import { Montserrat } from 'next/font/google'
import ContextProvider from './pages/context-provider';

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin']
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={montserrat.className}>
          {children}
        </body>
      </ContextProvider>
    </html>
  )
}