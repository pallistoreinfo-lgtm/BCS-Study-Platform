'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message === 'User already registered'
        ? 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে।'
        : 'রেজিস্ট্রেশন হয়নি। আবার চেষ্টা করুন।')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H9zM9 9h4v4H9z" fill="white"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>নতুন অ্যাকাউন্ট</h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>বিনামূল্যে শুরু করুন</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>পূর্ণ নাম</label>
            <input
              type="text"
              placeholder="আপনার নাম লিখুন"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>ইমেইল</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>পাসওয়ার্ড</label>
            <input
              type="password"
              placeholder="কমপক্ষে ৬ অক্ষর"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && (
            <p style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px' }}>
              ⚠️ {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
          ইতোমধ্যে আছেন?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: '500' }}>
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  )
}
