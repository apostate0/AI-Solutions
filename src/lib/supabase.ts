import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aupetinineylniegfrsm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cGV0aW5pbmV5bG5pZWdmcnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzIzODksImV4cCI6MjA3NDY0ODM4OX0.00oX8iJ6O9tutior55TEqhdHpZkUiuiD_cstfue3bY4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface ContactSubmission {
  id?: number
  name: string
  email: string
  company?: string
  message: string
  created_at?: string
}

export interface FeedbackSubmission {
  id?: number
  name: string
  email: string
  rating: number
  feedback: string
  created_at?: string
}

export interface BlogPost {
  id?: number
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  read_time: string
  image: string
  published: boolean
  created_at?: string
  updated_at?: string
}

export interface CaseStudy {
  id?: number
  title: string
  client: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  image: string
  published: boolean
  created_at?: string
  updated_at?: string
}

export interface Event {
  id?: number
  title: string
  date: string
  location: string
  description: string
  category: string
  image: string
  attendees: number
  published: boolean
  created_at?: string
  updated_at?: string
}

export interface Testimonial {
  id?: number
  name: string
  position: string
  company: string
  content: string
  rating: number
  avatar: string
  published: boolean
  created_at?: string
  updated_at?: string
}

