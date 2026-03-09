import { getTaggedTransactions } from './transactions.js';

// Returns spend for a given date range (excludes internal transfers and credits/payments).
// For credit cards: charges (positive amounts in Teller) are spend.
// For depository: debits (negative amounts) are spend.
function sumSpend(txns) {
  return txns
    .filter((t) => !t.isInternalTransfer)
    .reduce((sum, t) => {
      if (t.isCredit) {
        // Credit card: positive amount = charge = spend
        return t.amount > 0 ? sum + t.amount : sum;
      } else {
        // Depository: negative amount = debit = spend
        return t.amount < 0 ? sum + Math.abs(t.amount) : sum;
      }
    }, 0);
}

function toISODate(d) {
  return d.toISOString().split('T')[0];
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Returns the Monday of the week containing the given date
function startOfWeek(d) {
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

export async function getBurnRate() {
  const today = new Date();
  const thisWeekStart = startOfWeek(today);
  const thisWeekEnd = today;

  // Prior 4 weeks: 4 complete Mon–Sun weeks before this week
  const priorEnd = addDays(thisWeekStart, -1);   // last Sunday
  const priorStart = addDays(priorEnd, -27);      // 4 weeks back

  // Fetch enough history to cover this week + 4 prior weeks
  const allTxns = await getTaggedTransactions({
    startDate: toISODate(priorStart),
    endDate: toISODate(thisWeekEnd),
  });

  // This week's spend
  const thisWeekTxns = allTxns.filter(
    (t) => t.date >= toISODate(thisWeekStart) && t.date <= toISODate(thisWeekEnd)
  );
  const thisWeekSpend = sumSpend(thisWeekTxns);

  // Days elapsed in this week (at least 1 to avoid divide-by-zero)
  const daysElapsed = Math.max(
    1,
    Math.floor((today - thisWeekStart) / 86400000) + 1
  );
  const dailyRateThisWeek = thisWeekSpend / daysElapsed;
  const projectedWeekTotal = dailyRateThisWeek * 7;

  // Prior 4 weeks spend, split into individual weekly buckets
  const weeklySpends = [];
  for (let i = 0; i < 4; i++) {
    const wStart = addDays(priorEnd, -(6 + i * 7));
    const wEnd = addDays(priorEnd, -(i * 7));
    const wTxns = allTxns.filter(
      (t) => t.date >= toISODate(wStart) && t.date <= toISODate(wEnd)
    );
    weeklySpends.push(sumSpend(wTxns));
  }

  const priorAvg =
    weeklySpends.reduce((s, v) => s + v, 0) / weeklySpends.length;

  const delta = projectedWeekTotal - priorAvg;
  const pct = priorAvg > 0 ? (delta / priorAvg) * 100 : 0;
  const direction = delta > 0 ? 'above' : delta < 0 ? 'below' : 'equal to';

  const lines = [
    `Burn Rate Report  (as of ${toISODate(today)})`,
    '',
    `This week (${toISODate(thisWeekStart)} – ${toISODate(thisWeekEnd)}):`,
    `  Spend so far:        $${thisWeekSpend.toFixed(2)}  (${daysElapsed} day${daysElapsed !== 1 ? 's' : ''})`,
    `  Daily rate:          $${dailyRateThisWeek.toFixed(2)}/day`,
    `  Projected full week: $${projectedWeekTotal.toFixed(2)}`,
    '',
    'Prior 4-week breakdown:',
    ...weeklySpends.map((s, i) => {
      const wEnd = addDays(priorEnd, -(i * 7));
      const wStart = addDays(priorEnd, -(6 + i * 7));
      return `  Week -${i + 1} (${toISODate(wStart)}): $${s.toFixed(2)}`;
    }),
    `  4-week average:      $${priorAvg.toFixed(2)}`,
    '',
    `Deviation: projected $${Math.abs(delta).toFixed(2)} (${Math.abs(pct).toFixed(1)}%) ${direction} 4-week avg`,
  ];

  return lines.join('\n');
}
