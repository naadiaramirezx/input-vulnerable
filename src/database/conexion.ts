import { createClient } from '@supabase/supabase-js'

// Reemplaza con tus credenciales de Supabase (Settings > API)
const supabaseUrl = 'https://lkhtvrbditmkpkplxaee.supabase.co'
const supabaseAnonKey = 'sb_publishable_XrwLygTIkcRwWasJwcOQig_nSEmEhPT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


