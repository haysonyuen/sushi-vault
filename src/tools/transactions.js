import { getAccounts, getTransactions } from '../teller.js';

// Fetch transactions across all accounts for a given date range.
// Detects same-day, same-amount cross-account moves and tags them as
// internal transfers so they are not double-counted as expenses.
export async function getTaggedTransactions({ startDate, endDate } = {}) {
  const accounts = await getAccounts();

  // Fetch transactions for all accounts in parallel.
  // Pass earliestDate so the paginator stops once it reaches far-enough history.
  const perAccount = await Promise.all(
    accounts.map(async (acc) => {
      const txns = await getTransactions(acc.id, { earliestDate: startDate });
      return txns.map((t) => ({
        ...t,
        accountAlias: acc.alias,
        accountLast4: acc.last4,
        accountId: acc.id,
        isCredit: acc.isCredit,
      }));
    })
  );

  let all = perAccount.flat();

  // Apply date filter if provided
  if (startDate) all = all.filter((t) => t.date >= startDate);
  if (endDate) all = all.filter((t) => t.date <= endDate);

  // Sort by date descending
  all.sort((a, b) => b.date.localeCompare(a.date));

  // Tag internal transfers:
  // A transfer pair = two transactions on the same date where one is a debit
  // on one account and the other is a credit on another account for the same
  // absolute amount. We mark both sides so callers can exclude them.
  const tagged = markInternalTransfers(all);

  return tagged;
}

function markInternalTransfers(txns) {
  // Group by date + absolute amount
  const buckets = new Map();
  for (const t of txns) {
    const key = `${t.date}|${Math.abs(t.amount).toFixed(2)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(t);
  }

  const transferIds = new Set();
  for (const [, group] of buckets) {
    if (group.length < 2) continue;
    // Look for a debit/credit pair across different accounts
    const debits = group.filter((t) => t.amount < 0);
    const credits = group.filter((t) => t.amount > 0);
    for (const d of debits) {
      for (const c of credits) {
        if (d.accountId !== c.accountId) {
          transferIds.add(d.id);
          transferIds.add(c.id);
        }
      }
    }
  }

  return txns.map((t) => ({
    ...t,
    isInternalTransfer: transferIds.has(t.id),
  }));
}

// Formats tagged transactions as a readable text table
export function formatTransactions(txns, { includeTransfers = false } = {}) {
  const visible = includeTransfers
    ? txns
    : txns.filter((t) => !t.isInternalTransfer);

  if (visible.length === 0) return 'No transactions found for this period.';

  const lines = visible.map((t) => {
    const sign = t.amount < 0 ? '-' : '+';
    const abs = Math.abs(t.amount).toFixed(2);
    const transfer = t.isInternalTransfer ? ' [internal transfer]' : '';
    const merchant = t.counterparty ?? t.description;
    return `${t.date}  ${t.accountAlias.padEnd(14)}  ${sign}$${abs.padStart(9)}  ${merchant}${transfer}`;
  });

  return lines.join('\n');
}
