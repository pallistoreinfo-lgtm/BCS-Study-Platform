'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'

export default function LoginPage(){
  const [state, action, pending] = useActionState(signIn, undefined)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-6">লগইন করুন</h1>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input name="email" type="email" required placeholder="email@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input name="password" type="password" required placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>}
          <button type="submit" disabled={pending}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
            {pending?'লগইন হচ্ছে...':'লগইন করুন'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          অ্যাকাউন্ট নেই? <Link href="/register" className="text-blue-600 font-medium">রেজিস্ট্রেশন করুন</Link>
        </p>
      </div>
    </div>
  )
}