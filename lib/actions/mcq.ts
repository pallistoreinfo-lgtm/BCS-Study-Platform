'use server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getMCQs(filter:{subjectId?:string,topicId?:string,difficulty?:string,count?:number}){
  const supabase = await createServerSupabaseClient()
  let q = supabase.from('mcq').select('*').eq('status','published')
  if(filter.subjectId) q = q.eq('subject_id',filter.subjectId)
  if(filter.topicId) q = q.eq('topic_id',filter.topicId)
  if(filter.difficulty) q = q.eq('difficulty',filter.difficulty)
  q = q.limit(filter.count??50)
  const { data } = await q
  return data ?? []
}

export async function savePracticeResult(data:{
  subjectId?:string; topicId?:string; answers:Record<string,string>
  score:number; correctCount:number; wrongCount:number
  skippedCount:number; timeTaken:number
}){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if(!user) return
  await supabase.from('practice_sessions').insert({
    user_id:user.id, subject_id:data.subjectId??null,
    topic_id:data.topicId??null, answers:data.answers,
    score:data.score, correct_count:data.correctCount,
    wrong_count:data.wrongCount, skipped_count:data.skippedCount,
    time_taken_seconds:data.timeTaken
  })
}

export async function toggleSaveMCQ(mcqId:string){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if(!user) return { error:'লগইন করুন' }
  const { data:existing } = await supabase.from('saved_mcq')
    .select('mcq_id').eq('user_id',user.id).eq('mcq_id',mcqId).single()
  if(existing){
    await supabase.from('saved_mcq').delete().eq('user_id',user.id).eq('mcq_id',mcqId)
    return { saved:false }
  }
  await supabase.from('saved_mcq').insert({ user_id:user.id, mcq_id:mcqId })
  return { saved:true }
}