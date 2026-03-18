import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/actions/auth'

export default async function HomePage(){
  const user = await getSession()
  if(user) redirect('/dashboard')

  const supabase = await createServerSupabaseClient()
  const { data:subjects } = await supabase.from('subjects')
    .select('id,name,slug,icon,description').eq('is_published',true).order('order_index')

  return (
    <div>
      <section className="text-center py-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          BCS ও সরকারি চাকরির<br/>
          <span className="text-blue-600">সম্পূর্ণ প্রস্তুতি</span> এক জায়গায়
        </h1>
        <p className="text-gray-500 text-lg mb-8">বিষয়ভিত্তিক পড়াশোনা, লাইভ পরীক্ষা, MCQ প্র্যাকটিস — সম্পূর্ণ বিনামূল্যে।</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">বিনামূল্যে শুরু করুন →</Link>
          <Link href="/login" className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">লগইন করুন</Link>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">সব সাবজেক্ট</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(subjects??[]).map((s:any)=>(
            <div key={s.id} className="border border-gray-200 rounded-xl p-5 bg-white hover:border-gray-300 transition-colors">
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="font-semibold text-sm">{s.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}