// src/mock-data.js
// Demo data for haysonyuen0114@gmail.com
// Persona: Hayson Yuen — married SWE in San Jose, 1.5-yr-old son,
// expenses scattered across accounts for credit card rewards,
// overspending on dining/delivery, saving toward baby's future.
// Income: two mid-level Bay Area SWE salaries (~$170k + ~$155k base).

export const DEMO_EMAIL = 'haysonyuen0114@gmail.com';
export const isDemoUser = (email) => email?.toLowerCase() === DEMO_EMAIL;

// Account descriptors
const CHK = { id: 'mock_chase_chk', alias: 'Chase Checking', isCredit: false };
const FR  = { id: 'mock_chase_fr',  alias: 'Chase Freedom',  isCredit: true  };
const WFC = { id: 'mock_wf_chk',   alias: 'WF Checking',    isCredit: false };
const WFS = { id: 'mock_wf_sav',   alias: 'WF Savings',     isCredit: false };

function t(id, acc, date, counterparty, desc, amount, cat, internal = false) {
  return {
    id, date, description: desc, amount,
    type: 'transaction', status: 'posted',
    category: cat, counterparty,
    accountAlias: acc.alias, accountId: acc.id,
    isCredit: acc.isCredit, isInternalTransfer: internal,
    aiCategory: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL TRANSACTIONS  (Dec 2025 → Mar 10, 2026)
// Checking accounts: positive = income, negative = spending
// Credit card (Chase Freedom): positive = charge, negative = payment/refund
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TRANSACTIONS = [

  // ── DECEMBER 2025 ──────────────────────────────────────────────────────

  // Chase Checking — income & fixed bills
  t('mc001', CHK, '2025-12-05', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mc002', CHK, '2025-12-19', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mc003', CHK, '2025-12-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('mc004', CHK, '2025-12-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -98.00, 'utilities'),
  t('mc005', CHK, '2025-12-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),

  // Chase Freedom — December spending
  t('mc010', FR, '2025-12-03', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   38.50, 'dining'),
  t('mc011', FR, '2025-12-05', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',                 62.00, 'dining'),
  t('mc012', FR, '2025-12-07', 'Safeway',           'SAFEWAY #1234',                           145.00, 'groceries'),
  t('mc013', FR, '2025-12-09', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',             14.50, 'coffee'),
  t('mc014', FR, '2025-12-10', 'Amazon',            'AMAZON.COM*AB1C2D',                        89.99, 'shopping'),
  t('mc015', FR, '2025-12-12', 'Uber Eats',         'UBER* EATS',                              45.00, 'dining'),
  t('mc016', FR, '2025-12-13', 'Target',            'TARGET #0234 MILPITAS CA',               167.00, 'shopping'),
  t('mc017', FR, '2025-12-16', 'Thai Basil Kitchen','THAI BASIL KITCHEN SJ',                   78.00, 'dining'),
  t('mc018', FR, '2025-12-18', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   42.50, 'dining'),
  t('mc019', FR, '2025-12-19', 'Shell',             'SHELL OIL 12345678',                      58.00, 'fuel'),
  t('mc020', FR, '2025-12-20', 'Netflix',           'NETFLIX.COM',                             22.99, 'software'),
  t('mc021', FR, '2025-12-20', 'Spotify',           'SPOTIFY PREMIUM',                         10.99, 'software'),
  t('mc022', FR, '2025-12-21', 'Poke Market',       'POKE MARKET SAN JOSE CA',                 55.00, 'dining'),
  t('mc023', FR, '2025-12-22', 'Boba Guys',         'BOBA GUYS SAN JOSE CA',                   22.50, 'coffee'),
  t('mc024', FR, '2025-12-24', 'Target',            'TARGET #0234 MILPITAS CA',               245.00, 'shopping'),
  t('mc025', FR, '2025-12-26', 'Dim Sum Garden',    'DIM SUM GARDEN MILPITAS CA',              88.00, 'dining'),
  t('mc026', FR, '2025-12-28', 'Safeway',           'SAFEWAY #1234',                           135.00, 'groceries'),
  t('mc027', FR, '2025-12-29', 'Uber Eats',         'UBER* EATS',                              51.00, 'dining'),
  t('mc028', FR, '2025-12-30', 'SGD Tofu House',    'SGD TOFU HOUSE MILPITAS',                 72.00, 'dining'),
  t('mc029', FR, '2025-12-31', 'AT&T',              'ATT*BILL PAYMENT',                        65.00, 'phone'),

  // WF Checking — December
  t('mc040', WFC, '2025-12-05', 'PAYROLL DEPOSIT',    'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('mc041', WFC, '2025-12-19', 'PAYROLL DEPOSIT',    'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('mc042', WFC, '2025-12-08', '99 Ranch Market',    '99 RANCH MARKET #44',                  -165.00, 'groceries'),
  t('mc043', WFC, '2025-12-14', 'H Mart',             'H MART MILPITAS CA',                    -98.00, 'groceries'),
  t('mc044', WFC, '2025-12-20', 'Costco',             'COSTCO WHSE #0123',                    -245.00, 'groceries'),
  t('mc045', WFC, '2025-12-23', 'T-Mobile',           'T-MOBILE AUTO PAY',                     -85.00, 'phone'),
  t('mc046', WFC, '2025-12-28', '99 Ranch Market',    '99 RANCH MARKET #44',                   -78.00, 'groceries'),

  // WF Savings — December
  t('mc050', WFS, '2025-12-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),

  // ── JANUARY 2026 ───────────────────────────────────────────────────────

  // Chase Checking — income & fixed bills
  t('mj001', CHK, '2026-01-03', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mj002', CHK, '2026-01-17', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mj003', CHK, '2026-01-31', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mj004', CHK, '2026-01-15', 'MORGAN STANLEY',         'MORGAN STANLEY RSU PROCEEDS',    15000.00, 'payroll'),
  t('mj005', CHK, '2026-01-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('mj006', CHK, '2026-01-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -145.00, 'utilities'),
  t('mj007', CHK, '2026-01-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),

  // Chase Freedom — January (food overspend story)
  // Food delivery
  t('mj010', FR, '2026-01-04', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   42.80, 'dining'),
  t('mj011', FR, '2026-01-06', 'Uber Eats',         'UBER* EATS',                              38.50, 'dining'),
  t('mj012', FR, '2026-01-10', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   55.20, 'dining'),
  t('mj013', FR, '2026-01-14', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   47.90, 'dining'),
  t('mj014', FR, '2026-01-18', 'Uber Eats',         'UBER* EATS',                              43.00, 'dining'),
  t('mj015', FR, '2026-01-22', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   61.50, 'dining'),
  t('mj016', FR, '2026-01-25', 'Uber Eats',         'UBER* EATS',                              38.90, 'dining'),
  t('mj017', FR, '2026-01-28', 'DoorDash',          'DOORDASH*DOORDASH.COM',                   52.40, 'dining'),
  // Dining out
  t('mj020', FR, '2026-01-05', 'Kyoto Ramen',        'KYOTO RAMEN SAN JOSE CA',                68.00, 'dining'),
  t('mj021', FR, '2026-01-08', 'Poke Market',        'POKE MARKET SAN JOSE CA',                54.00, 'dining'),
  t('mj022', FR, '2026-01-11', 'Happy Hotpot',       'HAPPY HOTPOT MILPITAS CA',              145.00, 'dining'),
  t('mj023', FR, '2026-01-15', 'Thai Basil Kitchen', 'THAI BASIL KITCHEN SJ',                  78.50, 'dining'),
  t('mj024', FR, '2026-01-19', 'Banchan Korean BBQ', 'BANCHAN KOREAN BBQ MILPITAS',             92.00, 'dining'),
  t('mj025', FR, '2026-01-23', 'SGD Tofu House',     'SGD TOFU HOUSE MILPITAS',                65.00, 'dining'),
  t('mj026', FR, '2026-01-26', 'Noodle Express',     'NOODLE EXPRESS SAN JOSE CA',             58.00, 'dining'),
  t('mj027', FR, '2026-01-29', 'Hong Kong Bistro',   'HONG KONG BISTRO MILPITAS',              82.00, 'dining'),
  // Coffee & boba
  t('mj030', FR, '2026-01-07', 'Starbucks',    'STARBUCKS #12345 SAN JOSE CA',                 15.80, 'coffee'),
  t('mj031', FR, '2026-01-12', 'Gong Cha',     'GONG CHA SAN JOSE CA',                         22.50, 'coffee'),
  t('mj032', FR, '2026-01-16', 'Starbucks',    'STARBUCKS #12345 SAN JOSE CA',                 14.50, 'coffee'),
  t('mj033', FR, '2026-01-21', 'Tiger Sugar',  'TIGER SUGAR SAN JOSE CA',                      18.90, 'coffee'),
  t('mj034', FR, '2026-01-27', 'Starbucks',    'STARBUCKS #12345 SAN JOSE CA',                 16.20, 'coffee'),
  // Groceries
  t('mj035', FR, '2026-01-09', 'Safeway',       'SAFEWAY #1234',                              167.00, 'groceries'),
  t('mj036', FR, '2026-01-20', 'Safeway',       'SAFEWAY #1234',                              142.00, 'groceries'),
  t('mj037', FR, '2026-01-30', "Trader Joe's",  "TRADER JOE'S #123",                           89.00, 'groceries'),
  // Baby & household (Target + Amazon)
  t('mj040', FR, '2026-01-06', 'Target',  'TARGET #0234 MILPITAS CA',                         198.00, 'shopping'),
  t('mj041', FR, '2026-01-17', 'Amazon',  'AMAZON.COM*AB1C2D',                                125.00, 'shopping'),
  t('mj042', FR, '2026-01-24', 'Target',  'TARGET #0234 MILPITAS CA',                         145.00, 'shopping'),
  t('mj043', FR, '2026-01-31', 'Amazon',  'AMAZON.COM*CD3E4F',                                 89.99, 'shopping'),
  // Gas
  t('mj044', FR, '2026-01-08', 'Chevron', 'CHEVRON #9876 MILPITAS CA',                         62.00, 'fuel'),
  t('mj045', FR, '2026-01-22', 'Shell',   'SHELL OIL 12345678',                                58.50, 'fuel'),
  // Subscriptions
  t('mj046', FR, '2026-01-20', 'Netflix', 'NETFLIX.COM',                                       22.99, 'software'),
  t('mj047', FR, '2026-01-20', 'Spotify', 'SPOTIFY PREMIUM',                                  10.99, 'software'),
  t('mj048', FR, '2026-01-20', 'Apple',   'APPLE.COM/BILL',                                     2.99, 'software'),
  t('mj049', FR, '2026-01-31', 'AT&T',    'ATT*BILL PAYMENT',                                  65.00, 'phone'),

  // WF Checking — January
  t('mj060', WFC, '2026-01-03', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mj061', WFC, '2026-01-17', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mj062', WFC, '2026-01-31', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mj063', WFC, '2026-01-07', '99 Ranch Market', '99 RANCH MARKET #44',                    -178.00, 'groceries'),
  t('mj064', WFC, '2026-01-13', 'H Mart',           'H MART MILPITAS CA',                     -95.00, 'groceries'),
  t('mj065', WFC, '2026-01-21', 'Costco',           'COSTCO WHSE #0123',                      -268.00, 'groceries'),
  t('mj066', WFC, '2026-01-28', '99 Ranch Market', '99 RANCH MARKET #44',                    -125.00, 'groceries'),
  t('mj067', WFC, '2026-01-15', 'T-Mobile',         'T-MOBILE AUTO PAY',                       -85.00, 'phone'),
  t('mj068', WFC, '2026-01-11', 'Sichuan Garden',   'SICHUAN GARDEN RESTAURANT SJ',            -76.00, 'dining'),

  // WF Savings — January
  t('mj070', WFS, '2026-01-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('mj071', WFS, '2026-01-31', 'Interest Payment',    'INTEREST CREDIT',                      2.50, 'income'),

  // ── FEBRUARY 2026 ──────────────────────────────────────────────────────

  // Chase Checking — income & fixed bills
  t('mf001', CHK, '2026-02-14', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mf002', CHK, '2026-02-28', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('mf003', CHK, '2026-02-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('mf004', CHK, '2026-02-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -132.00, 'utilities'),
  t('mf005', CHK, '2026-02-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),

  // Chase Freedom — February
  // Food delivery
  t('mf010', FR, '2026-02-02', 'DoorDash',  'DOORDASH*DOORDASH.COM',                          44.20, 'dining'),
  t('mf011', FR, '2026-02-06', 'Uber Eats', 'UBER* EATS',                                     52.80, 'dining'),
  t('mf012', FR, '2026-02-09', 'DoorDash',  'DOORDASH*DOORDASH.COM',                          38.50, 'dining'),
  t('mf013', FR, '2026-02-14', 'DoorDash',  'DOORDASH*DOORDASH.COM',                          68.90, 'dining'), // Valentine's Day delivery
  t('mf014', FR, '2026-02-17', 'Uber Eats', 'UBER* EATS',                                     42.00, 'dining'),
  t('mf015', FR, '2026-02-21', 'DoorDash',  'DOORDASH*DOORDASH.COM',                          51.30, 'dining'),
  t('mf016', FR, '2026-02-26', 'Uber Eats', 'UBER* EATS',                                     37.80, 'dining'),
  // Dining out
  t('mf020', FR, '2026-02-03', 'Poke Market',      'POKE MARKET SAN JOSE CA',                 62.00, 'dining'),
  t('mf021', FR, '2026-02-07', 'Ramen Nagi',        'RAMEN NAGI SAN JOSE CA',                 74.00, 'dining'),
  t('mf022', FR, '2026-02-11', 'Hong Kong Cafe',    'HONG KONG CAFE MILPITAS CA',             58.00, 'dining'),
  t('mf023', FR, '2026-02-14', 'Pacific Catch',     'PACIFIC CATCH SAN JOSE CA',             185.00, 'dining'), // Valentine's dinner
  t('mf024', FR, '2026-02-18', 'Thai Orchid',       'THAI ORCHID RESTAURANT SJ',              88.00, 'dining'),
  t('mf025', FR, '2026-02-22', 'SGD Tofu House',    'SGD TOFU HOUSE MILPITAS',                71.00, 'dining'),
  t('mf026', FR, '2026-02-25', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',                65.00, 'dining'),
  // Coffee & boba
  t('mf030', FR, '2026-02-05', 'Starbucks',   'STARBUCKS #12345 SAN JOSE CA',                 15.50, 'coffee'),
  t('mf031', FR, '2026-02-10', 'Gong Cha',    'GONG CHA SAN JOSE CA',                         21.50, 'coffee'),
  t('mf032', FR, '2026-02-15', 'Starbucks',   'STARBUCKS #12345 SAN JOSE CA',                 14.80, 'coffee'),
  t('mf033', FR, '2026-02-20', 'Tiger Sugar', 'TIGER SUGAR SAN JOSE CA',                      19.50, 'coffee'),
  t('mf034', FR, '2026-02-27', 'Dutch Bros',  'DUTCH BROS COFFEE SJ',                         12.50, 'coffee'),
  // Groceries
  t('mf035', FR, '2026-02-04', 'Safeway',      'SAFEWAY #1234',                              158.00, 'groceries'),
  t('mf036', FR, '2026-02-18', 'Safeway',      'SAFEWAY #1234',                              134.00, 'groceries'),
  t('mf037', FR, '2026-02-28', "Trader Joe's", "TRADER JOE'S #123",                           92.00, 'groceries'),
  // Baby & household
  t('mf040', FR, '2026-02-07', 'Target', 'TARGET #0234 MILPITAS CA',                         175.00, 'shopping'),
  t('mf041', FR, '2026-02-16', 'Amazon', 'AMAZON.COM*GH5I6J',                                148.00, 'shopping'),
  t('mf042', FR, '2026-02-24', 'Target', 'TARGET #0234 MILPITAS CA',                         132.00, 'shopping'),
  // Gas
  t('mf043', FR, '2026-02-10', 'Chevron', 'CHEVRON #9876 MILPITAS CA',                        65.00, 'fuel'),
  t('mf044', FR, '2026-02-24', 'Arco',    'ARCO #12345 SAN JOSE CA',                          54.50, 'fuel'),
  // Subscriptions
  t('mf045', FR, '2026-02-20', 'Netflix', 'NETFLIX.COM',                                      22.99, 'software'),
  t('mf046', FR, '2026-02-20', 'Spotify', 'SPOTIFY PREMIUM',                                 10.99, 'software'),
  t('mf047', FR, '2026-02-20', 'Apple',   'APPLE.COM/BILL',                                    2.99, 'software'),
  t('mf048', FR, '2026-02-28', 'AT&T',    'ATT*BILL PAYMENT',                                 65.00, 'phone'),

  // WF Checking — February
  t('mf060', WFC, '2026-02-14', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mf061', WFC, '2026-02-28', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mf062', WFC, '2026-02-05', '99 Ranch Market', '99 RANCH MARKET #44',                    -165.00, 'groceries'),
  t('mf063', WFC, '2026-02-12', 'H Mart',           'H MART MILPITAS CA',                     -89.00, 'groceries'),
  t('mf064', WFC, '2026-02-19', 'Costco',           'COSTCO WHSE #0123',                      -245.00, 'groceries'),
  t('mf065', WFC, '2026-02-26', '99 Ranch Market', '99 RANCH MARKET #44',                    -112.00, 'groceries'),
  t('mf066', WFC, '2026-02-15', 'T-Mobile',         'T-MOBILE AUTO PAY',                       -85.00, 'phone'),

  // WF Savings — February
  t('mf070', WFS, '2026-02-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('mf071', WFS, '2026-02-28', 'Interest Payment',    'INTEREST CREDIT',                      2.80, 'income'),

  // ── MARCH 2026 (partial — through Mar 10) ──────────────────────────────

  // Chase Checking
  t('mm001', CHK, '2026-03-07', 'ADP DIRECT DEPOSIT',    'DIRECT DEPOSIT PAYROLL',           4200.00, 'payroll'),
  t('mm002', CHK, '2026-03-01', 'SILICON VALLEY APTS',   'RENT PAYMENT',                    -3200.00, 'home'),
  t('mm003', CHK, '2026-03-03', 'PG&E GAS AND ELECTRIC', 'PG&E AUTO PAY',                    -118.00, 'utilities'),

  // Chase Freedom — early March
  t('mm010', FR, '2026-03-02', 'DoorDash',         'DOORDASH*DOORDASH.COM',                   46.50, 'dining'),
  t('mm011', FR, '2026-03-04', 'Kyoto Ramen',      'KYOTO RAMEN SAN JOSE CA',                 72.00, 'dining'),
  t('mm012', FR, '2026-03-06', 'Uber Eats',        'UBER* EATS',                              39.80, 'dining'),
  t('mm013', FR, '2026-03-07', 'Safeway',          'SAFEWAY #1234',                           155.00, 'groceries'),
  t('mm014', FR, '2026-03-08', 'Starbucks',        'STARBUCKS #12345 SAN JOSE CA',             15.20, 'coffee'),
  t('mm015', FR, '2026-03-09', 'Target',           'TARGET #0234 MILPITAS CA',               178.00, 'shopping'),
  t('mm016', FR, '2026-03-10', 'DoorDash',         'DOORDASH*DOORDASH.COM',                   53.40, 'dining'),

  // WF Checking — early March
  t('mm020', WFC, '2026-03-07', 'PAYROLL DEPOSIT', 'DIRECT DEPOSIT PAYROLL',                3800.00, 'payroll'),
  t('mm021', WFC, '2026-03-04', '99 Ranch Market', '99 RANCH MARKET #44',                    -142.00, 'groceries'),
  t('mm022', WFC, '2026-03-09', 'H Mart',           'H MART MILPITAS CA',                     -87.00, 'groceries'),
];

// Sort newest first (same convention as getTaggedTransactions)
ALL_TRANSACTIONS.sort((a, b) => b.date.localeCompare(a.date));

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export function getMockLiquidity() {
  return {
    accounts: [
      { alias: 'Chase Checking', available: 12450.00, ledger: 12450.00, isCredit: false },
      { alias: 'Chase Freedom',  available: 0,        ledger: -2340.50, isCredit: true  },
      { alias: 'WF Checking',   available:  8920.00, ledger:  8920.00, isCredit: false },
      { alias: 'WF Savings',    available:  5600.00, ledger:  5600.00, isCredit: false },
    ],
    totalCash:    12450.00 + 8920.00 + 5600.00,
    totalOwed:    2340.50,
    netLiquidity: 12450.00 + 8920.00 + 5600.00 - 2340.50,
  };
}

export function getMockTransactions({ startDate, endDate } = {}) {
  let txns = [...ALL_TRANSACTIONS];
  if (startDate) txns = txns.filter(t => t.date >= startDate);
  if (endDate)   txns = txns.filter(t => t.date <= endDate);
  return txns;
}
