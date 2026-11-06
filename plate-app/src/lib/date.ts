/** Date helpers. Everything works in the device's local time zone. */

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-11-06" for the local calendar day of `d`. */
export function dayKey(d: Date | string = new Date()): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight at the start of the day named by `key`. */
export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d: Date = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000);
}

export function isToday(key: string): boolean {
  return key === dayKey();
}

/** Puts the clock time of `time` on the calendar day of `day`. */
export function withTimeOnDay(day: Date, time: Date): Date {
  const out = new Date(day);
  out.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return out;
}

/** "8:05 AM" */
export function formatTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  let h = date.getHours();
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad(date.getMinutes())} ${suffix}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "M", "T", "W"… */
export function weekdayLetter(d: Date): string {
  return WEEKDAYS[d.getDay()][0];
}

/** "Thu 6 Nov" */
export function formatDay(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** "6 Nov" */
export function formatShortDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** "Today", "Yesterday" or "Thu 6 Nov". */
export function relativeDay(key: string): string {
  if (key === dayKey()) return 'Today';
  if (key === dayKey(addDays(new Date(), -1))) return 'Yesterday';
  return formatDay(fromDayKey(key));
}

/** "just now", "4 min ago", "2 h ago". */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return formatShortDate(iso);
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Up late,';
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}
