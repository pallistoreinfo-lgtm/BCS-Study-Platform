'use server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markTopicComplete(topicId:string,completed:boolean){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if(!user) return { error:'লগইন করুন' }
  await supabase.from('topic_progress').upsert({
    user_id:user.id, topic_id:topicId,
    is_completed:completed, last_read_at:new Date().toISOString()
  })
  revalidatePath('/subjects','layout')
}

export async function saveNote(topicId:string,content:string){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if(!user) return { error:'লগইন করুন' }
  await supabase.from('user_notes').upsert({
    user_id:user.id, topic_id:topicId,
    content, updated_at:new Date().toISOString()
  })
  return { success:true }
}