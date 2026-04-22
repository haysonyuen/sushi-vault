# Transaction Classification Skills

A guide for correctly classifying bank transactions in Sushi-Vault. Follow this process before adding or modifying any entry in `CHAT_CATEGORIES` or `learnedMap`.

---

## Step 1 — Read the Raw Transaction Description Carefully

Bank transaction strings are often truncated, abbreviated, or contain system codes. Break the description apart before drawing conclusions.

**Common patterns:**
| Pattern | Meaning |
|---|---|
| `SP ` prefix | Square Point-of-sale (small business card reader) |
| `PT* ` prefix | Payment terminal |
| `SQ *` prefix | Square payment |
| `TST* ` prefix | Toast POS (restaurant system) |
| `#1234` suffix | Store/location number — ignore for classification |
| `SAN JOSE CA` | Location suffix — ignore for classification |
| `PROTON SYSTEM` | Backend payment processor — ignore |

**Example:**
```
PT* YESMEAL GROCERIES PROTON-SYSTEM
```
→ Strip prefix `PT*` and suffix `PROTON-SYSTEM`
→ Core merchant: **YESMEAL GROCERIES**
→ The word "GROCERIES" is part of the business name — classify as Groceries

---

## Step 2 — Research the Merchant

Do not assume based on the name alone. Look up the actual business before classifying.

**Research checklist:**
1. Google the merchant name + city if available
2. Check if it's a chain vs local business
3. Read the business description — what do they actually sell?
4. Check their website or Google Maps category

**Common traps:**
- A name containing "kitchen" might be a meal prep company, not a restaurant
- A name containing "market" might be a restaurant with "market" in its branding
- Food delivery platforms (DoorDash, Uber Eats) appear as the platform name, not the restaurant
- "YESMEAL" alone = meal ordering platform (Dining Out / Food Delivery), but "YESMEAL GROCERIES" = separate grocery delivery service

---

## Step 3 — Apply the Category Definitions

Use these definitions consistently. When in doubt, use the more specific category.

### Food & Dining
| Category | Definition | Examples |
|---|---|---|
| Food Delivery | Third-party delivery platforms | DoorDash, Uber Eats, Grubhub, Postmates |
| Fast Food | National quick-service chains with counter ordering | McDonald's, Chipotle, Taco Bell, In-N-Out |
| Coffee | Coffee shops, boba, bubble tea, tea bars | Starbucks, Philz, Dutch Bros, Gong Cha, Somisomi |
| Dining Out | Sit-down restaurants, local eateries, sandwich shops | Any restaurant not covered above |
| Asian Market | Asian specialty grocery stores | 99 Ranch, H Mart, Mitsuwa, Nijiya |
| Groceries | General supermarkets and grocery delivery | Safeway, Trader Joe's, Whole Foods, Yesmeal Groceries |

**Key distinctions:**
- Somisomi = soft serve ice cream / dessert → **Coffee** (dessert cafés group here)
- Chipotle = fast casual but counter-order national chain → **Fast Food**
- A local sandwich shop = sit-down or counter local eatery → **Dining Out**
- Instacart = grocery delivery platform → **Food Delivery** (not Groceries)

### Retail & Shopping
| Category | Definition | Examples |
|---|---|---|
| Target | Target only | Target |
| Walmart | Walmart/Sam's Club | Walmart, Wal-Mart |
| Costco | Costco only | Costco |
| Amazon | Amazon purchases (not Prime subscription) | Amazon.com |
| Shopping | General retail, department stores, home goods | IKEA, Home Depot, Macy's, Ross, TJ Maxx |

### Transportation
| Category | Definition | Examples |
|---|---|---|
| Transportation | Rideshare, transit, parking, tolls | Uber (rides only), Lyft, Metro, parking meters |
| Gas | Fuel stations | Chevron, Shell, Arco, Valero |
| Auto | Auto repair, tires, car services | America's Tire, Jiffy Lube, AAA |

**Key distinction:** `UBER` alone = Transportation. `UBER EATS` = Food Delivery.

### Bills & Transfers
| Category | Definition |
|---|---|
| Housing | Mortgage, rent, HOA |
| Utilities | Phone, internet, electricity, water, gas utility |
| Insurance | Any insurance payment |
| Credit Payment | Credit card payments, loan payments |
| Peer Transfer | Venmo, Zelle, Cash App, PayPal person-to-person |

### Health
| Category | Definition | Examples |
|---|---|---|
| Health | Pharmacies, doctors, dentists, medical facilities | CVS, Walgreens, Kaiser, urgent care |
| Fitness | Gyms, fitness studios (use if Claude names it) | Planet Fitness, Equinox |

### Travel & Entertainment
| Category | Definition |
|---|---|
| Travel | Airlines, hotels, vacation rentals, booking platforms |
| Ski Trip | Ski resorts, lift tickets, ski gear |
| Subscriptions | Streaming services, software subscriptions |
| Gaming | Game purchases and platforms |
| Entertainment | Movie theaters, events, amusement parks |

---

## Step 4 — Decide Where to Add the Fix

| Situation | Action |
|---|---|
| Well-known chain or keyword | Add to **Layer 1a** (`CHAT_CATEGORIES` regex) |
| Specific local merchant Claude got right | Already in **learnedMap** — no action needed |
| Specific local merchant Claude got wrong | Manually edit `.learned-categories.json` on server |
| Claude inventing wrong new category | Correct in `.learned-categories.json` |

### Layer 1a Rules
- Place **more specific entries before broader ones** — the array is checked in order, first match wins
- `YESMEAL GROCERIES` must come before the general Dining Out entry or it will be swallowed by `YESMEAL` in that regex
- Use word boundaries (`\b`) when a keyword could match inside a longer word (e.g. `\bUBER\b` to avoid matching UBER EATS)
- Test your regex against edge cases before committing

### Editing learnedMap Manually
```bash
nano /root/sushi-vault/.learned-categories.json
```
Format: `{"MERCHANT NAME IN CAPS": "Category", ...}`

After editing, restart the server:
```bash
pm2 restart sushi-vault
```
Then clear cache to apply to existing transactions:
```js
fetch('/api/cache/clear').then(r=>r.json()).then(console.log)
```

---

## Step 5 — Verify

After deploying any fix:
1. Clear cache in browser console: `fetch('/api/cache/clear').then(r=>r.json()).then(console.log)`
2. Wait ~30 seconds for rebuild
3. Refresh dashboard and confirm the merchant shows the correct category
4. Check logs for `[learned]` lines to confirm learnedMap is growing

---

## Quick Reference — Category List

```
Housing · Credit Payment · Utilities · Insurance
Peer Transfer · Wise Transfer · International · Cash / ATM
Food Delivery · Coffee · Fast Food · Groceries · Dining Out
Asian Market · Costco · Groceries · Target · Walmart · Amazon · Shopping
Health · Gas · Transportation · Auto
Ski Trip · Travel
Subscriptions · Gaming · Education · Entertainment
Other (last resort only)
```
