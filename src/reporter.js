/**
 * reporter.js — Weekly/biweekly spending report generator & emailer
 *
 * Schedule:
 *   Chase  → every 1 week  (Mondays 8am)
 *   WF     → every 2 weeks (Mondays 8am, even weeks)
 */
import { Resend } from 'resend';

// ── Helpers ────────────────────────────────────────────────────────────────
const dollars = n => '$' + Math.abs(n).toFixed(2);
const isSpend = t => !t.isInternalTransfer && (t.isCredit ? t.amount > 0 : t.amount < 0);
const isInc   = t => !t.isInternalTransfer && !t.isCredit && t.amount > 0;

// Reuse the same CHAT_CATEGORIES logic — imported lazily to avoid circular dep
let _chatCategory = null;
export function setChatCategory(fn) { _chatCategory = fn; }
function cat(t) { return _chatCategory ? _chatCategory(t) : 'Other'; }

// ── Report builder ─────────────────────────────────────────────────────────
/**
 * Build a spending report for a specific account over a date range.
 * @param {object[]} allTxns   - full transaction history from cache
 * @param {string}   account   - account alias to filter by, or 'all'
 * @param {string}   startDate - YYYY-MM-DD
 * @param {string}   endDate   - YYYY-MM-DD
 * @param {string}   label     - report title (e.g. "Chase — Weekly Report")
 */
export function buildReport(allTxns, aliases, startDate, endDate, label) {
  const aliasSet = new Set((aliases || []).map(a => a.toLowerCase()));
  const txns = allTxns.filter(t => {
    const inRange = t.date >= startDate && t.date <= endDate;
    const inAccount = aliasSet.size === 0 || aliasSet.has(t.accountAlias?.toLowerCase());
    return inRange && inAccount;
  });

  const spending = txns.filter(isSpend);
  const income   = txns.filter(isInc);

  const totalSpend  = spending.reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((s, t)   => s + t.amount, 0);

  // Category breakdown
  const cats = new Map();
  for (const t of spending) {
    const c = cat(t);
    cats.set(c, (cats.get(c) || 0) + Math.abs(t.amount));
  }
  const catSorted = [...cats.entries()].sort((a, b) => b[1] - a[1]);

  // Top 10 transactions
  const top10 = [...spending]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 10);

  return { label, startDate, endDate, account, totalSpend, totalIncome, catSorted, top10, txnCount: spending.length };
}

// ── HTML email template ────────────────────────────────────────────────────
export function renderHtml(report) {
  const { label, startDate, endDate, totalSpend, totalIncome, catSorted, top10, txnCount } = report;

  const catRows = catSorted.map(([name, amount]) => {
    const barWidth = Math.round((amount / totalSpend) * 180);
    return `
      <tr>
        <td style="padding:6px 12px 6px 0; color:#94a3b8; font-size:13px; white-space:nowrap">${name}</td>
        <td style="padding:6px 8px">
          <div style="background:#1e3a5f;height:10px;border-radius:5px;width:${barWidth}px;max-width:180px"></div>
        </td>
        <td style="padding:6px 0 6px 8px; color:#e2e8f0; font-size:13px; text-align:right; white-space:nowrap">${dollars(amount)}</td>
      </tr>`;
  }).join('');

  const txnRows = top10.map(t => `
      <tr>
        <td style="padding:5px 12px 5px 0; color:#64748b; font-size:12px">${t.date}</td>
        <td style="padding:5px 12px 5px 0; color:#cbd5e1; font-size:13px">${(t.counterparty || t.description || '').slice(0, 38)}</td>
        <td style="padding:5px 8px 5px 0; color:#94a3b8; font-size:12px">${cat(t)}</td>
        <td style="padding:5px 0; color:#f87171; font-size:13px; text-align:right; white-space:nowrap">−${dollars(t.amount)}</td>
      </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1120;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1120;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#111827;border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid #1f2d42">
            <p style="margin:0 0 4px;color:#64748b;font-size:12px;letter-spacing:1px;text-transform:uppercase">Sushi-Vault · Private Report</p>
            <h1 style="margin:0;color:#e2e8f0;font-size:22px;font-weight:600">${label}</h1>
            <p style="margin:8px 0 0;color:#64748b;font-size:13px">${startDate} → ${endDate}</p>
          </td>
        </tr>

        <!-- Summary cards -->
        <tr>
          <td style="background:#111827;padding:24px 32px;border-bottom:1px solid #1f2d42">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="background:#1a2438;border-radius:12px;padding:16px 20px;text-align:center">
                  <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px">Total Spent</p>
                  <p style="margin:0;color:#f87171;font-size:28px;font-weight:700">${dollars(totalSpend)}</p>
                  <p style="margin:4px 0 0;color:#64748b;font-size:12px">${txnCount} transactions</p>
                </td>
                <td width="4%"></td>
                <td width="48%" style="background:#1a2438;border-radius:12px;padding:16px 20px;text-align:center">
                  <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px">Income In</p>
                  <p style="margin:0;color:#4ade80;font-size:28px;font-weight:700">${dollars(totalIncome)}</p>
                  <p style="margin:4px 0 0;color:#64748b;font-size:12px">&nbsp;</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Category breakdown -->
        <tr>
          <td style="background:#111827;padding:24px 32px;border-bottom:1px solid #1f2d42">
            <p style="margin:0 0 16px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Spending by Category</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${catRows}
            </table>
          </td>
        </tr>

        <!-- Top transactions -->
        <tr>
          <td style="background:#111827;padding:24px 32px;border-radius:0 0 16px 16px">
            <p style="margin:0 0 16px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Top Transactions</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${txnRows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 0;text-align:center">
            <p style="margin:0;color:#334155;font-size:11px">Sushi-Vault · Private & Read-Only · Data from Teller.io</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email sender ───────────────────────────────────────────────────────────
export async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY must be set in .env');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Sushi-Vault <reports@sushivault.app>',
    to,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
  console.log(`[email] Sent to ${to}`);
}
