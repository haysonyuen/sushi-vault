import https from 'https';
import fs from 'fs';
import { getAlias, CREDIT_CARD_LAST4, ACCOUNT_ALIASES } from './config.js';

const BASE_URL = 'https://api.teller.io';

// Build the mTLS agent once at startup using cert files from .env
function createAgent() {
  return new https.Agent({
    cert: fs.readFileSync(process.env.TELLER_CERT_PATH),
    key: fs.readFileSync(process.env.TELLER_KEY_PATH),
  });
}

let _agent = null;
function agent() {
  if (!_agent) _agent = createAgent();
  return _agent;
}

// Support multiple enrollment tokens (one per institution).
// Set TELLER_ACCESS_TOKENS=token1,token2 in .env (comma-separated).
// Falls back to TELLER_ACCESS_TOKEN for single-institution setups.
function getTokens() {
  const multi = process.env.TELLER_ACCESS_TOKENS;
  if (multi) return multi.split(',').map(t => t.trim()).filter(Boolean);
  return [process.env.TELLER_ACCESS_TOKEN];
}

// Maps accountId → token so balance/transaction calls use the right token.
const ACCOUNT_TOKEN_MAP = new Map();

// Generic GET request to Teller API using a specific access token
function tellerGetWithToken(path, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = https.get(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: {
          Authorization: 'Basic ' + Buffer.from(token + ':').toString('base64'),
          'Accept': 'application/json',
        },
        agent: agent(),
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Teller API error ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`Invalid JSON from Teller: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy(new Error('Teller API request timed out'));
    });
  });
}

// Kept for backward compatibility with any direct callers
export function tellerGet(path) {
  return tellerGetWithToken(path, getTokens()[0]);
}

// Returns all accounts across all enrolled institutions.
// Never exposes full account numbers.
export async function getAccounts() {
  const tokens = getTokens();
  const perToken = await Promise.all(tokens.map(async (token) => {
    try {
      const accounts = await tellerGetWithToken('/accounts', token);
      const mapped = [];
      for (const acc of accounts) {
        const last4 = acc.last_four ?? acc.number?.slice(-4) ?? '????';
        // Only track accounts explicitly listed in ACCOUNT_ALIASES (allowlist).
        // Prevents unlisted Chase accounts (checking, other cards, etc.) from
        // appearing in the dashboard when the token grants access to multiple accounts.
        if (!ACCOUNT_ALIASES[last4]) continue;
        ACCOUNT_TOKEN_MAP.set(acc.id, token); // remember which token owns this account
        mapped.push({
          id: acc.id,
          alias: getAlias(last4),
          last4,
          type: acc.type,
          subtype: acc.subtype,
          institution: acc.institution?.name ?? 'Unknown',
          isCredit: CREDIT_CARD_LAST4.has(last4),
          currency: acc.currency ?? 'USD',
        });
      }
      return mapped;
    } catch (e) {
      console.error(`[teller] Failed to fetch accounts for a token: ${e.message}`);
      return [];
    }
  }));
  return perToken.flat();
}

// Returns balance for a single account, using the correct token for that account.
export async function getBalance(accountId) {
  const token = ACCOUNT_TOKEN_MAP.get(accountId) ?? getTokens()[0];
  const bal = await tellerGetWithToken(`/accounts/${accountId}/balances`, token);
  return {
    available: parseFloat(bal.available ?? 0),
    ledger: parseFloat(bal.ledger ?? 0),
  };
}

// Returns ALL transactions for a single account using cursor pagination.
// Teller caps each page at 500; we loop via from_id until exhausted or
// the oldest transaction pre-dates earliestDate (YYYY-MM-DD).
export async function getTransactions(accountId, { earliestDate } = {}) {
  const token = ACCOUNT_TOKEN_MAP.get(accountId) ?? getTokens()[0];
  const PAGE  = 500;
  const all   = [];
  let fromId  = null;

  while (true) {
    const qs   = `?count=${PAGE}${fromId ? `&from_id=${fromId}` : ''}`;
    const page = await tellerGetWithToken(`/accounts/${accountId}/transactions${qs}`, token);

    if (!Array.isArray(page) || page.length === 0) break;
    all.push(...page);

    const oldest = page[page.length - 1];
    // Stop if we've gone far enough back
    if (earliestDate && oldest.date <= earliestDate) break;
    // Stop if Teller returned a partial page (no more history)
    if (page.length < PAGE) break;

    fromId = oldest.id; // cursor advances to next older page
  }

  return all.map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    amount: parseFloat(t.amount),
    type: t.type,
    status: t.status,
    category: t.details?.category ?? 'Needs Review',
    counterparty: t.details?.counterparty?.name ?? null,
  }));
}
