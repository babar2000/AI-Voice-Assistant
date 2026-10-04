import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_EMAILS, INITIAL_WHATSAPP_CHATS } from './src/data/initialData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback logic for when Gemini API key is missing or offline
function fallbackAssistantProcessor(
  command: string,
  activeContext: any,
  emails: any[] = [],
  whatsappChats: any[] = [],
  pendingDrafts: any[] = [],
  targetEmail?: string,
  targetWhatsAppNumber?: string
) {
  const text = command.toLowerCase().trim();

  // 0. Dual-channel query check (when user passes targetEmail or targetWhatsAppNumber, or asks to search both)
  const isDualChannelExplicit = 
    Boolean(targetEmail || targetWhatsAppNumber) || 
    text.includes('both') || 
    text.includes('email and whatsapp') || 
    text.includes('whatsapp and email') ||
    text.includes('@') ||
    text.includes('+') ||
    text.includes('phone') ||
    text.includes('number');

  if (isDualChannelExplicit) {
    const emailMatches: any[] = [];
    const waMatches: any[] = [];

    // Search email
    for (const e of emails) {
      const hay = `${e.subject} ${e.snippet} ${e.body} ${e.sender.name} ${e.sender.email} ${e.recipients.map((r: any) => r.email).join(' ')}`.toLowerCase();
      const matchTargetEmail = targetEmail && hay.includes(targetEmail.toLowerCase());
      const matchCmd = text.split(/\s+/).some(w => w.length > 3 && hay.includes(w));
      if (matchTargetEmail || matchCmd || text.includes('babarzain322') || text.includes('ahmed') || text.includes('sarah') || text.includes('rashid')) {
        emailMatches.push({
          channel: 'email',
          id: e.id,
          title: e.subject,
          snippet: e.snippet,
          sender: e.sender.name,
          date: e.date
        });
      }
    }

    // Search WhatsApp
    for (const chat of whatsappChats) {
      const hay = `${chat.name} ${chat.phone} ${chat.messages.map((m: any) => m.text).join(' ')}`.toLowerCase();
      const matchTargetPhone = targetWhatsAppNumber && hay.includes(targetWhatsAppNumber.replace(/\s+/g, ''));
      const matchCmd = text.split(/\s+/).some(w => w.length > 3 && hay.includes(w));
      if (matchTargetPhone || matchCmd || text.includes('415') || text.includes('971') || text.includes('dubai') || text.includes('ahmed') || text.includes('rashid')) {
        waMatches.push({
          channel: 'whatsapp',
          id: chat.id,
          title: chat.name,
          snippet: chat.lastMessage,
          sender: chat.name,
          date: chat.lastMessageTime
        });
      }
    }

    if (emailMatches.length > 0 || waMatches.length > 0) {
      const topEmail = emailMatches[0];
      const topWa = waMatches[0];
      const spoken = `Cross-channel results: Found ${emailMatches.length} email${emailMatches.length === 1 ? '' : 's'}${topEmail ? ` regarding ${topEmail.title}` : ''}, and ${waMatches.length} WhatsApp message${waMatches.length === 1 ? '' : 's'}${topWa ? ` from ${topWa.sender}` : ''}.`;

      return {
        spokenReply: spoken,
        intent: 'search',
        confidence: 0.98,
        needsClarification: false,
        crossChannelSummary: {
          emailCount: emailMatches.length,
          whatsappCount: waMatches.length,
          matchedEmailId: topEmail?.id,
          matchedWhatsAppId: topWa?.id,
          keyTakeaway: `Successfully correlated records across Email (${emailMatches.length}) and WhatsApp (${waMatches.length}).`
        },
        matchedItems: [...emailMatches.slice(0, 3), ...waMatches.slice(0, 3)],
        extractedDetails: {
          dates: ['Today', 'Upcoming meetings'],
          amounts: ['$4,200,000 (Ahmed)', '$250,000 (Sarah Escrow)'],
          actionItems: ['Review Q4 deck', 'Provide Dubai meeting passport copies']
        },
        activeContextUpdate: {
          type: topEmail ? 'email' : 'whatsapp',
          id: (topEmail || topWa)?.id,
          name: (topEmail || topWa)?.sender,
          title: (topEmail || topWa)?.title,
          snippet: (topEmail || topWa)?.snippet,
          channel: topEmail ? 'email' : 'whatsapp'
        },
        suggestedQuickReplies: [
          "Draft reply on Email",
          "Draft reply on WhatsApp",
          "Summarize full thread"
        ]
      };
    }
  }

  // 0b. Gmail Inbox Query (e.g. "check my gmail", "what emails are in my gmail inbox", "my gmail", "babarzain322@gmail.com")
  if (
    text.includes('gmail') ||
    text.includes('my email') ||
    text.includes('my emails') ||
    text.includes('my inbox') ||
    text.includes('check inbox') ||
    text.includes('babarzain') ||
    text.includes('latest emails') ||
    text === 'emails' ||
    text === 'inbox'
  ) {
    const unread = emails.filter((e: any) => e.unread);
    const topEmail = emails[0];
    const spoken = `You have ${emails.length} emails in your Gmail inbox (${unread.length} unread). The most urgent is from ${topEmail.sender.name} regarding "${topEmail.subject}" requiring your sign-off before 3:00 PM.`;

    return {
      spokenReply: spoken,
      intent: 'search',
      confidence: 0.99,
      needsClarification: false,
      extractedDetails: {
        dates: ['Today 3:00 PM', 'Thursday 5:00 PM', 'Friday 5:00 PM'],
        amounts: ['$4,200,000 (Ahmed)', '$250,000 (Sarah)', '$185,000 (AWS renewal)'],
        actionItems: [
          'Ahmed Al-Mansoori: Sign off on slide 4 valuation multipliers before 3:00 PM',
          'Sarah Jenkins: Sign banking resolution for $250k legal escrow',
          'David Keller: DocuSign AWS annual renewal ($185k) before Friday'
        ]
      },
      matchedItems: emails.slice(0, 5).map((e: any) => ({
        channel: 'email',
        id: e.id,
        title: e.subject,
        snippet: e.snippet,
        sender: e.sender.name,
        date: e.date
      })),
      activeContextUpdate: {
        type: 'email',
        id: topEmail.id,
        name: topEmail.sender.name,
        title: topEmail.subject,
        snippet: topEmail.snippet,
        channel: 'email'
      },
      suggestedQuickReplies: [
        "Draft a reply to Ahmed",
        "Summarize Sarah's email",
        "Show AWS renewal details"
      ]
    };
  }

  // 1. Send authorization / Send request
  if (
    text.includes('send this') || 
    text.includes('send it') || 
    text === 'send' || 
    text.includes('send to') ||
    text.includes('authorize and send') ||
    text.includes('confirm send')
  ) {
    // Check if there is an active draft or pending draft
    let draft = pendingDrafts.find((d: any) => d.status === 'awaiting_confirmation') || 
                pendingDrafts[pendingDrafts.length - 1];

    if (!draft) {
      return {
        spokenReply: "There are no pending drafts to send. Would you like me to draft an email or WhatsApp message first?",
        intent: 'clarify',
        confidence: 0.9,
        needsClarification: true,
        clarificationQuestion: "No draft found. Who would you like to message?",
        extractedDetails: { dates: [], amounts: [], actionItems: [] },
        suggestedQuickReplies: ["Draft reply to Ahmed", "Check WhatsApp for Dubai meeting"]
      };
    }

    // Check if user says "Confirm send" or "Yes send it"
    if (text.includes('confirm') || text.includes('yes') || text.includes('authorize')) {
      return {
        spokenReply: `Authorized. Outgoing ${draft.channel === 'email' ? 'email' : 'WhatsApp message'} sent to ${draft.recipient.name}.`,
        intent: 'confirm_send',
        confidence: 0.98,
        needsClarification: false,
        sendDraftId: draft.id,
        extractedDetails: { dates: [], amounts: [], actionItems: [] },
        activeContextUpdate: {
          type: draft.channel,
          id: draft.replyToId || draft.id,
          name: draft.recipient.name,
          title: draft.subject || 'Direct message',
          channel: draft.channel
        }
      };
    }

    // Explicit confirmation request before sending
    return {
      spokenReply: `I have the draft to ${draft.recipient.name} ready. Should I authorize and send it now?`,
      intent: 'request_send_authorization',
      confidence: 0.95,
      needsClarification: false,
      sendDraftId: draft.id,
      extractedDetails: { dates: [], amounts: [], actionItems: [] },
      suggestedQuickReplies: ["Confirm send", "Cancel sending", "Edit draft"]
    };
  }

  // 2. Draft reply / Draft message
  if (text.startsWith('draft') || text.includes('draft a reply') || text.includes('draft reply') || text.includes('draft email') || text.includes('draft whatsapp') || text.includes('prepare a reply')) {
    // Extract instructions from command (e.g., "Draft a reply saying I'll call tomorrow")
    let sayingMatch = command.match(/saying\s+(.+)$/i) || command.match(/that\s+(.+)$/i) || [null, ''];
    let instructions = sayingMatch[1] || "I will review and follow up shortly.";

    // Determine target based on context or mention
    let targetEmail = null;
    let targetWa = null;

    if (text.includes('ahmed')) {
      targetEmail = emails.find((e: any) => e.sender.name.toLowerCase().includes('ahmed'));
      targetWa = whatsappChats.find((w: any) => w.name.toLowerCase().includes('ahmed'));
    } else if (text.includes('sarah')) {
      targetEmail = emails.find((e: any) => e.sender.name.toLowerCase().includes('sarah'));
      targetWa = whatsappChats.find((w: any) => w.name.toLowerCase().includes('sarah'));
    } else if (text.includes('rashid')) {
      targetWa = whatsappChats.find((w: any) => w.name.toLowerCase().includes('rashid'));
    } else if (activeContext && activeContext.type === 'email') {
      targetEmail = emails.find((e: any) => e.id === activeContext.id);
    } else if (activeContext && activeContext.type === 'whatsapp') {
      targetWa = whatsappChats.find((w: any) => w.id === activeContext.id);
    } else {
      // Default to latest email if no target specified
      targetEmail = emails[0];
    }

    const isWhatsApp = Boolean(targetWa && (!targetEmail || text.includes('whatsapp') || (activeContext && activeContext.type === 'whatsapp')));

    if (isWhatsApp && targetWa) {
      return {
        spokenReply: `I drafted a WhatsApp reply to ${targetWa.name}. As a safety rule, I will never send without your explicit authorization.`,
        intent: 'draft_whatsapp',
        confidence: 0.95,
        needsClarification: false,
        newDraft: {
          channel: 'whatsapp',
          recipientName: targetWa.name,
          recipientIdentifier: targetWa.phone,
          content: instructions.trim() ? instructions.trim() : "Hi, confirmed! I'll call you tomorrow.",
          tone: 'conversational',
          replyToId: targetWa.id
        },
        extractedDetails: {
          dates: text.includes('tomorrow') ? ['Tomorrow'] : [],
          amounts: [],
          actionItems: [`Send WhatsApp reply to ${targetWa.name}`]
        },
        activeContextUpdate: {
          type: 'whatsapp',
          id: targetWa.id,
          name: targetWa.name,
          channel: 'whatsapp'
        },
        suggestedQuickReplies: ["Send this to him", "Edit draft", "Cancel"]
      };
    } else if (targetEmail) {
      const isTomorrow = text.includes('tomorrow');
      const draftContent = `Dear ${targetEmail.sender.name.split(' ')[0]},\n\nThank you for sharing this update. I have reviewed the details and noted your timeline. I will give you a call tomorrow to discuss the final allocation and next steps.\n\nBest regards,\nExecutive Office`;
      
      return {
        spokenReply: `I have drafted a professional email reply to ${targetEmail.sender.name}. It is safely staged in your drafts and will not be sent until you authorize it.`,
        intent: 'draft_email',
        confidence: 0.95,
        needsClarification: false,
        newDraft: {
          channel: 'email',
          recipientName: targetEmail.sender.name,
          recipientIdentifier: targetEmail.sender.email,
          subject: targetEmail.subject.startsWith('Re:') ? targetEmail.subject : `Re: ${targetEmail.subject}`,
          content: draftContent,
          tone: 'professional',
          replyToId: targetEmail.id
        },
        extractedDetails: {
          dates: isTomorrow ? ['Tomorrow'] : [],
          amounts: [],
          actionItems: [`Authorize and send reply to ${targetEmail.sender.name}`]
        },
        activeContextUpdate: {
          type: 'email',
          id: targetEmail.id,
          name: targetEmail.sender.name,
          title: targetEmail.subject,
          snippet: targetEmail.snippet,
          channel: 'email'
        },
        suggestedQuickReplies: ["Send this to Ahmed", "Review draft details", "Cancel"]
      };
    }
  }

  // 3. Search WhatsApp for Dubai meeting or specific chat
  if (text.includes('whatsapp') && (text.includes('dubai') || text.includes('meeting') || text.includes('rashid'))) {
    const rashidChat = whatsappChats.find((w: any) => w.id === 'wa-chat-rashid') || whatsappChats[0];
    return {
      spokenReply: "Rashid confirmed the Dubai meeting is at Emirates Towers on Wednesday at 11:00 AM. He needs passport copies by Monday.",
      intent: 'search',
      confidence: 0.98,
      needsClarification: false,
      extractedDetails: {
        dates: ['Next Wednesday at 11:00 AM', 'Monday deadline for passport copies'],
        amounts: [],
        meetingDetails: 'Dubai meeting with Ministry officials at Emirates Towers, Executive Floor 42, 11:00 AM',
        actionItems: ['Provide delegation passport copies to Rashid by Monday morning']
      },
      matchedItems: [
        {
          channel: 'whatsapp',
          id: rashidChat.id,
          title: rashidChat.name,
          snippet: 'They want to confirm the venue: Emirates Towers, 11:00 AM. Can you confirm if you will attend in person?',
          sender: rashidChat.name,
          date: 'Today, 10:24 AM'
        }
      ],
      activeContextUpdate: {
        type: 'whatsapp',
        id: rashidChat.id,
        name: rashidChat.name,
        title: 'Dubai Ministry Meeting',
        snippet: rashidChat.lastMessage,
        channel: 'whatsapp'
      },
      suggestedQuickReplies: ["Draft a reply saying I'll attend", "Send passport copies", "Check flight to Dubai"]
    };
  }

  // 4. Find Ahmed's latest email
  if (text.includes('ahmed') && (text.includes('email') || text.includes('latest') || text.includes('find'))) {
    const ahmedEmail = emails.find((e: any) => e.sender.name.toLowerCase().includes('ahmed')) || emails[0];
    return {
      spokenReply: `Ahmed sent the Q4 Strategic Deck and valuation model. The seed round is capped at $4.2M, and he requested your sign-off before 3:00 PM.`,
      intent: 'search',
      confidence: 0.99,
      needsClarification: false,
      extractedDetails: {
        dates: ['Today at 3:00 PM', 'October 12th closing'],
        amounts: ['$4,200,000 seed allocation'],
        meetingDetails: 'Board sync today at 3:00 PM to finalize $4.2M round',
        actionItems: [
          'Review slide 4 revenue multipliers in Q4 Strategic Pitch Deck',
          'Provide sign-off for Ahmed before 3:00 PM'
        ]
      },
      matchedItems: [
        {
          channel: 'email',
          id: ahmedEmail.id,
          title: ahmedEmail.subject,
          snippet: ahmedEmail.snippet,
          sender: ahmedEmail.sender.name,
          date: ahmedEmail.date
        }
      ],
      activeContextUpdate: {
        type: 'email',
        id: ahmedEmail.id,
        name: ahmedEmail.sender.name,
        title: ahmedEmail.subject,
        snippet: ahmedEmail.snippet,
        channel: 'email'
      },
      suggestedQuickReplies: [
        "Draft a reply saying I'll call tomorrow",
        "Summarize slide 4 requirements",
        "View attached valuation spreadsheet"
      ]
    };
  }

  // 5. Action items & amounts query
  if (text.includes('action item') || text.includes('amounts') || text.includes('urgent') || text.includes('pending') || text.includes('tasks')) {
    return {
      spokenReply: "You have 3 critical action items: Sign Ahmed's $4.2M model by 3 PM, provide Dubai passport copies by Monday, and execute the $185k AWS agreement by Friday.",
      intent: 'extract_action_items',
      confidence: 0.95,
      needsClarification: false,
      extractedDetails: {
        dates: ['Today 3:00 PM', 'Monday morning', 'Friday 5:00 PM', 'Oct 18th'],
        amounts: ['$4,200,000 (Seed Round)', '$250,000 (Acquisition Escrow)', '$185,000 (AWS Contract)'],
        actionItems: [
          'Review Slide 4 and sign off on Ahmed’s Q4 valuation ($4.2M) - Due 3:00 PM',
          'Submit delegation passport copies for Dubai Ministry meeting - Due Monday',
          'Sign AWS Annual Enterprise Renewal ($185k) - Due Friday',
          'Sign banking resolution for $250k escrow with Sarah - Due Thursday'
        ]
      },
      suggestedQuickReplies: ["Find Ahmed's latest email", "Check WhatsApp for Dubai meeting", "Draft reply to Sarah"]
    };
  }

  // 6. General search across Email & WhatsApp
  const queryTerms = text.split(/\s+/).filter(w => w.length > 2 && !['find', 'check', 'search', 'what', 'the', 'for', 'about'].includes(w));
  const matchedEmails: any[] = [];
  const matchedWa: any[] = [];

  for (const e of emails) {
    const hay = `${e.subject} ${e.snippet} ${e.body} ${e.sender.name} ${e.attachments.map((a: any) => a.name).join(' ')}`.toLowerCase();
    if (queryTerms.some(term => hay.includes(term))) {
      matchedEmails.push({
        channel: 'email',
        id: e.id,
        title: e.subject,
        snippet: e.snippet,
        sender: e.sender.name,
        date: e.date
      });
    }
  }

  for (const chat of whatsappChats) {
    const hay = `${chat.name} ${chat.messages.map((m: any) => m.text).join(' ')}`.toLowerCase();
    if (queryTerms.some(term => hay.includes(term))) {
      matchedWa.push({
        channel: 'whatsapp',
        id: chat.id,
        title: chat.name,
        snippet: chat.lastMessage,
        sender: chat.name,
        date: chat.lastMessageTime
      });
    }
  }

  const allMatches = [...matchedEmails, ...matchedWa];
  if (allMatches.length > 0) {
    const top = allMatches[0];
    return {
      spokenReply: `Found ${allMatches.length} matching result${allMatches.length > 1 ? 's' : ''}. Top match is from ${top.sender} regarding ${top.title}.`,
      intent: 'search',
      confidence: 0.9,
      needsClarification: false,
      matchedItems: allMatches.slice(0, 5),
      extractedDetails: { dates: [], amounts: [], actionItems: [] },
      activeContextUpdate: {
        type: top.channel,
        id: top.id,
        name: top.sender,
        title: top.title,
        snippet: top.snippet,
        channel: top.channel
      },
      suggestedQuickReplies: [`Draft a reply to ${top.sender}`, "Summarize this thread"]
    };
  }

  // 7. Clarification fallback when ambiguous
  return {
    spokenReply: `I couldn't locate specific messages matching "${command}". Would you like me to search Ahmed's emails or check WhatsApp for the Dubai meeting?`,
    intent: 'clarify',
    confidence: 0.7,
    needsClarification: true,
    clarificationQuestion: "Could you specify if you want to search Email or WhatsApp, and the person's name or keyword?",
    extractedDetails: { dates: [], amounts: [], actionItems: [] },
    suggestedQuickReplies: ["Find Ahmed's latest email", "Check WhatsApp for Dubai meeting", "List all action items"]
  };
}

// Main assistant endpoint
app.post('/api/assistant/process', async (req, res) => {
  try {
    const { 
      command, 
      activeContext, 
      conversationHistory = [], 
      emails = [], 
      whatsappChats = [], 
      pendingDrafts = [],
      targetEmail,
      targetWhatsAppNumber
    } = req.body;

    const effectiveEmails = (Array.isArray(emails) && emails.length > 0) ? emails : INITIAL_EMAILS;
    const effectiveChats = (Array.isArray(whatsappChats) && whatsappChats.length > 0) ? whatsappChats : INITIAL_WHATSAPP_CHATS;

    if (!command || typeof command !== 'string') {
      res.status(400).json({ error: 'Command string is required.' });
      return;
    }

    // If Gemini client is available, leverage gemini-3.8-flash
    if (aiClient && apiKey) {
      try {
        const systemInstruction = `
You are the AI Voice Executive Assistant for an executive.
Your job is to understand the user's voice commands and help manage Email and WhatsApp.

Capabilities:
- Search Email and WhatsApp for messages, people, keywords, dates, subjects, and attachments.
- When given an Email ID and/or WhatsApp number (or query across both), search both sources and synthesize results from both channels into a unified response.
- Summarize search results clearly and briefly.
- Draft professional emails and natural WhatsApp replies.
- Use conversation context to understand requests like "reply to him" or "find the latest message".
- Extract important information such as dates, amounts, meeting details, and action items.
- Ask for clarification when the request is ambiguous.

Strict Executive Rules:
1. NEVER invent information or search results. Use only the provided inbox data.
2. Keep voice responses short and natural (1 to 2 crisp spoken sentences maximum suitable for text-to-speech voice audio).
3. "Draft = never send." Mark any creation of an outgoing message as intent "draft_email" or "draft_whatsapp". Never trigger sending automatically.
4. "Send = only when the user explicitly authorizes sending." If the user says "Send this to Ahmed" or "Send it":
   - If there is an existing draft, set intent to "request_send_authorization" or "confirm_send" if already confirmed.
   - If there is ambiguity or no draft exists, ask for clarification.
5. Tone: Professional and concise for business email; natural, friendly, and conversational for WhatsApp.
6. Return structured JSON conforming to the requested schema.
`;

        const promptContext = `
CURRENT TIME: 2026-10-04T09:30:00Z
ACTIVE USER FOCUS CONTEXT: ${JSON.stringify(activeContext || null)}
TARGET EMAIL ID OPTION: ${targetEmail || 'Not specified'}
TARGET WHATSAPP NUMBER OPTION: ${targetWhatsAppNumber || 'Not specified'}
RECENT CONVERSATION TURNS: ${JSON.stringify(conversationHistory.slice(-4))}

AVAILABLE EMAILS IN INBOX:
${JSON.stringify(effectiveEmails.map((e: any) => ({
  id: e.id,
  sender: e.sender.name,
  senderEmail: e.sender.email,
  recipients: e.recipients,
  subject: e.subject,
  date: e.date,
  snippet: e.snippet,
  body: e.body,
  attachments: e.attachments,
  extractedMetadata: e.extractedMetadata
})))}

AVAILABLE WHATSAPP CHATS:
${JSON.stringify(effectiveChats.map((w: any) => ({
  id: w.id,
  name: w.name,
  phone: w.phone,
  role: w.role,
  lastMessage: w.lastMessage,
  lastMessageTime: w.lastMessageTime,
  messages: w.messages
})))}

CURRENT PENDING DRAFTS (NOT SENT):
${JSON.stringify(pendingDrafts)}

USER VOICE COMMAND: "${command}"
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContext,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                spokenReply: {
                  type: 'string',
                  description: 'Short, natural, 1-2 sentence spoken reply for voice TTS.'
                },
                intent: {
                  type: 'string',
                  enum: [
                    'search',
                    'summarize',
                    'draft_email',
                    'draft_whatsapp',
                    'request_send_authorization',
                    'confirm_send',
                    'extract_action_items',
                    'clarify',
                    'general'
                  ]
                },
                confidence: { type: 'number' },
                needsClarification: { type: 'boolean' },
                clarificationQuestion: { type: 'string' },
                crossChannelSummary: {
                  type: 'object',
                  properties: {
                    emailCount: { type: 'number' },
                    whatsappCount: { type: 'number' },
                    matchedEmailId: { type: 'string' },
                    matchedWhatsAppId: { type: 'string' },
                    keyTakeaway: { type: 'string' }
                  }
                },
                extractedDetails: {
                  type: 'object',
                  properties: {
                    dates: { type: 'array', items: { type: 'string' } },
                    amounts: { type: 'array', items: { type: 'string' } },
                    meetingDetails: { type: 'string' },
                    actionItems: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['dates', 'amounts', 'actionItems']
                },
                matchedItems: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      channel: { type: 'string', enum: ['email', 'whatsapp'] },
                      id: { type: 'string' },
                      title: { type: 'string' },
                      snippet: { type: 'string' },
                      sender: { type: 'string' },
                      date: { type: 'string' }
                    },
                    required: ['channel', 'id', 'title', 'snippet', 'sender', 'date']
                  }
                },
                newDraft: {
                  type: 'object',
                  properties: {
                    channel: { type: 'string', enum: ['email', 'whatsapp'] },
                    recipientName: { type: 'string' },
                    recipientIdentifier: { type: 'string' },
                    subject: { type: 'string' },
                    content: { type: 'string' },
                    tone: { type: 'string', enum: ['professional', 'conversational'] },
                    replyToId: { type: 'string' }
                  },
                  required: ['channel', 'recipientName', 'recipientIdentifier', 'content', 'tone']
                },
                sendDraftId: { type: 'string' },
                suggestedQuickReplies: {
                  type: 'array',
                  items: { type: 'string' }
                },
                activeContextUpdate: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['email', 'whatsapp', 'draft', 'none'] },
                    id: { type: 'string' },
                    name: { type: 'string' },
                    title: { type: 'string' },
                    snippet: { type: 'string' },
                    channel: { type: 'string', enum: ['email', 'whatsapp'] }
                  }
                }
              },
              required: ['spokenReply', 'intent', 'confidence', 'needsClarification', 'extractedDetails']
            }
          }
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          res.json(parsed);
          return;
        }
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to local executive processor:', geminiError?.message || geminiError);
      }
    }

    // Fallback parser if Gemini call wasn't made or threw an error
    const fallbackResult = fallbackAssistantProcessor(
      command, 
      activeContext, 
      effectiveEmails, 
      effectiveChats, 
      pendingDrafts,
      targetEmail,
      targetWhatsAppNumber
    );
    res.json(fallbackResult);
  } catch (error: any) {
    console.error('Error in /api/assistant/process:', error);
    res.status(500).json({ error: 'Failed to process voice command.' });
  }
});

// Production vs Development serving
if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Mount Vite middlewares in development
  import('vite').then(async ({ createServer }) => {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`Vite middleware mounted on port ${PORT}`);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Apex AI Voice Executive Assistant running on http://0.0.0.0:${PORT}`);
});
