import { ActiveContext, AssistantResponse, DraftMessage, Email, WhatsAppChat } from '../types';

export async function processVoiceCommand(
  command: string,
  activeContext: ActiveContext,
  conversationHistory: { role: 'user' | 'assistant'; text: string }[],
  emails: Email[],
  whatsappChats: WhatsAppChat[],
  pendingDrafts: DraftMessage[],
  targetEmail?: string,
  targetWhatsAppNumber?: string
): Promise<AssistantResponse> {
  try {
    const res = await fetch('/api/assistant/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command,
        activeContext,
        conversationHistory,
        emails,
        whatsappChats,
        pendingDrafts,
        targetEmail,
        targetWhatsAppNumber,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const data: AssistantResponse = await res.json();
    return data;
  } catch (error: any) {
    console.error('Failed to communicate with assistant backend:', error);
    // Return graceful fallback response
    return {
      spokenReply: "I'm having trouble connecting to the executive server, but I have safely kept your active context.",
      intent: 'general',
      confidence: 0.5,
      needsClarification: false,
      extractedDetails: { dates: [], amounts: [], actionItems: [] }
    };
  }
}
