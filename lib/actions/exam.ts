'use server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calcScore } from '@/lib/utils'

export async function submitExamAttempt(
  examId:string,
  answers:Record<string,string>,
  timeTaken:number,
  tabViolations:number=0
){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if(!user) return { error:'লগইন করুন' }

  const { data:existing } = await supabase.from('exam_attempts')
    .select('id').eq('exam_id',examId).eq('user_id',user.id).single()
  if(existing) return { error:'ইতোমধ্যে এই পরীক্ষা দেওয়া হয়েছে।' }

  const { data:examQs } = await supabase.from('exam_questions')
    .select('mcq_id, mcq(correct_option)').eq('exam_id',examId)

  let correct=0, wrong=0
  ;(examQs??[]).forEach((eq:any)=>{
    const given = answers[eq.mcq_id]
    if(!given) return
    if(given===eq.mcq?.correct_option) correct++; else wrong++
  })

  const { data:exam } = await supabase.from('exams')
    .select('marks_correct,marks_wrong').eq('id',examId).single()
  const score = calcScore(correct, wrong, exam?.marks_correct??1, exam?.marks_wrong??0.5)

  await supabase.from('exam_attempts').insert({
    exam_id:examId, user_id:user.id, answers,
    score, correct_count:correct, wrong_count:wrong,
    skipped_count:(examQs?.length??0)-correct-wrong,
    time_taken_seconds:timeTaken, tab_violations:tabViolations
  })
  revalidatePath(`/exam/${examId}`)
  return { success:true, score, correct, wrong }
}