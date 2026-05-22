import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { password } = req.headers
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  if (req.method === 'POST') {
    const { date, reason } = req.body
    if (!date) return res.status(400).json({ error: 'Date manquante' })
    const { error } = await supabase
      .from('blocked_dates')
      .upsert({ date, reason: reason || '' }, { onConflict: 'date' })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }
  if (req.method === 'DELETE') {
    const { date } = req.body
    if (!date) return res.status(400).json({ error: 'Date manquante' })
    const { error } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('date', date)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }
  return res.status(405).end()
}