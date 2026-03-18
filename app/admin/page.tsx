import { createAdminClient } from '@/lib/supabase/server'
export default async function AdminDashboard(){
  const supabase = createAdminClient()
  const [{ count:users },{ count:mcqCount },{ data:live }] = await Promise.all([
    supabase.from('profiles').select('*',{count:'exact',head:true}),
    supabase.from('mcq').select('*',{count:'exact',head:true}).eq('status','published'),
    supabase.from('exams').select('id,title').eq('status','live')
  ])
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">অ্যাডমিন ড্যাশবোর্ড</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[[users??0,'মোট স্টুডেন্ট'],[mcqCount??0,'MCQ ব্যাংক'],[(live??[]).length,'চলমান পরীক্ষা']].map(([v,l])=>(
          <div key={l as string} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">{l}</p>
            <p className="text-2xl font-semibold">{Number(v).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}