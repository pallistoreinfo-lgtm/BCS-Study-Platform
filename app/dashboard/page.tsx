import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata = { title: 'ড্যাশবোর্ড', robots: { index: false } }

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('score, correct_count, wrong_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const totalMCQ = (sessions ?? []).reduce((s: number, x: any) => s + (x.correct_count ?? 0) + (x.wrong_count ?? 0), 0)
  const totalCorrect = (sessions ?? []).reduce((s: number, x: any) => s + (x.correct_count ?? 0), 0)
  const accuracy = totalMCQ > 0 ? Math.round(totalCorrect / totalMCQ * 100) : 0

  const isAdmin = profile?.is_admin === true

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>ড্যাশবোর্ড</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>স্বাগতম, {profile?.full_name ?? user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
            🔥 {profile?.streak_current ?? 0} দিনের ধারা
          </span>
          {isAdmin && (
            <Link href="/admin" style={{ padding: '6px 14px', background: '#2563eb', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>
              ⚙️ Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          [totalMCQ.toLocaleString(), 'মোট MCQ সমাধান'],
          [accuracy + '%', 'সঠিক উত্তর'],
          [String(sessions?.length ?? 0), 'প্র্যাকটিস সেশন'],
          ['#—', 'বর্তমান র‍্যাংক'],
        ].map(([v, l]) => (
          <div key={l} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{l}</p>
            <p style={{ fontSize: '22px', fontWeight: '600' }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '12px' }}>দ্রুত অ্যাক্সেস</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
          {[
            ['📚', 'সাবজেক্ট', '/subjects'],
            ['❓', 'MCQ প্র্যাকটিস', '/mcq/practice'],
            ['🏆', 'পরীক্ষা', '/exam'],
            ['🔖', 'সেভ করা MCQ', '/profile'],
          ].map(([ic, l, href]) => (
            <Link key={l} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px', background: '#f9fafb', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontSize: '12px', fontWeight: '500', textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>{ic}</span>
              {l}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {(sessions ?? []).length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '12px' }}>সাম্প্রতিক প্র্যাকটিস</p>
          {(sessions ?? []).slice(0, 5).map((s: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none', fontSize: '13px' }}>
              <span style={{ color: '#374151' }}>প্র্যাকটিস সেশন #{i + 1}</span>
              <span style={{ color: '#059669', fontWeight: '500' }}>স্কোর: {s.score ?? 0}</span>
            </div>
          ))}
        </div>
      )}

      {(sessions ?? []).length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>📚</p>
          <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>এখনো কোনো প্র্যাকটিস করা হয়নি</p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>একটি সাবজেক্ট বেছে পড়া শুরু করুন</p>
          <Link href="/subjects" style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
            সাবজেক্ট দেখুন →
          </Link>
        </div>
      )}
    </div>
  )
}
