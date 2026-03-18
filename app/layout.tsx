import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSession } from '@/lib/actions/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default:'BCS প্রস্তুতি — বাংলাদেশের সেরা অনলাইন স্টাডি প্ল্যাটফর্ম', template:'%s | BCS প্রস্তুতি' },
  description: 'BCS ও সরকারি চাকরির সম্পূর্ণ প্রস্তুতি। বিষয়ভিত্তিক PDF লেসন, MCQ প্র্যাকটিস, লাইভ পরীক্ষা।',
}

export default async function RootLayout({ children }:{ children:React.ReactNode }){
  const user = await getSession()
  return (
    <html lang="bn">
      <body className={inter.className}>
        <Navbar user={user}/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}