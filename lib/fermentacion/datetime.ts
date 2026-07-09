// Local device date/time helpers for auto-filling reading rows. Browser-only —
// call from client effects (never during SSR) to avoid hydration mismatches.

/** Today's local date as "YYYY-MM-DD" (matches <input type="date">). */
export function todayISO(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

/** Current local time as "HH:MM" (matches <input type="time">). */
export function nowHM(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(11, 16);
}
