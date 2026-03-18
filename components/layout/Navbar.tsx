import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { signOut } from '@/lib/actions/auth'

const NAV=[{href:'/subjects',label:'সাবজেক্ট'},{href:'/mcq',label:'MCQ ব্যাংক'},{href:'/exam',label:'পরীক্ষা'}]

export function Navbar({ user }:{ user:User|null }){
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center h-14 px-4 gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="white" opacity=".9"/></svg>
          </div>
          BCS প্রস্তুতি
        </Link>
        <nav className="flex items-center gap-1 flex-1">
          {NAV.map(n=>(
            <Link key={n.href} href={n.href} className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user?(
            <>
              <Link href="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">ড্যাশবোর্ড</Link>
              <form action={signOut}><button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">লগআউট</button></form>
            </>
          ):(
            <>
              <Link href="/login" className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">লগইন</Link>
              <Link href="/register" className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">বিনামূল্যে শুরু করুন</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}