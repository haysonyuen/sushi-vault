import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getLiquiditySummary } from './tools/liquidity.js';
import { getTaggedTransactions, formatTransactions } from './tools/transactions.js';
import { getBurnRate } from './tools/burn_rate.js';

const server = new Server(
  { name: 'sushi-vault', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// --- Tool definitions ---
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_liquidity_summary',
      description:
        'Returns current balances across all tracked accounts (WF Savings, Chase Freedom). ' +
        'Shows cash available, credit owed, and net liquidity. Run this first on every session.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'get_transactions',
      description:
        'Returns transactions across all accounts for a date range. ' +
        'Internal transfers between accounts are detected and tagged to prevent double-counting.',
      inputSchema: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format (inclusive)',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format (inclusive)',
          },
          include_transfers: {
            type: 'boolean',
            description: 'If true, include internal transfers in output (default: false)',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_burn_rate',
      description:
        'Returns a weekly spend summary comparing this week\'s velocity against ' +
        'the prior 4-week average. Flags deviations. No editorial spin.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
  ],
}));

// --- Tool handlers ---
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_liquidity_summary': {
        const result = await getLiquiditySummary();
        return { content: [{ type: 'text', text: result }] };
      }

      case 'get_transactions': {
        const txns = await getTaggedTransactions({
          startDate: args?.start_date,
          endDate: args?.end_date,
        });
        const text = formatTransactions(txns, {
          includeTransfers: args?.include_transfers ?? false,
        });
        return { content: [{ type: 'text', text }] };
      }

      case 'get_burn_rate': {
        const result = await getBurnRate();
        return { content: [{ type: 'text', text: result }] };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

// --- Start server ---
const transport = new StdioServerTransport();
await server.connect(transport);
