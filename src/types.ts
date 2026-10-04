export interface EmailAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'spreadsheet' | 'deck' | 'document' | 'image';
}

export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    title: string;
    avatar?: string;
  };
  recipients: {
    name: string;
    email: string;
  }[];
  subject: string;
  snippet: string;
  body: string;
  date: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts';
  attachments: EmailAttachment[];
  extractedMetadata?: {
    dates?: string[];
    amounts?: string[];
    meetingDetails?: string;
    actionItems?: { text: string; urgent: boolean; deadline?: string }[];
  };
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: 'user' | 'contact';
  senderName: string;
  senderPhone: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'audio' | 'location';
  }[];
}

export interface WhatsAppChat {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: WhatsAppMessage[];
}

export interface DraftMessage {
  id: string;
  channel: 'email' | 'whatsapp';
  recipient: {
    name: string;
    identifier: string; // email or phone
    avatar?: string;
  };
  subject?: string; // only for email
  content: string;
  replyToId?: string;
  replyToSnippet?: string;
  tone: 'professional' | 'conversational';
  status: 'draft' | 'awaiting_confirmation' | 'sent';
  createdAt: string;
  authorizedAt?: string;
}

export interface ActiveContext {
  type: 'email' | 'whatsapp' | 'draft' | 'none';
  id?: string;
  name?: string;
  title?: string;
  snippet?: string;
  channel?: 'email' | 'whatsapp';
}

export interface ExtractedInfo {
  dates: string[];
  amounts: string[];
  meetingDetails?: string;
  actionItems: string[];
}

export interface UserAccountConfig {
  email: string;
  whatsappNumber: string;
  displayName: string;
  isConfigured: boolean;
}

export interface LinkedContact {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  role?: string;
  avatar?: string;
}

export interface AssistantResponse {
  spokenReply: string;
  intent: 
    | 'search' 
    | 'summarize' 
    | 'draft_email' 
    | 'draft_whatsapp' 
    | 'request_send_authorization' 
    | 'confirm_send' 
    | 'extract_action_items' 
    | 'clarify' 
    | 'general';
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion?: string;
  extractedDetails?: ExtractedInfo;
  crossChannelSummary?: {
    emailCount: number;
    whatsappCount: number;
    matchedEmailId?: string;
    matchedWhatsAppId?: string;
    keyTakeaway?: string;
  };
  matchedItems?: {
    channel: 'email' | 'whatsapp';
    id: string;
    title: string;
    snippet: string;
    sender: string;
    date: string;
    score?: number;
  }[];
  newDraft?: {
    channel: 'email' | 'whatsapp';
    recipientName: string;
    recipientIdentifier: string;
    subject?: string;
    content: string;
    tone: 'professional' | 'conversational';
    replyToId?: string;
  };
  sendDraftId?: string;
  suggestedQuickReplies?: string[];
  activeContextUpdate?: ActiveContext;
}

export interface VoiceAssistantLog {
  id: string;
  timestamp: string;
  command: string;
  spokenReply: string;
  intent: string;
  success: boolean;
  contextTitle?: string;
}
