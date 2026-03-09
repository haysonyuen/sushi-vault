// Maps last-4 digits of account/card number to a human-friendly alias.
// Full account numbers are never exposed in output.
export const ACCOUNT_ALIASES = {
  '0954': 'WF Savings',
  '4844': 'Chase Freedom',
};

// Accounts classified as credit cards — balances represent amount owed,
// charges are spend, payments are offsets.
export const CREDIT_CARD_LAST4 = new Set(['4844']);

export function getAlias(last4) {
  return ACCOUNT_ALIASES[last4] ?? `Account ...${last4}`;
}
