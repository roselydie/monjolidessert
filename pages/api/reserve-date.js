import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Réserver une date temporairement (10 minutes)
    const { date, sessionId } = req.body
    if (!date || !sessionId) return res.status(400).json({ error: 'Données manquantes' })

    // Nettoyer les réservations expirées
    await supabase.from('temp_reservations').delete().lt('expires_at', new Date().toISOString())

    // Vérifier si la date est bloquée
    const { data: blocked } = await supabase.from('blocked_dates').select('slots').eq('date', date).single()
    if (blocked && blocked.slots === 0) return res.status(400).json({ error: 'Date non disponible' })

    // Compter les réservations actives sur cette date
    const { data: existing } = await supabase.from('temp_reservations').select('id').eq('date', date)
    const activeCount = existing?.length || 0
    if (blocked && blocked.slots > 0 && activeCount >= blocked.slots) {
      return res.status(400).json({ error: 'Plus de disponibilité sur cette date' })
    }

    // Supprimer l'ancienne réservation de cette session si elle existe
    await supabase.from('temp_reservations').delete().eq('session_id', sessionId)

    // Créer la réservation (expire dans 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const { error } = await supabase.from('temp_reservations').insert({ date, session_id: sessionId, expires_at: expiresAt })
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ ok: true, expiresAt })
  }

  if (req.method === 'DELETE') {
    // Libérer la réservation (commande abandonnée)
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ error: 'Session manquante' })
    await supabase.from('temp_reservations').delete().eq('session_id', sessionId)
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
