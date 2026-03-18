import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/actions/auth'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'

export const metadata = { title:'ড্যাশবোর্ড', robots:{ index:false } }

export default async function DashboardPage(){
  const user = await getSession()
  if(!user) redirect('/login')

  const supabase = await createServerSupabaseClient()
  const [{ data:profile },{ data:sessions },{ data:liveExam }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id',user.id).single(),
    supabase.from('practice_sessions').select('correct_count,wrong_count,created_at')
      .eq('user_id',user.id).order('created_at',{ascending:false}).limit(50),
    supabase.from('exams').select('id,title,total_questions,duration_minutes').eq('status','live').maybeSingle()
  ])

  const totalMCQ = (sessions??[]).reduce((s:number,x:any)=>s+x.correct_count+x.wrong_count,0)
  const totalCorrect = (sessions??[]).reduce((s:number,x:any)=>s+x.correct_count,0)
  const accuracy = totalMCQ>0 ? Math.round(totalCorrect/totalMCQ*100) : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">স্বাগতম, {profile?.full_name ?? 'শিক্ষার্থী'}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">আজকে কোন সাবজেক্ট পড়বেন?</p>
        </div>
        <div className="flex gap-3">
          {profile?.is_admin && <Link href="/admin" className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">⚙️ Admin</Link>}
          <form action={signOut}><button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">লগআউট</button></form>
        </div>
      </div>

      {liveExam && (
        <div className="bg-white border border-l-4 border-l-red-500 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"/>
              <span className="font-semibold">{liveExam.title} — লাইভ!</span>
            </div>
            <p className="text-sm text-gray-500">{liveExam.total_questions}টি প্রশ্ন · {liveExam.duration_minutes} মিনিট</p>
          </div>
          <Link href={`/exam/${liveExam.id}`} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">পরীক্ষা দিন →</Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[[totalMCQ.toLocaleString(),'মোট MCQ সমাধান'],[accuracy+'%','সঠিক উত্তর'],[(sessions??[]).length+'টি','প্র্যাকটিস সেশন']].map(([v,l])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">{l}</p>
            <p className="text-3xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['📚','সাবজেক্ট পড়ুন','/subjects'],['❓','MCQ প্র্যাকটিস','/mcq/practice'],['🏆','পরীক্ষা','/exam'],['👤','প্রোফাইল','/profile']].map(([ic,l,href])=>(
          <Link key={href} href={href} className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="text-3xl mb-2">{ic}</div>
            <p className="text-sm font-medium">{l}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}