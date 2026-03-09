import { getAccounts, getBalance } from '../teller.js';

// Returns combined liquidity snapshot across all tracked accounts.
// Credit card balances are shown as amount owed (liability), not as cash.
export async function getLiquiditySummary() {
  const accounts = await getAccounts();

  const results = await Promise.all(
    accounts.map(async (acc) => {
      const bal = await getBalance(acc.id);
      return { ...acc, balance: bal };
    })
  );

  const cashAccounts = results.filter((a) => !a.isCredit);
  const creditAccounts = results.filter((a) => a.isCredit);

  const totalCash = cashAccounts.reduce(
    (sum, a) => sum + a.balance.available,
    0
  );
  const totalOwed = creditAccounts.reduce(
    (sum, a) => sum + Math.abs(a.balance.ledger),
    0
  );
  const netLiquidity = totalCash - totalOwed;

  const lines = [];

  if (cashAccounts.length > 0) {
    lines.push('--- Cash & Savings ---');
    for (const a of cashAccounts) {
      lines.push(
        `  ${a.alias}: $${a.balance.available.toFixed(2)} available` +
          (a.balance.ledger !== a.balance.available
            ? ` ($${a.balance.ledger.toFixed(2)} ledger)`
            : '')
      );
    }
    lines.push(`  Subtotal: $${totalCash.toFixed(2)}`);
  }

  if (creditAccounts.length > 0) {
    lines.push('--- Credit Cards (balance owed) ---');
    for (const a of creditAccounts) {
      lines.push(`  ${a.alias}: $${Math.abs(a.balance.ledger).toFixed(2)} owed`);
    }
    lines.push(`  Subtotal: $${totalOwed.toFixed(2)}`);
  }

  lines.push('');
  lines.push(`Net Liquidity (cash minus credit owed): $${netLiquidity.toFixed(2)}`);

  return lines.join('\n');
}
