// src/mock-data.js
// Demo data for haysonyuen0114@gmail.com
// Persona: Hayson Yuen — married SWE in San Jose, 1.5-yr-old son,
// expenses scattered across accounts for credit card rewards,
// overspending on dining/delivery, saving toward baby's future.
// Income: two mid-level Bay Area SWE salaries (~$170k + ~$155k base).

export const DEMO_EMAIL = 'haysonyuen0114@gmail.com';
export const isDemoUser = (email) => email?.toLowerCase() === DEMO_EMAIL;

// Account descriptors
const CHK = { id: 'mock_chase_chk', alias: 'Chase Checking (0001)', isCredit: false };
const FR  = { id: 'mock_chase_fr',  alias: 'Chase Freedom (0002)',  isCredit: true  };
const WFC = { id: 'mock_wf_chk',   alias: 'WF Checking (0003)',    isCredit: false };
const WFS = { id: 'mock_wf_sav',   alias: 'WF Savings (0004)',     isCredit: false };

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
// ALL TRANSACTIONS  (Mar 2025 → Mar 12, 2026 — 12 months)
// Checking accounts: positive = income, negative = spending
// Credit card (Chase Freedom): positive = charge, negative = payment/refund
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TRANSACTIONS = [

  // ── MARCH 2025 ─────────────────────────────────────────────────────────

  t('a2503_001', CHK, '2025-03-07', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2503_002', CHK, '2025-03-21', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2503_003', CHK, '2025-03-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2503_004', CHK, '2025-03-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -112.00, 'utilities'),
  t('a2503_005', CHK, '2025-03-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2503_010', FR,  '2025-03-03', 'DoorDash',         'DOORDASH*DOORDASH.COM',                  38.20, 'dining'),
  t('a2503_011', FR,  '2025-03-05', 'Kyoto Ramen',      'KYOTO RAMEN SAN JOSE CA',               64.00, 'dining'),
  t('a2503_012', FR,  '2025-03-08', 'Safeway',          'SAFEWAY #1234',                         148.00, 'groceries'),
  t('a2503_013', FR,  '2025-03-10', 'Starbucks',        'STARBUCKS #12345 SAN JOSE CA',           14.50, 'coffee'),
  t('a2503_014', FR,  '2025-03-12', 'Uber Eats',        'UBER* EATS',                             41.80, 'dining'),
  t('a2503_015', FR,  '2025-03-13', 'Target',           'TARGET #0234 MILPITAS CA',              145.00, 'shopping'),
  t('a2503_016', FR,  '2025-03-15', 'Amazon',           'AMAZON.COM*AB1C2D',                      78.99, 'shopping'),
  t('a2503_017', FR,  '2025-03-17', 'Poke Market',      'POKE MARKET SAN JOSE CA',               58.00, 'dining'),
  t('a2503_018', FR,  '2025-03-19', 'Chevron',          'CHEVRON #9876 MILPITAS CA',              60.00, 'fuel'),
  t('a2503_019', FR,  '2025-03-20', 'Netflix',          'NETFLIX.COM',                            22.99, 'software'),
  t('a2503_020', FR,  '2025-03-20', 'Spotify',          'SPOTIFY PREMIUM',                        10.99, 'software'),
  t('a2503_021', FR,  '2025-03-22', 'Gong Cha',         'GONG CHA SAN JOSE CA',                  21.00, 'coffee'),
  t('a2503_022', FR,  '2025-03-24', 'SGD Tofu House',   'SGD TOFU HOUSE MILPITAS',               68.00, 'dining'),
  t('a2503_023', FR,  '2025-03-26', 'Safeway',          'SAFEWAY #1234',                         128.00, 'groceries'),
  t('a2503_024', FR,  '2025-03-28', 'DoorDash',         'DOORDASH*DOORDASH.COM',                  44.50, 'dining'),
  t('a2503_025', FR,  '2025-03-31', 'AT&T',             'ATT*BILL PAYMENT',                       65.00, 'phone'),
  t('a2503_026', FR,  '2025-03-11', 'Planet Fitness',  'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2503_027', FR,  '2025-03-18', 'CVS Pharmacy',    'CVS PHARMACY #4521',                     42.80, 'health'),
  t('a2503_028', FR,  '2025-03-25', 'Philz Coffee',    'PHILZ COFFEE SAN JOSE CA',               18.50, 'coffee'),
  t('a2503_040', WFC, '2025-03-07', 'PAYROLL DEPOSIT',  'DIRECT DEPOSIT PAYROLL',               3800.00, 'payroll'),
  t('a2503_041', WFC, '2025-03-21', 'PAYROLL DEPOSIT',  'DIRECT DEPOSIT PAYROLL',               3800.00, 'payroll'),
  t('a2503_042', WFC, '2025-03-06', '99 Ranch Market',  '99 RANCH MARKET #44',                  -155.00, 'groceries'),
  t('a2503_043', WFC, '2025-03-14', 'H Mart',            'H MART MILPITAS CA',                    -92.00, 'groceries'),
  t('a2503_044', WFC, '2025-03-20', 'Costco',            'COSTCO WHSE #0123',                    -238.00, 'groceries'),
  t('a2503_045', WFC, '2025-03-15', 'T-Mobile',          'T-MOBILE AUTO PAY',                     -85.00, 'phone'),
  t('a2503_050', WFS, '2025-03-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),

  // ── APRIL 2025 ─────────────────────────────────────────────────────────

  t('a2504_001', CHK, '2025-04-04', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2504_002', CHK, '2025-04-18', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2504_003', CHK, '2025-04-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2504_004', CHK, '2025-04-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -88.00, 'utilities'),
  t('a2504_005', CHK, '2025-04-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2504_006', CHK, '2025-04-15', 'IRS',                    'IRS TREAS TAX REFUND',            1240.00, 'income'),
  t('a2504_010', FR,  '2025-04-02', 'DoorDash',         'DOORDASH*DOORDASH.COM',                  36.80, 'dining'),
  t('a2504_011', FR,  '2025-04-05', 'Thai Basil Kitchen','THAI BASIL KITCHEN SJ',                 72.00, 'dining'),
  t('a2504_012', FR,  '2025-04-07', 'Safeway',           'SAFEWAY #1234',                        152.00, 'groceries'),
  t('a2504_013', FR,  '2025-04-09', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          15.00, 'coffee'),
  t('a2504_014', FR,  '2025-04-11', 'REI',               'REI #123 MILPITAS CA',                 145.00, 'shopping'),
  t('a2504_015', FR,  '2025-04-12', 'Uber Eats',         'UBER* EATS',                            43.20, 'dining'),
  t('a2504_016', FR,  '2025-04-14', 'Poke Market',       'POKE MARKET SAN JOSE CA',               55.00, 'dining'),
  t('a2504_017', FR,  '2025-04-16', 'Shell',             'SHELL OIL 12345678',                    57.00, 'fuel'),
  t('a2504_018', FR,  '2025-04-18', 'Amazon',            'AMAZON.COM*EF7G8H',                     92.00, 'shopping'),
  t('a2504_019', FR,  '2025-04-19', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',               66.00, 'dining'),
  t('a2504_020', FR,  '2025-04-20', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2504_021', FR,  '2025-04-20', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2504_022', FR,  '2025-04-22', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 48.50, 'dining'),
  t('a2504_023', FR,  '2025-04-24', 'Target',            'TARGET #0234 MILPITAS CA',             138.00, 'shopping'),
  t('a2504_024', FR,  '2025-04-26', 'Safeway',           'SAFEWAY #1234',                        131.00, 'groceries'),
  t('a2504_025', FR,  '2025-04-28', 'Gong Cha',          'GONG CHA SAN JOSE CA',                  20.50, 'coffee'),
  t('a2504_026', FR,  '2025-04-30', 'AT&T',             'ATT*BILL PAYMENT',                       65.00, 'phone'),
  t('a2504_027', FR,  '2025-04-10', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2504_028', FR,  '2025-04-17', 'Kaiser Permanente','KAISER PERMANENTE COPAY',                 30.00, 'health'),
  t('a2504_029', FR,  '2025-04-23', 'IKEA',             'IKEA US EAST PALO ALTO CA',             185.00, 'home'),
  t('a2504_040', WFC, '2025-04-04', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2504_041', WFC, '2025-04-18', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2504_042', WFC, '2025-04-05', '99 Ranch Market',   '99 RANCH MARKET #44',                 -148.00, 'groceries'),
  t('a2504_043', WFC, '2025-04-12', 'H Mart',             'H MART MILPITAS CA',                   -88.00, 'groceries'),
  t('a2504_044', WFC, '2025-04-19', 'Costco',             'COSTCO WHSE #0123',                   -228.00, 'groceries'),
  t('a2504_045', WFC, '2025-04-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2504_050', WFS, '2025-04-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('a2504_051', WFS, '2025-04-30', 'Interest Payment',   'INTEREST CREDIT',                       2.20, 'income'),

  // ── MAY 2025 ───────────────────────────────────────────────────────────

  t('a2505_001', CHK, '2025-05-02', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2505_002', CHK, '2025-05-16', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2505_003', CHK, '2025-05-30', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2505_004', CHK, '2025-05-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2505_005', CHK, '2025-05-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -78.00, 'utilities'),
  t('a2505_006', CHK, '2025-05-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2505_010', FR,  '2025-05-03', 'Uber Eats',         'UBER* EATS',                            44.50, 'dining'),
  t('a2505_011', FR,  '2025-05-05', 'Ramen Nagi',        'RAMEN NAGI SAN JOSE CA',               72.00, 'dining'),
  t('a2505_012', FR,  '2025-05-07', 'Safeway',           'SAFEWAY #1234',                        162.00, 'groceries'),
  t('a2505_013', FR,  '2025-05-09', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          14.80, 'coffee'),
  t('a2505_014', FR,  '2025-05-11', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 39.90, 'dining'),
  t('a2505_015', FR,  '2025-05-12', 'Amazon',            'AMAZON.COM*IJ9K0L',                    115.00, 'shopping'),
  t('a2505_016', FR,  '2025-05-14', 'Target',            'TARGET #0234 MILPITAS CA',             188.00, 'shopping'),
  t('a2505_017', FR,  '2025-05-15', 'Poke Market',       'POKE MARKET SAN JOSE CA',               60.00, 'dining'),
  t('a2505_018', FR,  '2025-05-17', 'Chevron',           'CHEVRON #9876 MILPITAS CA',             63.00, 'fuel'),
  t('a2505_019', FR,  '2025-05-19', 'SGD Tofu House',    'SGD TOFU HOUSE MILPITAS',               74.00, 'dining'),
  t('a2505_020', FR,  '2025-05-20', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2505_021', FR,  '2025-05-20', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2505_022', FR,  '2025-05-21', 'Uber Eats',         'UBER* EATS',                            47.20, 'dining'),
  t('a2505_023', FR,  '2025-05-23', 'Tiger Sugar',       'TIGER SUGAR SAN JOSE CA',               18.50, 'coffee'),
  t('a2505_024', FR,  '2025-05-25', 'Safeway',           'SAFEWAY #1234',                        139.00, 'groceries'),
  t('a2505_025', FR,  '2025-05-27', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 52.80, 'dining'),
  t('a2505_026', FR,  '2025-05-31', 'AT&T',              'ATT*BILL PAYMENT',                      65.00, 'phone'),
  t('a2505_027', FR,  '2025-05-10', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2505_028', FR,  '2025-05-13', 'Blue Bottle Coffee','BLUE BOTTLE COFFEE SJ',                  16.80, 'coffee'),
  t('a2505_029', FR,  '2025-05-18', 'Home Depot',        'THE HOME DEPOT #0456',                  98.50, 'home'),
  t('a2505_030', FR,  '2025-05-24', 'AMC Theatres',      'AMC THEATRES MILPITAS CA',               52.00, 'entertainment'),
  t('a2505_040', WFC, '2025-05-02', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2505_041', WFC, '2025-05-16', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2505_042', WFC, '2025-05-30', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2505_043', WFC, '2025-05-08', '99 Ranch Market',   '99 RANCH MARKET #44',                 -162.00, 'groceries'),
  t('a2505_044', WFC, '2025-05-15', 'H Mart',             'H MART MILPITAS CA',                   -94.00, 'groceries'),
  t('a2505_045', WFC, '2025-05-22', 'Costco',             'COSTCO WHSE #0123',                   -255.00, 'groceries'),
  t('a2505_046', WFC, '2025-05-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2505_050', WFS, '2025-05-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),

  // ── JUNE 2025 (summer — LA trip) ────────────────────────────────────────

  t('a2506_001', CHK, '2025-06-13', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2506_002', CHK, '2025-06-27', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2506_003', CHK, '2025-06-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2506_004', CHK, '2025-06-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -72.00, 'utilities'),
  t('a2506_005', CHK, '2025-06-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2506_010', FR,  '2025-06-02', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 37.50, 'dining'),
  t('a2506_011', FR,  '2025-06-05', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',               70.00, 'dining'),
  t('a2506_012', FR,  '2025-06-06', 'Safeway',           'SAFEWAY #1234',                        145.00, 'groceries'),
  t('a2506_013', FR,  '2025-06-07', 'Alaska Airlines',   'ALASKA AIRLINES',                      389.00, 'travel'),
  t('a2506_014', FR,  '2025-06-08', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          15.20, 'coffee'),
  // LA trip June 13-16
  t('a2506_015', FR,  '2025-06-13', 'Marriott',          'MARRIOTT LOS ANGELES CA',              285.00, 'travel'),
  t('a2506_016', FR,  '2025-06-13', 'Uber',              'UBER* TRIP',                            32.50, 'transport'),
  t('a2506_017', FR,  '2025-06-14', 'Bestia',            'BESTIA RESTAURANT LA CA',              185.00, 'dining'),
  t('a2506_018', FR,  '2025-06-14', 'Marriott',          'MARRIOTT LOS ANGELES CA',              285.00, 'travel'),
  t('a2506_019', FR,  '2025-06-15', 'Grand Central Market','GRAND CENTRAL MARKET LA',             68.00, 'dining'),
  t('a2506_020', FR,  '2025-06-15', 'Marriott',          'MARRIOTT LOS ANGELES CA',              285.00, 'travel'),
  t('a2506_021', FR,  '2025-06-16', 'Uber',              'UBER* TRIP',                            28.90, 'transport'),
  t('a2506_022', FR,  '2025-06-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2506_023', FR,  '2025-06-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2506_024', FR,  '2025-06-18', 'Amazon',            'AMAZON.COM*MN1O2P',                     88.00, 'shopping'),
  t('a2506_025', FR,  '2025-06-20', 'Uber Eats',         'UBER* EATS',                            46.00, 'dining'),
  t('a2506_026', FR,  '2025-06-22', 'Target',            'TARGET #0234 MILPITAS CA',             155.00, 'shopping'),
  t('a2506_027', FR,  '2025-06-24', 'Safeway',           'SAFEWAY #1234',                        138.00, 'groceries'),
  t('a2506_028', FR,  '2025-06-25', 'Shell',             'SHELL OIL 12345678',                    61.00, 'fuel'),
  t('a2506_029', FR,  '2025-06-27', 'Poke Market',       'POKE MARKET SAN JOSE CA',               58.00, 'dining'),
  t('a2506_030', FR,  '2025-06-30', 'AT&T',              'ATT*BILL PAYMENT',                      65.00, 'phone'),
  t('a2506_031', FR,  '2025-06-10', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2506_032', FR,  '2025-06-11', 'CVS Pharmacy',     'CVS PHARMACY #4521',                     38.50, 'health'),
  t('a2506_033', FR,  '2025-06-23', 'Nordstrom Rack',   'NORDSTROM RACK GREAT MALL CA',          145.00, 'shopping'),
  t('a2506_040', WFC, '2025-06-13', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2506_041', WFC, '2025-06-27', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2506_042', WFC, '2025-06-05', '99 Ranch Market',   '99 RANCH MARKET #44',                 -158.00, 'groceries'),
  t('a2506_043', WFC, '2025-06-12', 'H Mart',             'H MART MILPITAS CA',                   -91.00, 'groceries'),
  t('a2506_044', WFC, '2025-06-19', 'Costco',             'COSTCO WHSE #0123',                   -242.00, 'groceries'),
  t('a2506_045', WFC, '2025-06-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2506_050', WFS, '2025-06-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('a2506_051', WFS, '2025-06-30', 'Interest Payment',   'INTEREST CREDIT',                       2.40, 'income'),

  // ── JULY 2025 (summer — higher dining & entertainment) ──────────────────

  t('a2507_001', CHK, '2025-07-11', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2507_002', CHK, '2025-07-25', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2507_003', CHK, '2025-07-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2507_004', CHK, '2025-07-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -108.00, 'utilities'),
  t('a2507_005', CHK, '2025-07-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2507_010', FR,  '2025-07-02', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 49.80, 'dining'),
  t('a2507_011', FR,  '2025-07-04', 'Safeway',           'SAFEWAY #1234',                        195.00, 'groceries'), // July 4th
  t('a2507_012', FR,  '2025-07-05', 'Happy Hotpot',      'HAPPY HOTPOT MILPITAS CA',             162.00, 'dining'),
  t('a2507_013', FR,  '2025-07-07', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          15.50, 'coffee'),
  t('a2507_014', FR,  '2025-07-09', 'Uber Eats',         'UBER* EATS',                            53.20, 'dining'),
  t('a2507_015', FR,  '2025-07-10', 'AMC Theatres',      'AMC THEATRES MILPITAS CA',              58.00, 'entertainment'),
  t('a2507_016', FR,  '2025-07-12', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 44.90, 'dining'),
  t('a2507_017', FR,  '2025-07-14', 'Amazon',            'AMAZON.COM*QR3S4T',                    105.00, 'shopping'),
  t('a2507_018', FR,  '2025-07-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2507_019', FR,  '2025-07-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2507_020', FR,  '2025-07-17', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',               74.00, 'dining'),
  t('a2507_021', FR,  '2025-07-19', 'Shell',             'SHELL OIL 12345678',                    64.50, 'fuel'),
  t('a2507_022', FR,  '2025-07-21', 'Uber Eats',         'UBER* EATS',                            47.00, 'dining'),
  t('a2507_023', FR,  '2025-07-23', 'Target',            'TARGET #0234 MILPITAS CA',             168.00, 'shopping'),
  t('a2507_024', FR,  '2025-07-24', 'Safeway',           'SAFEWAY #1234',                        152.00, 'groceries'),
  t('a2507_025', FR,  '2025-07-25', 'Boba Guys',         'BOBA GUYS SAN JOSE CA',                 24.50, 'coffee'),
  t('a2507_026', FR,  '2025-07-26', 'Banchan Korean BBQ','BANCHAN KOREAN BBQ MILPITAS',           98.00, 'dining'),
  t('a2507_027', FR,  '2025-07-28', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 55.40, 'dining'),
  t('a2507_028', FR,  '2025-07-31', 'AT&T',              'ATT*BILL PAYMENT',                      65.00, 'phone'),
  t('a2507_029', FR,  '2025-07-08', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2507_030', FR,  '2025-07-18', 'Fry\'s Electronics','FRYS ELECTRONICS SUNNYVALE CA',          225.00, 'shopping'),
  t('a2507_031', FR,  '2025-07-20', 'Philz Coffee',     'PHILZ COFFEE SAN JOSE CA',               17.50, 'coffee'),
  t('a2507_032', FR,  '2025-07-27', 'Great America',    'CALIFORNIA GREAT AMERICA',               98.00, 'entertainment'),
  t('a2507_040', WFC, '2025-07-11', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2507_041', WFC, '2025-07-25', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2507_042', WFC, '2025-07-07', '99 Ranch Market',   '99 RANCH MARKET #44',                 -172.00, 'groceries'),
  t('a2507_043', WFC, '2025-07-14', 'H Mart',             'H MART MILPITAS CA',                   -98.00, 'groceries'),
  t('a2507_044', WFC, '2025-07-21', 'Costco',             'COSTCO WHSE #0123',                   -262.00, 'groceries'),
  t('a2507_045', WFC, '2025-07-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2507_050', WFS, '2025-07-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),

  // ── AUGUST 2025 ────────────────────────────────────────────────────────

  t('a2508_001', CHK, '2025-08-08', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2508_002', CHK, '2025-08-22', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2508_003', CHK, '2025-08-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2508_004', CHK, '2025-08-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -118.00, 'utilities'),
  t('a2508_005', CHK, '2025-08-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2508_010', FR,  '2025-08-02', 'Uber Eats',         'UBER* EATS',                            42.60, 'dining'),
  t('a2508_011', FR,  '2025-08-04', 'SGD Tofu House',    'SGD TOFU HOUSE MILPITAS',               69.00, 'dining'),
  t('a2508_012', FR,  '2025-08-06', 'Safeway',           'SAFEWAY #1234',                        155.00, 'groceries'),
  t('a2508_013', FR,  '2025-08-08', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          14.50, 'coffee'),
  t('a2508_014', FR,  '2025-08-10', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 46.30, 'dining'),
  t('a2508_015', FR,  '2025-08-12', 'Target',            'TARGET #0234 MILPITAS CA',             158.00, 'shopping'),
  t('a2508_016', FR,  '2025-08-14', 'Amazon',            'AMAZON.COM*UV5W6X',                     95.00, 'shopping'),
  t('a2508_017', FR,  '2025-08-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2508_018', FR,  '2025-08-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2508_019', FR,  '2025-08-17', 'Chevron',           'CHEVRON #9876 MILPITAS CA',             62.50, 'fuel'),
  t('a2508_020', FR,  '2025-08-19', 'Poke Market',       'POKE MARKET SAN JOSE CA',               57.00, 'dining'),
  t('a2508_021', FR,  '2025-08-21', 'Uber Eats',         'UBER* EATS',                            44.80, 'dining'),
  t('a2508_022', FR,  '2025-08-23', 'Gong Cha',          'GONG CHA SAN JOSE CA',                  21.50, 'coffee'),
  t('a2508_023', FR,  '2025-08-25', 'Safeway',           'SAFEWAY #1234',                        143.00, 'groceries'),
  t('a2508_024', FR,  '2025-08-27', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 50.20, 'dining'),
  t('a2508_025', FR,  '2025-08-29', 'Thai Basil Kitchen','THAI BASIL KITCHEN SJ',                 76.00, 'dining'),
  t('a2508_026', FR,  '2025-08-31', 'AT&T',              'ATT*BILL PAYMENT',                      65.00, 'phone'),
  t('a2508_027', FR,  '2025-08-09', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2508_028', FR,  '2025-08-13', 'Walgreens',        'WALGREENS #8821',                        34.20, 'health'),
  t('a2508_029', FR,  '2025-08-20', 'HomeGoods',        'HOMEGOODS #0245 MILPITAS CA',           118.00, 'home'),
  t('a2508_030', FR,  '2025-08-28', 'Dutch Bros',       'DUTCH BROS COFFEE SJ',                   13.50, 'coffee'),
  t('a2508_040', WFC, '2025-08-08', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2508_041', WFC, '2025-08-22', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2508_042', WFC, '2025-08-07', '99 Ranch Market',   '99 RANCH MARKET #44',                 -160.00, 'groceries'),
  t('a2508_043', WFC, '2025-08-14', 'H Mart',             'H MART MILPITAS CA',                   -96.00, 'groceries'),
  t('a2508_044', WFC, '2025-08-21', 'Costco',             'COSTCO WHSE #0123',                   -248.00, 'groceries'),
  t('a2508_045', WFC, '2025-08-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2508_050', WFS, '2025-08-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('a2508_051', WFS, '2025-08-31', 'Interest Payment',   'INTEREST CREDIT',                       2.50, 'income'),

  // ── SEPTEMBER 2025 (baby prep — higher shopping) ────────────────────────

  t('a2509_001', CHK, '2025-09-05', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2509_002', CHK, '2025-09-19', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2509_003', CHK, '2025-09-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2509_004', CHK, '2025-09-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -96.00, 'utilities'),
  t('a2509_005', CHK, '2025-09-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',      -1200.00, 'transfer', true), // extra baby prep
  t('a2509_010', FR,  '2025-09-02', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 40.50, 'dining'),
  t('a2509_011', FR,  '2025-09-04', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',               68.00, 'dining'),
  t('a2509_012', FR,  '2025-09-06', 'Buy Buy Baby',      'BUYBUYBABY #0123 MILPITAS CA',         485.00, 'shopping'),
  t('a2509_013', FR,  '2025-09-08', 'Safeway',           'SAFEWAY #1234',                        148.00, 'groceries'),
  t('a2509_014', FR,  '2025-09-09', 'Amazon',            'AMAZON.COM*YZ7A8B',                    225.00, 'shopping'), // baby gear
  t('a2509_015', FR,  '2025-09-10', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          15.00, 'coffee'),
  t('a2509_016', FR,  '2025-09-12', 'Uber Eats',         'UBER* EATS',                            43.70, 'dining'),
  t('a2509_017', FR,  '2025-09-14', 'Target',            'TARGET #0234 MILPITAS CA',             312.00, 'shopping'), // baby supplies
  t('a2509_018', FR,  '2025-09-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2509_019', FR,  '2025-09-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2509_020', FR,  '2025-09-17', 'Shell',             'SHELL OIL 12345678',                    60.50, 'fuel'),
  t('a2509_021', FR,  '2025-09-18', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 52.90, 'dining'),
  t('a2509_022', FR,  '2025-09-20', 'Amazon',            'AMAZON.COM*CD9E0F',                    178.00, 'shopping'), // baby gear
  t('a2509_023', FR,  '2025-09-22', 'Poke Market',       'POKE MARKET SAN JOSE CA',               56.00, 'dining'),
  t('a2509_024', FR,  '2025-09-24', 'Safeway',           'SAFEWAY #1234',                        132.00, 'groceries'),
  t('a2509_025', FR,  '2025-09-25', 'Tiger Sugar',       'TIGER SUGAR SAN JOSE CA',               19.00, 'coffee'),
  t('a2509_026', FR,  '2025-09-27', 'Uber Eats',         'UBER* EATS',                            46.80, 'dining'),
  t('a2509_027', FR,  '2025-09-30', 'AT&T',              'ATT*BILL PAYMENT',                      65.00, 'phone'),
  t('a2509_028', FR,  '2025-09-07', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2509_029', FR,  '2025-09-11', 'Kaiser Permanente','KAISER PERMANENTE COPAY',                 45.00, 'health'), // prenatal visit
  t('a2509_030', FR,  '2025-09-16', 'Philz Coffee',     'PHILZ COFFEE SAN JOSE CA',               17.00, 'coffee'),
  t('a2509_031', FR,  '2025-09-28', 'Home Depot',       'THE HOME DEPOT #0456',                  145.00, 'home'), // nursery prep
  t('a2509_040', WFC, '2025-09-05', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2509_041', WFC, '2025-09-19', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2509_042', WFC, '2025-09-06', '99 Ranch Market',   '99 RANCH MARKET #44',                 -168.00, 'groceries'),
  t('a2509_043', WFC, '2025-09-13', 'H Mart',             'H MART MILPITAS CA',                   -92.00, 'groceries'),
  t('a2509_044', WFC, '2025-09-20', 'Costco',             'COSTCO WHSE #0123',                   -258.00, 'groceries'),
  t('a2509_045', WFC, '2025-09-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2509_050', WFS, '2025-09-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',            1200.00, 'transfer', true),

  // ── OCTOBER 2025 ───────────────────────────────────────────────────────

  t('a2510_001', CHK, '2025-10-03', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2510_002', CHK, '2025-10-17', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2510_003', CHK, '2025-10-31', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2510_004', CHK, '2025-10-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2510_005', CHK, '2025-10-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                    -92.00, 'utilities'),
  t('a2510_006', CHK, '2025-10-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2510_010', FR,  '2025-10-02', 'Uber Eats',         'UBER* EATS',                            41.20, 'dining'),
  t('a2510_011', FR,  '2025-10-04', 'SGD Tofu House',    'SGD TOFU HOUSE MILPITAS',               71.00, 'dining'),
  t('a2510_012', FR,  '2025-10-06', 'Safeway',           'SAFEWAY #1234',                        162.00, 'groceries'),
  t('a2510_013', FR,  '2025-10-08', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          15.50, 'coffee'),
  t('a2510_014', FR,  '2025-10-10', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 48.60, 'dining'),
  t('a2510_015', FR,  '2025-10-12', 'Amazon',            'AMAZON.COM*GH1I2J',                    118.00, 'shopping'),
  t('a2510_016', FR,  '2025-10-14', 'Target',            'TARGET #0234 MILPITAS CA',             175.00, 'shopping'), // Halloween prep
  t('a2510_017', FR,  '2025-10-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2510_018', FR,  '2025-10-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2510_019', FR,  '2025-10-17', 'Chevron',           'CHEVRON #9876 MILPITAS CA',             63.50, 'fuel'),
  t('a2510_020', FR,  '2025-10-19', 'Ramen Nagi',        'RAMEN NAGI SAN JOSE CA',               76.00, 'dining'),
  t('a2510_021', FR,  '2025-10-22', 'Safeway',           'SAFEWAY #1234',                        148.00, 'groceries'),
  t('a2510_022', FR,  '2025-10-24', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 51.40, 'dining'),
  t('a2510_023', FR,  '2025-10-25', 'Gong Cha',          'GONG CHA SAN JOSE CA',                  22.00, 'coffee'),
  t('a2510_024', FR,  '2025-10-27', 'Uber Eats',         'UBER* EATS',                            44.30, 'dining'),
  t('a2510_025', FR,  '2025-10-29', 'Amazon',            'AMAZON.COM*KL3M4N',                     88.00, 'shopping'),
  t('a2510_026', FR,  '2025-10-31', 'AT&T',             'ATT*BILL PAYMENT',                       65.00, 'phone'),
  t('a2510_027', FR,  '2025-10-05', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2510_028', FR,  '2025-10-11', 'CVS Pharmacy',     'CVS PHARMACY #4521',                     52.40, 'health'),
  t('a2510_029', FR,  '2025-10-18', 'Blue Bottle Coffee','BLUE BOTTLE COFFEE SJ',                  15.50, 'coffee'),
  t('a2510_030', FR,  '2025-10-26', 'Party City',       'PARTY CITY #0456 MILPITAS CA',           88.00, 'shopping'), // Halloween
  t('a2510_040', WFC, '2025-10-03', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2510_041', WFC, '2025-10-17', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2510_042', WFC, '2025-10-31', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2510_043', WFC, '2025-10-06', '99 Ranch Market',   '99 RANCH MARKET #44',                 -165.00, 'groceries'),
  t('a2510_044', WFC, '2025-10-13', 'H Mart',             'H MART MILPITAS CA',                   -94.00, 'groceries'),
  t('a2510_045', WFC, '2025-10-20', 'Costco',             'COSTCO WHSE #0123',                   -252.00, 'groceries'),
  t('a2510_046', WFC, '2025-10-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2510_050', WFS, '2025-10-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('a2510_051', WFS, '2025-10-31', 'Interest Payment',   'INTEREST CREDIT',                       2.60, 'income'),

  // ── NOVEMBER 2025 (Thanksgiving + Black Friday) ─────────────────────────

  t('a2511_001', CHK, '2025-11-14', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2511_002', CHK, '2025-11-28', 'ADP DIRECT DEPOSIT',     'DIRECT DEPOSIT PAYROLL',          4200.00, 'payroll'),
  t('a2511_003', CHK, '2025-11-01', 'SILICON VALLEY APTS',    'RENT PAYMENT',                   -3200.00, 'home'),
  t('a2511_004', CHK, '2025-11-03', 'PG&E GAS AND ELECTRIC',  'PG&E AUTO PAY',                   -102.00, 'utilities'),
  t('a2511_005', CHK, '2025-11-15', 'TRANSFER TO WF SAVINGS', 'ONLINE TRANSFER BABY FUND',       -700.00, 'transfer', true),
  t('a2511_010', FR,  '2025-11-02', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 45.80, 'dining'),
  t('a2511_011', FR,  '2025-11-04', 'Kyoto Ramen',       'KYOTO RAMEN SAN JOSE CA',               70.00, 'dining'),
  t('a2511_012', FR,  '2025-11-06', 'Safeway',           'SAFEWAY #1234',                        158.00, 'groceries'),
  t('a2511_013', FR,  '2025-11-08', 'Starbucks',         'STARBUCKS #12345 SAN JOSE CA',          16.00, 'coffee'), // holiday drinks start
  t('a2511_014', FR,  '2025-11-10', 'Uber Eats',         'UBER* EATS',                            47.50, 'dining'),
  t('a2511_015', FR,  '2025-11-12', 'Amazon',            'AMAZON.COM*OP5Q6R',                    145.00, 'shopping'),
  t('a2511_016', FR,  '2025-11-14', 'Target',            'TARGET #0234 MILPITAS CA',             162.00, 'shopping'),
  t('a2511_017', FR,  '2025-11-16', 'Netflix',           'NETFLIX.COM',                           22.99, 'software'),
  t('a2511_018', FR,  '2025-11-16', 'Spotify',           'SPOTIFY PREMIUM',                       10.99, 'software'),
  t('a2511_019', FR,  '2025-11-17', 'Shell',             'SHELL OIL 12345678',                    62.00, 'fuel'),
  t('a2511_020', FR,  '2025-11-19', 'DoorDash',          'DOORDASH*DOORDASH.COM',                 51.20, 'dining'),
  t('a2511_021', FR,  '2025-11-21', 'Safeway',           'SAFEWAY #1234',                        245.00, 'groceries'), // Thanksgiving shop
  t('a2511_022', FR,  '2025-11-25', 'Safeway',           'SAFEWAY #1234',                        178.00, 'groceries'), // Thanksgiving day
  t('a2511_023', FR,  '2025-11-26', 'Amazon',            'AMAZON.COM*ST7U8V',                    289.00, 'shopping'), // Black Friday
  t('a2511_024', FR,  '2025-11-27', 'Best Buy',          'BEST BUY #0123 MILPITAS CA',           445.00, 'shopping'), // Black Friday
  t('a2511_025', FR,  '2025-11-28', 'Target',            'TARGET #0234 MILPITAS CA',             215.00, 'shopping'), // Black Friday
  t('a2511_026', FR,  '2025-11-29', 'Tiger Sugar',       'TIGER SUGAR SAN JOSE CA',               20.00, 'coffee'),
  t('a2511_027', FR,  '2025-11-30', 'AT&T',             'ATT*BILL PAYMENT',                       65.00, 'phone'),
  t('a2511_028', FR,  '2025-11-07', 'Planet Fitness',   'PLANET FITNESS DUES',                    25.00, 'health'),
  t('a2511_029', FR,  '2025-11-11', 'Kaiser Permanente','KAISER PERMANENTE COPAY',                 30.00, 'health'),
  t('a2511_030', FR,  '2025-11-18', 'Philz Coffee',     'PHILZ COFFEE SAN JOSE CA',               17.50, 'coffee'),
  t('a2511_031', FR,  '2025-11-22', 'HomeGoods',        'HOMEGOODS #0245 MILPITAS CA',           135.00, 'home'),
  t('a2511_040', WFC, '2025-11-14', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2511_041', WFC, '2025-11-28', 'PAYROLL DEPOSIT',   'DIRECT DEPOSIT PAYROLL',              3800.00, 'payroll'),
  t('a2511_042', WFC, '2025-11-06', '99 Ranch Market',   '99 RANCH MARKET #44',                 -172.00, 'groceries'),
  t('a2511_043', WFC, '2025-11-13', 'H Mart',             'H MART MILPITAS CA',                   -96.00, 'groceries'),
  t('a2511_044', WFC, '2025-11-20', 'Costco',             'COSTCO WHSE #0123',                   -318.00, 'groceries'), // Thanksgiving Costco run
  t('a2511_045', WFC, '2025-11-15', 'T-Mobile',           'T-MOBILE AUTO PAY',                    -85.00, 'phone'),
  t('a2511_046', WFC, '2025-11-27', '99 Ranch Market',   '99 RANCH MARKET #44',                  -88.00, 'groceries'),
  t('a2511_050', WFS, '2025-11-15', 'TRANSFER FROM CHASE', 'ONLINE TRANSFER CREDIT',             700.00, 'transfer', true),
  t('a2511_051', WFS, '2025-11-30', 'Interest Payment',   'INTEREST CREDIT',                       2.70, 'income'),

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
      { alias: 'Chase Checking (0001)', available: 12450.00, ledger: 12450.00, isCredit: false },
      { alias: 'Chase Freedom (0002)',  available: 0,        ledger: -2340.50, isCredit: true  },
      { alias: 'WF Checking (0003)',   available:  8920.00, ledger:  8920.00, isCredit: false },
      { alias: 'WF Savings (0004)',    available:  5600.00, ledger:  5600.00, isCredit: false },
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
