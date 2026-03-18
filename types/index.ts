export interface Subject {
  id: string; name: string; slug: string; icon: string | null
  description: string | null; order_index: number
  is_published: boolean; created_at: string
}
export interface Section {
  id: string; subject_id: string; name: string; slug: string
  order_index: number; is_published: boolean
}
export interface Subsection {
  id: string; section_id: string; name: string; slug: string
  order_index: number; is_published: boolean
}
export interface Topic {
  id: string; subsection_id: string; name: string; slug: string
  pdf_url: string | null; pdf_pages: number; order_index: number
  is_published: boolean; meta_title: string | null
  meta_description: string | null; created_at: string
}
export interface MCQ {
  id: string; topic_id: string | null; subject_id: string
  question: string; option_a: string; option_b: string
  option_c: string; option_d: string
  correct_option: 'a'|'b'|'c'|'d'; explanation: string | null
  difficulty: 'easy'|'medium'|'hard'|null; source: string | null
  year: number | null; tags: string[]; status: 'draft'|'published'|'review'
  created_at: string
}
export interface Exam {
  id: string; title: string; description: string | null
  starts_at: string; duration_minutes: number; total_questions: number
  marks_correct: number; marks_wrong: number; subject_ids: string[]
  status: 'scheduled'|'live'|'ended'|'archived'; created_at: string
}
export interface ExamAttempt {
  id: string; exam_id: string; user_id: string
  answers: Record<string,string>; score: number
  correct_count: number; wrong_count: number
  skipped_count: number; time_taken_seconds: number
  tab_violations: number; submitted_at: string
}
export interface Profile {
  id: string; full_name: string | null; avatar_url: string | null
  target_exam: string | null; is_admin: boolean
  streak_current: number; streak_best: number
  last_active_date: string | null; created_at: string
}
export const BN_KEYS = ['ক','খ','গ','ঘ'] as const
export const DIFFICULTY_MAP = { easy:'সহজ', medium:'মধ্যম', hard:'কঠিন' } as const