// Returns YYYY-MM-DD in the user's LOCAL timezone (not UTC). Using
// toISOString() rolled the "day" over at UTC midnight, which is early evening
// in the US — causing the check-in day to flip hours before the user's actual
// midnight. This computes the local calendar date instead.
export function localDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
