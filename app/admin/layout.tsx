import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/actions/auth'
import Link from 'next/link'

export const metadata = { robots:{ index:false } }

const ADMIN_NAV=[
  ['/admin','ড্যাশবোর্ড'],['/admin/content','সাবজেক্ট ট্রি'],
  ['/admin/mcq','MCQ ব্যাংক'],['/admin/exam','পরীক্ষা'],['/admin/users','স্টুডেন্ট']
]

export default async function AdminLayout({ children }:{ children:React.ReactNode }){
  const user = await getSession()
  if(!user) redirect('/login')
  const supabase = await createServerSupabaseClient()
  const { data:profile } = await supabase.from('profiles').select('is_admin').eq('id',user.id).single()
  if(!profile?.is_admin) redirect('/dashboard')

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <aside className="w-48 border-r bg-white flex flex-col">
        <div className="px-4 py-3 border-b">
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">ADMIN</span>
          <p className="text-sm font-bold mt-1">BCS প্ল্যাটফর্ম</p>
        </div>
        <nav className="flex-1 p-2">
          {ADMIN_NAV.map(([href,label])=>(
            <Link key={href} href={href} className="block px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-0.5">{label}</Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">← ড্যাশবোর্ড</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  )
}