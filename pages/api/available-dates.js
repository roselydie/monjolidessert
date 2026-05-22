import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Nettoyer les réservations expirées
  await supabase.from('temp_reservations').delete().lt('expires_at', new Date().toISOString())

  // Récupérer les dates bloquées
  const { data: blocked } = await supabase.from('blocked_dates').select('date, slots')
  
  // Récupérer les réservations actives
  const { data: reservations } = await supabase.from('temp_reservations').select('date')

  // Compter les réservations par date
  const reservationCount = {}
  ;(reservations || []).forEach(r => {
    reservationCount[r.date] = (reservationCount[r.date] || 0) + 1
  })

  // Construire le statut de chaque date
  const dateStatus = {}
  ;(blocked || []).forEach(b => {
    if (b.slots === 0) {
      dateStatus[b.date] = { available: false, slots: 0, remaining: 0 }
    } else {
      const used = reservationCount[b.date] || 0
      const remaining = b.slots - used
      dateStatus[b.date] = { available: remaining > 0, slots: b.slots, remaining }
    }
  })

  return res.status(200).json({ dateStatus })
}
