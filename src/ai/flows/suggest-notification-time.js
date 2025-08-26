'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal notification times
 * based on user behavior and preferences to enhance user engagement and ensure timely information delivery.
 *
 * @module suggest-notification-time
 *
 * @typedef {object} SuggestNotificationTimeInput
 * @property {string} notificationType - Type of notification (menu reminder, delivery update, order confirmation).
 * @property {string} userBehavior - User's past interaction data (order times, response times).
 *
 * @typedef {object} SuggestNotificationTimeOutput
 * @property {string} suggestedTime - The suggested time for sending the notification (e.g., "12:00 PM").
 * @property {string} rationale - Explanation for why this time is optimal.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNotificationTimeInputSchema = z.object({
  notificationType: z
    .string()
    .describe(
      'Type of notification (menu reminder, delivery update, order confirmation)'
    ),
  userBehavior: z
    .string()
    .describe(
      "User's past interaction data (order times, response times, preferences)"
    ),
});



const SuggestNotificationTimeOutputSchema = z.object({
  suggestedTime: z
    .string()
    .describe('The suggested time for sending the notification (e.g., \"12:00 PM\")'),
  rationale: z.string().describe('Explanation for why this time is optimal.'),
});



export async function suggestNotificationTime(
  input
) {
  return suggestNotificationTimeFlow(input);
}

const suggestNotificationTimePrompt = ai.definePrompt({
  name: 'suggestNotificationTimePrompt',
  input: {schema: SuggestNotificationTimeInputSchema},
  output: {schema: SuggestNotificationTimeOutputSchema},
  prompt: `You are an expert notification scheduler. Given the notification type and user behavior data, suggest the optimal time to send the notification and explain your reasoning.\n\nNotification Type: {{{notificationType}}}\nUser Behavior: {{{userBehavior}}}\n\nSuggested Time: \nRationale: `,
});

const suggestNotificationTimeFlow = ai.defineFlow(
  {
    name: 'suggestNotificationTimeFlow',
    inputSchema: SuggestNotificationTimeInputSchema,
    outputSchema: SuggestNotificationTimeOutputSchema,
  },
  async input => {
    const {output} = await suggestNotificationTimePrompt(input);
    return output;
  }
);
