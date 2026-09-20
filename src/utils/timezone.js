const MINUTES_PER_DAY = 24 * 60
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY

/**
 * Convert a (day_of_week, hour_of_day) slot stored in UTC into the viewer's
 * local time, correctly handling half-hour / 45-minute offsets (e.g. India is
 * UTC+5:30) and day rollovers in either direction.
 *
 * @param {number} dayOfWeek     0 = Sunday … 6 = Saturday (UTC)
 * @param {number} hourOfDay     0–23 (UTC)
 * @param {number} offsetMinutes local offset from UTC in minutes (IST = 330)
 * @returns {{ day: number, minuteOfDay: number }} local day (0–6) and minute of day (0–1439)
 */
export function toLocalSlot(dayOfWeek, hourOfDay, offsetMinutes) {
  const utcMinutes = Number(dayOfWeek) * MINUTES_PER_DAY + Number(hourOfDay) * 60
  const total =
    (((utcMinutes + offsetMinutes) % MINUTES_PER_WEEK) + MINUTES_PER_WEEK) %
    MINUTES_PER_WEEK
  return {
    day: Math.floor(total / MINUTES_PER_DAY),
    minuteOfDay: total % MINUTES_PER_DAY,
  }
}

/** 0 → "12 AM", 690 → "11:30 AM", 1410 → "11:30 PM" */
export function formatSlotLabel(minuteOfDay) {
  const h24 = Math.floor(minuteOfDay / 60)
  const mm = minuteOfDay % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return mm === 0 ? `${h12} ${suffix}` : `${h12}:${String(mm).padStart(2, '0')} ${suffix}`
}
