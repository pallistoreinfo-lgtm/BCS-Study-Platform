'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData){
  const supabase = await createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const { error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name } } })
  if(error) return { error: error.message }
  revalidatePath('/','layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData){
  const supabase = await createServerSupabaseClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if(error) return { error: error.message }
  revalidatePath('/','layout')
  redirect('/dashboard')
}

export async function signOut(){
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/','layout')
  redirect('/')
}

export async function getSession(){
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  return user
}