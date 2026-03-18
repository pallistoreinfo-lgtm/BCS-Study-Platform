import Link from 'next/link'
const LINKS={'পড়াশোনা':[['/subjects','সব সাবজেক্ট'],['/mcq','MCQ ব্যাংক'],['/exam','লাইভ পরীক্ষা']],'অ্যাকাউন্ট':[['/register','রেজিস্ট্রেশন'],['/login','লগইন'],['/dashboard','ড্যাশবোর্ড']],'সাহায্য':[['/contact','যোগাযোগ'],['/privacy','গোপনীয়তা'],['/terms','শর্তাবলি']]}
export function Footer(){
  return (
    <footer className="border-t bg-white mt-16 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div><p className="font-semibold text-sm mb-2">BCS প্রস্তুতি</p><p className="text-xs text-gray-500 leading-relaxed">বাংলাদেশের চাকরি প্রার্থীদের জন্য সবচেয়ে আধুনিক স্টাডি প্ল্যাটফর্ম।</p></div>
        {Object.entries(LINKS).map(([title,items])=>(
          <div key={title}>
            <p className="font-medium text-xs mb-3">{title}</p>
            {items.map(([href,label])=><Link key={href} href={href} className="block text-xs text-gray-500 hover:text-gray-900 mb-2">{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto pt-6 border-t flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
        <span>© {new Date().getFullYear()} BCS প্রস্তুতি। সর্বস্বত্ব সংরক্ষিত।</span>
        <div className="flex gap-2">{['Next.js 14','Supabase','Vercel'].map(t=><span key={t} className="px-2 py-0.5 bg-gray-100 rounded-full">{t}</span>)}</div>
      </div>
    </footer>
  )
}