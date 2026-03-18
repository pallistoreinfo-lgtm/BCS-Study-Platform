import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
const BASE = process.env.NEXT_PUBLIC_APP_URL!
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()
  const { data:subjects } = await supabase.from('subjects').select('slug').eq('is_published',true)
  return [
    { url:BASE, changeFrequency:'daily', priority:1 },
    { url:`${BASE}/subjects`, changeFrequency:'weekly', priority:0.9 },
    { url:`${BASE}/mcq`, changeFrequency:'weekly', priority:0.9 },
    { url:`${BASE}/exam`, changeFrequency:'daily', priority:0.8 },
    ...(subjects??[]).map(s=>({ url:`${BASE}/subjects/${s.slug}`, changeFrequency:'weekly' as const, priority:0.8 }))
  ]
}