import Link from 'next/link'
export default function NotFound(){
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">পেজটি পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6">আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে নেওয়া হয়েছে।</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">হোমে ফিরুন</Link>
      </div>
    </div>
  )
}