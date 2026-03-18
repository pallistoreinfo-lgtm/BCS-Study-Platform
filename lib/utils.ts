import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds/3600)
  const m = Math.floor((seconds%3600)/60)
  const s = seconds%60
  if(h>0) return pad(h)+':'+pad(m)+':'+pad(s)
  return pad(m)+':'+pad(s)
}
function pad(n: number){ return String(n).padStart(2,'0') }

export function calcScore(correct:number,wrong:number,marksCorrect=1,marksWrong=0.5){
  return Math.max(0, correct*marksCorrect - wrong*marksWrong)
}
export function calcAccuracy(correct:number,attempted:number){
  if(attempted===0) return 0
  return Math.round((correct/attempted)*100)
}
export function getPdfUrl(path:string|null):string|null{
  if(!path) return null
  if(path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdfs/${path}`
}