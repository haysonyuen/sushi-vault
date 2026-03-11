import 'dotenv/config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import cron from 'node-cron';
import { getAccounts, getBalance } from './teller.js';
import { isDemoUser, getMockLiquidity, getMockTransactions } from './mock-data.js';
import { getTaggedTransactions } from './tools/transactions.js';
import { setChatCategory, buildReport, renderHtml, sendEmail, SCHEDULES, isBiweeklyWeek } from './reporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PORT = process.env.UI_PORT ?? 3000;

// ── Google OAuth + session auth ────────────────────────────────────────────
const SESSION_FILE = path.join(__dirname, '..', '.sessions.json');
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Load sessions from disk so restarts don't log users out
const SESSIONS = (() => {
  try {
    const raw = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    const now = Date.now();
    // Drop already-expired entries on load
    return new Map(Object.entries(raw).filter(([, s]) => s.expires > now));
  } catch { return new Map(); }
})();

function persistSessions() {
  try { fs.writeFileSync(SESSION_FILE, JSON.stringify(Object.fromEntries(SESSIONS))); } catch {}
}
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

// Admins see all accounts. Add your own email here via ADMIN_EMAILS in .env.
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
);

// Per-user account restrictions: email → array of allowed account aliases (with last4).
// Admins are unrestricted. Users not listed here see no accounts by default.
const USER_ACCOUNT_LIMITS = {
  'favouritemie@gmail.com': ['Chase Freedom (4844)'],
};

// Returns null (unrestricted/admin), an alias array (restricted), or [] (sees nothing).
function allowedAliases(req) {
  const sess = getSession(req);
  if (!sess) return [];
  if (ADMIN_EMAILS.has(sess.email)) return null;
  return USER_ACCOUNT_LIMITS[sess.email] ?? [];
}

function parseCookies(req) {
  const cookies = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
  }
  return cookies;
}

function getSession(req) {
  const token = parseCookies(req).sushi_session;
  if (!token) return null;
  const sess = SESSIONS.get(token);
  if (!sess || sess.expires < Date.now()) { SESSIONS.delete(token); persistSessions(); return null; }
  return sess;
}

function requireAuth(req, res) {
  // Public paths that never need auth
  const pub = ['/auth/google', '/auth/callback', '/auth/logout', '/login'];
  if (pub.some(p => req.url.startsWith(p))) return true;
  if (getSession(req)) return true;
  // Redirect browser requests; return 401 for API calls
  if (req.url.startsWith('/api/')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
  } else {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
  return false;
}

async function handleOAuth(req, res, url) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } = process.env;
  const redirectUri = `${APP_URL}/auth/callback`;

  if (url.pathname === '/auth/google') {
    const params = new URLSearchParams({
      client_id:     GOOGLE_CLIENT_ID,
      redirect_uri:  redirectUri,
      response_type: 'code',
      scope:         'openid email',
      access_type:   'online',
      prompt:        'select_account',
    });
    res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
    res.end();
    return true;
  }

  if (url.pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    if (!code) { res.writeHead(400); res.end('Missing code'); return true; }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) { res.writeHead(401); res.end('OAuth failed'); return true; }

    // Get user email
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();
    const email = (user.email || '').toLowerCase();

    if (!ALLOWED_EMAILS.includes(email) && !isDemoUser(email)) {
      res.writeHead(403);
      res.end(`Access denied for ${email}. Contact Hayson to be added.`);
      return true;
    }

    // Create session
    const token = crypto.randomUUID();
    SESSIONS.set(token, { email, expires: Date.now() + SESSION_TTL_MS });
    persistSessions();
    console.log(`[auth] Login: ${email}`);
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `sushi_session=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}; Path=/`,
    });
    res.end();
    return true;
  }

  if (url.pathname === '/auth/logout') {
    const token = parseCookies(req).sushi_session;
    if (token) { SESSIONS.delete(token); persistSessions(); }
    res.writeHead(302, {
      Location: '/login',
      'Set-Cookie': 'sushi_session=; HttpOnly; Max-Age=0; Path=/',
    });
    res.end();
    return true;
  }

  return false;
}

// ── In-memory cache (liquidity, chat, etc.) ────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE = new Map();

function getCached(key) {
  const entry = CACHE.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  CACHE.delete(key);
  return null;
}

async function withCache(key, fn) {
  const hit = getCached(key);
  if (hit) { console.log(`[cache hit] ${key}`); return hit; }
  const data = await fn();
  CACHE.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  console.log(`[cache set] ${key}`);
  return data;
}

// ── Disk-backed transaction history (single blob, 13 months) ──────────────
// One paginated Teller fetch covers the entire year. Stored as a single JSON
// file so history survives restarts. TTL = 1 hour; rebuilds in background
// (stale-while-revalidate) so the UI never blocks waiting for Teller.
const TX_HISTORY_FILE = path.join(__dirname, '..', '.tx-history.json');
const HISTORY_TTL_MS  = 60 * 60 * 1000; // 1 hour

let historyCache  = null;   // { txns: [], cachedAt: number } | null
let historyBuilding = false; // guard against concurrent rebuilds

// Load from disk on startup — instant if cache file exists
try {
  const raw = JSON.parse(fs.readFileSync(TX_HISTORY_FILE, 'utf8'));
  if (raw?.txns?.length > 0) {
    historyCache = raw;
    console.log(`[tx-history] Loaded ${raw.txns.length} txns from disk (cached ${new Date(raw.cachedAt).toLocaleString()})`);
  }
} catch { /* no cache yet — first run */ }

function isHistoryFresh() {
  return !!historyCache?.txns?.length && (Date.now() - historyCache.cachedAt) < HISTORY_TTL_MS;
}

// Fetch all 13 months of transactions from Teller (paginated) and persist.
async function rebuildHistory() {
  if (historyBuilding) return;
  historyBuilding = true;
  try {
    const now   = new Date();
    const end   = now.toISOString().slice(0, 10);
    const start = (() => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 13);
      d.setDate(1);
      return d.toISOString().slice(0, 10);
    })();

    console.log(`[tx-history] Rebuilding ${start} → ${end} …`);
    const txns = await enrichWithAI(await getTaggedTransactions({ startDate: start, endDate: end }));

    if (txns.length > 0) {
      historyCache = { txns, cachedAt: Date.now() };
      try { fs.writeFileSync(TX_HISTORY_FILE, JSON.stringify(historyCache)); }
      catch (e) { console.error('[tx-history] Failed to write disk cache:', e.message); }
      console.log(`[tx-history] Rebuilt: ${txns.length} txns (${start} → ${end})`);
    } else {
      console.warn('[tx-history] Teller returned 0 transactions — history NOT updated');
    }
  } catch (e) {
    console.error('[tx-history] Rebuild failed:', e.message);
  } finally {
    historyBuilding = false;
  }
}

// Return transactions for a date range, serving from the in-memory blob.
// If data is stale, kicks off a background rebuild (stale-while-revalidate).
// If there is NO data at all, fetches synchronously so the first request works.
async function getTxnsForRange(start, end) {
  if (!isHistoryFresh()) {
    if (historyCache?.txns?.length && !historyBuilding) {
      // Have stale data → serve it now, rebuild in background
      rebuildHistory();
    } else if (!historyCache?.txns?.length) {
      // No data at all → must block and fetch
      await rebuildHistory();
    }
  }
  const txns = historyCache?.txns || [];
  return txns.filter(t => (!start || t.date >= start) && (!end || t.date <= end));
}

// Triggered on server startup — rebuilds if cache is stale or missing
async function prewarmHistory() {
  if (!isHistoryFresh()) {
    await rebuildHistory();
  } else {
    console.log(`[prewarm] History fresh (${historyCache.txns.length} txns), skipping rebuild`);
  }
}

// --- Chat context builder ---
// Categories are checked in order — put more specific merchants before broader ones.
const CHAT_CATEGORIES = [
  // Bills & transfers
  { name: 'Housing',          match: /MORTGAGE|RENT|HOA|PNC LENDING/i },
  { name: 'Credit Payment',   match: /DISCOVER|AMEX|CAPITAL ONE|CITI|SYNCHRONY|BARCLAYS|AUTOPAY/i },
  { name: 'Utilities',        match: /PG&E|UTILITY|ELECTRIC|WATER|AT&T|VERIZON|COMCAST|XFINITY|T-MOBILE|TMOBILE/i },
  { name: 'Insurance',        match: /INSURANCE|STATE FARM|GEICO|ALLSTATE|PROGRESSIVE/i },
  { name: 'Peer Transfer',    match: /VENMO|CASHAPP|CASH APP|ZELLE|PAYPAL/i },
  { name: 'Wise Transfer',    match: /WISE/i },
  { name: 'International',    match: /WESTERN UNION|REMIT|WEIXIN|WECHAT|ALIPAY/i },
  { name: 'Cash \/ ATM',      match: /ATM|CASH ADVANCE|WITHDRAWAL/i },

  // Food — most specific first
  { name: 'Food Delivery',    match: /DOORDASH|UBER EATS|UBEREATS|GRUBHUB|POSTMATES|INSTACART/i },
  { name: 'Coffee',           match: /STARBUCKS|DUTCH BROS|PEET|COFFEE|BOBA|BUBBLE TEA|MILK TEA|TEA BAR|MOLLY TEA|GONG CHA|TIGER SUGAR|HAPPY LEMON|T4|TIGER|KTREND/i },
  { name: 'Fast Food',        match: /MCDONALD|CHIPOTLE|PANDA|CHICK-FIL|TACO BELL|BURGER KING|WENDY|SUBWAY|JACK IN THE BOX|IN-N-OUT|IN N OUT|FIVE GUYS|RAISING CANE/i },
  { name: 'Dining Out',       match: /RESTAURANT|PIZZA|SUSHI|GRILL|BISTRO|KITCHEN|EATERY|DINER|BAR & GRILL|CAFE|IZAKAYA|RAMEN|NOODLE|BBQ|HOTPOT|DIM SUM|BUFFET|STEAKHOUSE|SEAFOOD|DUMPLING|THAI|VIETNAMESE|POKE|TAQUERIA|TERIYAKI|BENTO|CURRY|CHOPSTICKS|CHANG FEN|PHO|SAKE|PUERTA DEL SOL|JANG SU JANG|CHICKEN MEETS RICE|UME|CLASSIC|YIN JI|TOFU HOUSE|TOFU SOUP|SKEWER|GOLDEN GARLIC|APNI MANDI|YESMEAL|SHABU|YAKITORI|UDON|GYOZA|BANH MI|WONTON|WON TON|BANCHAN|SGD TOFU|MILPITAS SGD|DANAWA|TAI KEE/i },

  // Groceries — Asian specialty stores, warehouse clubs & supermarkets
  { name: 'Asian Market',     match: /H MART|99 RANCH|MITSUWA|MARUKAI|HANKOOK|KOREAN MARKET|ASIAN MARKET|PACIFIC EAST|SEAFOOD CITY|HAWAII SUPER|LION MARKET|HONG KONG MARKET|NIJIYA|AIHUA|SHUN FAT|RANCH 99|RANCH|WEE|OSAKA/i },
  { name: 'Costco',           match: /COSTCO/i },
  { name: 'Groceries',        match: /SAFEWAY|KROGER|WHOLE FOODS|TRADER JOE|SPROUTS|VONS|RALPHS|HEB|PUBLIX|ALDI|RALEY|GROCERY|SUPERMARKET|FOOD MART|FOOD 4 LESS|SMART &/i },

  // Retail
  { name: 'Target',           match: /TARGET/i },
  { name: 'Walmart',          match: /WALMART|WAL-MART/i },
  { name: 'Amazon',           match: /AMAZON(?!.*PRIME)/i },
  { name: 'Shopping',         match: /EBAY|BEST BUY|BESTBUY|HOME DEPOT|LOWES|IKEA|MACY|NORDSTROM|ROSS|TJ MAXX|MARSHALLS/i },

  // Health & personal
  { name: 'Health',           match: /CVS|WALGREENS|RITE AID|PHARMACY|DOCTOR|MEDICAL|DENTAL|VISION|OPTOMETRY|KAISER|URGENT CARE|CLINIC/i },
  { name: 'Gas',              match: /CHEVRON|SHELL|ARCO|VALERO|BP|EXXON|MOBIL|GAS STATION/i },
  { name: 'Transportation',   match: /\bUBER\b(?! EATS)|LYFT|METRO|TRANSIT|PARKING|TOLL|DMV/i },
  { name: 'Ski Trip',         match: /\bSKI\b|SNOWBOARD|SNOW\.COM|VAIL RESORTS|VILLAGE SKI|DONNER SKI|DONNERSKIRANCH|LIFT TICKET|EPIC PASS|IKON PASS|MAMMOTH|NORTHSTAR|HEAVENLY|KIRKWOOD|PALISADES/i },
  { name: 'Travel',           match: /AIRLINE|HOTEL|MARRIOTT|HILTON|HYATT|AIRBNB|EXPEDIA|BOOKING|UNITED|DELTA|SOUTHWEST|ALASKA AIR|VACASA/i },

  // Entertainment & subscriptions
  { name: 'Subscriptions',    match: /NETFLIX|SPOTIFY|HULU|DISNEY|APPLE.*SUB|YOUTUBE.*PREMIUM|AMAZON.*PRIME/i },
  { name: 'Gaming',           match: /STEAM|PLAYSTATION|XBOX|NINTENDO|GOOGLE PLAY/i },
  { name: 'Education',        match: /TUITION|SCHOOL|UNIVERSITY|UDEMY|COURSERA/i },
];
const TELLER_CATEGORY_MAP = {
  'dining':    'Dining Out',
  'fuel':      'Gas',
  'groceries': 'Groceries',
  'home':      'Housing',
  'insurance': 'Insurance',
  'loan':      'Credit Payment',
  'phone':     'Utilities',
  'shopping':  'Shopping',
  'software':  'Subscriptions',
  'office':    'Shopping',
};

function chatCategory(txn) {
  const text = `${txn.counterparty || ''} ${txn.description || ''}`.toUpperCase();
  // Layer 1: regex (specific merchants take priority)
  for (const c of CHAT_CATEGORIES) if (c.match.test(text)) return c.name;
  // Layer 2: Teller's category as fallback
  const tellerCat = TELLER_CATEGORY_MAP[txn.category];
  if (tellerCat) return tellerCat;
  // Layer 3: Claude AI classification (attached at cache time)
  if (txn.aiCategory) return txn.aiCategory;
  return 'Other';
}

// --- AI categorization (Layer 3) ---
// Called once per cache population. Sends only uncategorized transactions to
// Claude Haiku for classification — zero cost for items regex/Teller already handle.
const VALID_CATEGORIES = [
  'Housing', 'Credit Payment', 'Utilities', 'Insurance', 'Peer Transfer',
  'Wise Transfer', 'International', 'Cash / ATM', 'Food Delivery', 'Coffee', 'Fast Food',
  'Dining Out', 'Asian Market', 'Costco', 'Groceries', 'Target', 'Walmart',
  'Amazon', 'Shopping', 'Health', 'Gas', 'Transportation', 'Ski Trip',
  'Travel', 'Subscriptions', 'Gaming', 'Education', 'Other',
];

async function enrichWithAI(txns) {
  if (!process.env.ANTHROPIC_API_KEY) return txns;

  // Send to AI any transaction that both regex (Layer 1) and Teller map (Layer 2) fail to classify.
  // This is broader than checking t.category alone — it catches anything that would otherwise
  // fall through to "Other" in the UI regardless of what Teller's category field says.
  const needsAI = txns.filter(t => {
    const text = `${t.counterparty || ''} ${t.description || ''}`.toUpperCase();
    for (const c of CHAT_CATEGORIES) if (c.match.test(text)) return false; // Layer 1 handles it
    if (TELLER_CATEGORY_MAP[t.category]) return false;                      // Layer 2 handles it
    return true; // neither layer classified it → send to AI
  });
  if (needsAI.length === 0) return txns;

  const items = needsAI.map(t => ({
    id: t.id,
    name: t.counterparty || '',
    desc: t.description || '',
  }));

  console.log(`[ai-categorize] Classifying ${items.length} transactions...`);

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `Classify each transaction into one of these categories: ${VALID_CATEGORIES.join(', ')}

Rules:
- "Dining Out" = sit-down restaurants, local eateries (not fast food or delivery)
- "Asian Market" = Asian grocery stores and specialty food markets
- "Coffee" = coffee shops, boba, bubble tea, tea bars
- "Fast Food" = national fast food chains
- Return ONLY a compact single-line JSON object {"id":"Category",...} — no markdown fences, no indentation, no explanation

Transactions: ${JSON.stringify(items)}`,
      }],
    });

    const raw = response.content[0].text.trim().replace(/^```json?\n?|```$/g, '');
    const classifications = JSON.parse(raw);
    const classMap = new Map(Object.entries(classifications));

    console.log(`[ai-categorize] Done. Sample:`, [...classMap.entries()].slice(0, 3));

    return txns.map(t => ({
      ...t,
      aiCategory: classMap.get(t.id) ?? null,
    }));
  } catch (e) {
    console.error('[ai-categorize] Failed:', e.message);
    return txns;
  }
}
function isSpend(t)  { return !t.isInternalTransfer && (t.isCredit ? t.amount > 0 : t.amount < 0); }
function isInc(t)    { return !t.isInternalTransfer && !t.isCredit && t.amount > 0; }
function dollars(n)  { return '$' + Math.abs(n).toFixed(2); }

function buildChatContext(liquidity, txns, asOf) {
  const lines = [`Financial snapshot as of ${asOf}\n`];

  // Liquidity
  lines.push('ACCOUNTS & LIQUIDITY:');
  for (const a of liquidity.accounts) {
    const bal = a.isCredit
      ? `-${dollars(Math.abs(a.ledger))} (credit owed)`
      : `${dollars(a.available)} (available)`;
    lines.push(`  ${a.alias}: ${bal}`);
  }
  lines.push(`  Net liquidity: ${dollars(liquidity.netLiquidity)}\n`);

  // Group transactions by month
  const byMonth = new Map();
  for (const t of txns) {
    const mo = t.date.slice(0, 7); // YYYY-MM
    if (!byMonth.has(mo)) byMonth.set(mo, []);
    byMonth.get(mo).push(t);
  }

  const months = [...byMonth.keys()].sort().reverse(); // newest first
  lines.push(`TRANSACTION HISTORY (${months.length} months, ${txns.length} transactions total):`);

  for (const mo of months) {
    const mTxns = byMonth.get(mo);
    const spend  = mTxns.filter(isSpend).reduce((s, t) => s + Math.abs(t.amount), 0);
    const income = mTxns.filter(isInc).reduce((s, t) => s + t.amount, 0);

    lines.push(`\n  ${mo}:`);
    lines.push(`    Spend: ${dollars(spend)}  |  Income: ${dollars(income)}`);

    // Category breakdown
    const cats = new Map();
    for (const t of mTxns.filter(isSpend)) {
      const c = chatCategory(t);
      cats.set(c, (cats.get(c) || 0) + Math.abs(t.amount));
    }
    const catSorted = [...cats.entries()].sort((a, b) => b[1] - a[1]);
    if (catSorted.length) {
      lines.push(`    Categories: ${catSorted.map(([n, v]) => `${n} ${dollars(v)}`).join(', ')}`);
    }

    // Top 5 spending transactions
    const top = mTxns
      .filter(isSpend)
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5);
    if (top.length) {
      lines.push('    Top transactions:');
      for (const t of top) {
        const cat = chatCategory(t);
        lines.push(`      ${t.date}  ${(t.counterparty || t.description || '').slice(0, 40).padEnd(40)}  ${dollars(t.amount)}  [${cat}]  [${t.accountAlias}]`);
      }
    }
  }

  if (months.length === 0) lines.push('  No transactions found in the requested range.');

  return lines.join('\n');
}

// --- HTTP helpers ---
function jsonRes(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function serveStatic(res, urlPath) {
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safe);
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    const headers = { 'Content-Type': mime[ext] || 'text/plain' };
    if (ext === '.html') headers['Cache-Control'] = 'no-store';
    res.writeHead(200, headers);
    res.end(content);
  } catch {
    jsonRes(res, { error: 'Not found' }, 404);
  }
}

// --- Request router ---
async function requestHandler(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    // OAuth routes — handle before auth check
    if (await handleOAuth(req, res, url)) return;
    // All other routes require a valid session
    if (!requireAuth(req, res)) return;

    if (url.pathname === '/api/liquidity') {
      const sess = getSession(req);
      if (isDemoUser(sess?.email)) return jsonRes(res, getMockLiquidity());

      // Cached — 2 Teller calls (accounts + balance per account)
      const data = await withCache('liquidity', async () => {
        const accounts = await getAccounts();
        const withBal = await Promise.all(accounts.map(async a => {
          const b = await getBalance(a.id);
          return { alias: a.alias, available: b.available, ledger: b.ledger, isCredit: a.isCredit };
        }));
        const cash   = withBal.filter(a => !a.isCredit);
        const credit = withBal.filter(a => a.isCredit);
        const totalCash = cash.reduce((s, a) => s + a.available, 0);
        const totalOwed = credit.reduce((s, a) => s + Math.abs(a.ledger), 0);
        return { accounts: withBal, totalCash, totalOwed, netLiquidity: totalCash - totalOwed };
      });
      const limits = allowedAliases(req);
      if (limits) {
        const accts = data.accounts.filter(a => limits.includes(a.alias));
        const totalCash = accts.filter(a => !a.isCredit).reduce((s, a) => s + a.available, 0);
        const totalOwed = accts.filter(a => a.isCredit).reduce((s, a) => s + Math.abs(a.ledger), 0);
        jsonRes(res, { accounts: accts, totalCash, totalOwed, netLiquidity: totalCash - totalOwed });
      } else {
        jsonRes(res, data);
      }

    } else if (url.pathname === '/api/transactions') {
      const start = url.searchParams.get('start') || undefined;
      const end   = url.searchParams.get('end')   || undefined;
      const sess2 = getSession(req);
      if (isDemoUser(sess2?.email)) {
        return jsonRes(res, { transactions: getMockTransactions({ startDate: start, endDate: end }) });
      }

      let txns  = await getTxnsForRange(start, end);
      const limits = allowedAliases(req);
      if (limits) txns = txns.filter(t => limits.includes(t.accountAlias));
      jsonRes(res, { transactions: txns });

    } else if (url.pathname === '/api/email/test' && req.method === 'POST') {
      // Dev endpoint: send a test report email for a given account
      const body = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', c => raw += c);
        req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); } });
        req.on('error', reject);
      });
      const accountArg = (body.account || 'Chase').toLowerCase();
      const schedule = SCHEDULES.find(s =>
        s.account.toLowerCase().includes(accountArg) ||
        accountArg.includes(s.account.toLowerCase()) ||
        s.label.toLowerCase().includes(accountArg)
      ) || SCHEDULES[0];
      const endDate   = new Date().toISOString().split('T')[0];
      const startDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() - schedule.weeks * 7);
        return d.toISOString().split('T')[0];
      })();
      const allTxns = historyCache?.txns || [];
      const report  = buildReport(allTxns, schedule.account, startDate, endDate, `[TEST] ${schedule.label}`);
      const html    = renderHtml(report);
      await sendEmail(`[TEST] ${schedule.label} — ${startDate} → ${endDate}`, html);
      jsonRes(res, { ok: true, account: schedule.account, startDate, endDate, txnCount: report.txnCount, totalSpend: report.totalSpend });

    } else if (url.pathname === '/api/me') {
      const sess = getSession(req);
      if (!sess) return jsonRes(res, { error: 'Unauthorized' }, 401);
      jsonRes(res, { email: sess.email, isDemo: isDemoUser(sess.email) });

    } else if (url.pathname === '/api/cache/clear') {
      const size = CACHE.size + (historyCache?.txns?.length || 0);
      CACHE.clear();
      historyCache = null;
      try { fs.writeFileSync(TX_HISTORY_FILE, JSON.stringify({})); } catch {}
      // Rebuild immediately in background after clearing
      rebuildHistory();
      jsonRes(res, { ok: true, cleared: size, rebuilding: true });

    } else if (url.pathname === '/api/chat' && req.method === 'POST') {
      if (!process.env.ANTHROPIC_API_KEY) {
        jsonRes(res, { error: 'ANTHROPIC_API_KEY is not set in .env' }, 503);
        return;
      }

      // Parse request body
      const body = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => raw += chunk);
        req.on('end', () => resolve(raw));
        req.on('error', reject);
      });
      const { question, accountScope } = JSON.parse(body);

      // Build context using the disk-cached month store — 12 months of history,
      // zero extra Teller calls if the pre-warm already ran.
      const today = new Date();
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      const wideStart = twelveMonthsAgo.toISOString().split('T')[0];
      const wideEnd   = today.toISOString().split('T')[0];

      const sess3 = getSession(req);
      let liquidity, chatTxns;
      if (isDemoUser(sess3?.email)) {
        liquidity = getMockLiquidity();
        chatTxns  = getMockTransactions({ startDate: wideStart, endDate: wideEnd });
      } else {
        [liquidity, chatTxns] = await Promise.all([
          withCache('liquidity', async () => {
            const accounts = await getAccounts();
            const withBal = await Promise.all(accounts.map(async a => {
              const b = await getBalance(a.id);
              return { alias: a.alias, available: b.available, ledger: b.ledger, isCredit: a.isCredit };
            }));
            const cash   = withBal.filter(a => !a.isCredit);
            const credit = withBal.filter(a => a.isCredit);
            const totalCash = cash.reduce((s, a) => s + a.available, 0);
            const totalOwed = credit.reduce((s, a) => s + Math.abs(a.ledger), 0);
            return { accounts: withBal, totalCash, totalOwed, netLiquidity: totalCash - totalOwed };
          }),
          getTxnsForRange(wideStart, wideEnd),
        ]);
      }
      const txnData = { transactions: chatTxns };

      // Apply per-user account restrictions first, then honour any UI accountScope.
      const chatLimits = allowedAliases(req);
      let scopedTxns = chatLimits
        ? txnData.transactions.filter(t => chatLimits.includes(t.accountAlias))
        : txnData.transactions;
      let scopedLiquidity = liquidity;
      if (chatLimits) {
        const accts = liquidity.accounts.filter(a => chatLimits.includes(a.alias));
        const totalCash = accts.filter(a => !a.isCredit).reduce((s, a) => s + a.available, 0);
        const totalOwed = accts.filter(a => a.isCredit).reduce((s, a) => s + Math.abs(a.ledger), 0);
        scopedLiquidity = { accounts: accts, totalCash, totalOwed, netLiquidity: totalCash - totalOwed };
      }
      if (accountScope) {
        scopedTxns = scopedTxns.filter(t => t.accountAlias === accountScope);
        const scopedAccounts = scopedLiquidity.accounts.filter(a => a.alias === accountScope);
        const totalCash = scopedAccounts.filter(a => !a.isCredit).reduce((s, a) => s + a.available, 0);
        const totalOwed = scopedAccounts.filter(a => a.isCredit).reduce((s, a) => s + Math.abs(a.ledger), 0);
        scopedLiquidity = { accounts: scopedAccounts, totalCash, totalOwed, netLiquidity: totalCash - totalOwed };
      }

      const financialContext = buildChatContext(scopedLiquidity, scopedTxns, wideEnd);
      const scopeNote = accountScope ? ` You are answering questions scoped to "${accountScope}" only — do not reference other accounts.` : '';

      // SSE response so text streams in real-time
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const stream = anthropic.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        system: `You are Sushi-Vault, a private financial assistant for Hayson's family. You have access to their real bank data from Chase and Wells Fargo via Teller.io. Be concise, factual, and neutral — never guess or hallucinate transaction details. Only reference data present in the snapshot below. If asked about a period not covered, say so clearly.${scopeNote}\n\n${financialContext}`,
        messages: [{ role: 'user', content: question }],
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();

    } else {
      const filePath = url.pathname === '/' ? 'index.html'
        : url.pathname === '/login' ? 'login.html'
        : url.pathname.slice(1);
      serveStatic(res, filePath);
    }
  } catch (err) {
    jsonRes(res, { error: err.message }, 500);
  }
}

// Give reporter.js access to the categorizer so email reports match the dashboard
setChatCategory(chatCategory);

// ── Scheduled reports ──────────────────────────────────────────────────────
async function fireReport(schedule) {
  try {
    const endDate   = new Date().toISOString().split('T')[0];
    const startDate = (() => {
      const d = new Date();
      d.setDate(d.getDate() - schedule.weeks * 7);
      return d.toISOString().split('T')[0];
    })();
    const allTxns = historyCache?.txns || [];
    const report  = buildReport(allTxns, schedule.account, startDate, endDate, schedule.label);
    const html    = renderHtml(report);
    await sendEmail(`${schedule.label} — ${startDate} → ${endDate}`, html);
    console.log(`[report] Sent ${schedule.label}`);
  } catch (err) {
    console.error(`[report] Failed for ${schedule.account}:`, err.message);
  }
}

for (const schedule of SCHEDULES) {
  cron.schedule(schedule.cronExpr, () => {
    // WF is biweekly — only fire on even ISO weeks
    if (schedule.weeks === 2 && !isBiweeklyWeek()) return;
    fireReport(schedule);
  }, { timezone: 'America/Los_Angeles' });
  console.log(`[cron] Scheduled: ${schedule.label} (${schedule.cronExpr})`);
}

// ── Start server (HTTPS if certs present, else HTTP) ──────────────────────
const SSL_CERT = process.env.SSL_CERT;
const SSL_KEY  = process.env.SSL_KEY;

let server;
if (SSL_CERT && SSL_KEY && fs.existsSync(SSL_CERT) && fs.existsSync(SSL_KEY)) {
  const tlsOptions = {
    cert: fs.readFileSync(SSL_CERT),
    key:  fs.readFileSync(SSL_KEY),
  };
  server = https.createServer(tlsOptions, requestHandler);
  server.listen(PORT, () => {
    console.log(`\nSushi-Vault UI  →  https://sushivault.app (port ${PORT})`);
    console.log(`Clear cache: GET /api/cache/clear`);
    console.log(`Test email:  POST /api/email/test  {"account":"Chase"}\n`);
    prewarmHistory().catch(e => console.error('[prewarm] Fatal:', e.message));
  });

  // HTTP → HTTPS redirect on port 80
  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://sushivault.app${req.url}` });
    res.end();
  }).listen(80, () => console.log('[http] Redirecting port 80 → HTTPS'));
} else {
  server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`\nSushi-Vault UI  →  http://localhost:${PORT}`);
    console.log(`Clear cache: GET /api/cache/clear`);
    console.log(`Test email:  POST /api/email/test  {"account":"Chase"}\n`);
    prewarmHistory().catch(e => console.error('[prewarm] Fatal:', e.message));
  });
}
