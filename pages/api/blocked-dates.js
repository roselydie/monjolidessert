import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('date, reason, slots')
    .order('date', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ dates: data })
}