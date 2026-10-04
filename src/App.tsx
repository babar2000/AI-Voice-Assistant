import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { UnifiedExecutiveView } from './components/UnifiedExecutiveView';
import { EmailClient } from './components/EmailClient';
import { WhatsAppClient } from './components/WhatsAppClient';
import { StagedDraftsView } from './components/StagedDraftsView';
import { DraftVerificationModal } from './components/DraftVerificationModal';
import { ChannelConfigModal } from './components/ChannelConfigModal';
import { AddEmailModal } from './components/AddEmailModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { processVoiceCommand } from './services/assistantApi';
import { playSuccessChime, playAlertChime } from './utils/audioChime';
import { 
  Email, 
  WhatsAppChat, 
  DraftMessage, 
  ActiveContext, 
  AssistantResponse,
  VoiceAssistantLog,
  UserAccountConfig,
  LinkedContact
} from './types';
import { 
  INITIAL_EMAILS, 
  INITIAL_WHATSAPP_CHATS, 
  INITIAL_DRAFTS,
  INITIAL_USER_ACCOUNT,
  INITIAL_LINKED_CONTACTS
} from './data/initialData';

export default function App() {
  // Database States
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [whatsappChats, setWhatsappChats] = useState<WhatsAppChat[]>(INITIAL_WHATSAPP_CHATS);
  const [drafts, setDrafts] = useState<DraftMessage[]>(INITIAL_DRAFTS);

  // Dual-Channel User Account & Linked Contacts Configuration
  const [userAccount, setUserAccount] = useState<UserAccountConfig>(INITIAL_USER_ACCOUNT);
  const [linkedContacts, setLinkedContacts] = useState<LinkedContact[]>(INITIAL_LINKED_CONTACTS);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);

  // Navigation & Selection States
  const [activeTab, setActiveTab] = useState<'unified' | 'email' | 'whatsapp' | 'drafts'>('unified');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(INITIAL_EMAILS[0]);
  const [selectedWhatsAppChat, setSelectedWhatsAppChat] = useState<WhatsAppChat | null>(INITIAL_WHATSAPP_CHATS[0]);

  // Context & Assistant States
  const [activeContext, setActiveContext] = useState<ActiveContext>({
    type: 'email',
    id: INITIAL_EMAILS[0].id,
    name: INITIAL_EMAILS[0].sender.name,
    title: INITIAL_EMAILS[0].subject,
    snippet: INITIAL_EMAILS[0].snippet,
    channel: 'email',
  });

  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationModalDraft, setVerificationModalDraft] = useState<DraftMessage | null>(null);

  // Voice synthesis & recognition hooks
  const { speak, stopSpeaking, isSpeaking, isMuted, toggleMute } = useSpeechSynthesis();

  // Voice Recognition Handler
  const handleVoiceInputFinal = useCallback((transcriptText: string) => {
    if (transcriptText.trim()) {
      handleExecuteCommand(transcriptText.trim());
    }
  }, []);

  const {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    toggleListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleVoiceInputFinal,
    continuous: false,
  });

  // Execute Voice Command (with optional explicit target email and whatsapp number)
  const handleExecuteCommand = async (
    command: string, 
    targetEmail?: string, 
    targetWhatsAppNumber?: string
  ) => {
    setIsProcessing(true);
    stopSpeaking();

    // Optimistically update conversation history
    setConversationHistory((prev) => [...prev, { role: 'user', text: command }]);

    try {
      const response: AssistantResponse = await processVoiceCommand(
        command,
        activeContext,
        conversationHistory,
        emails,
        whatsappChats,
        drafts,
        targetEmail || userAccount.email,
        targetWhatsAppNumber || userAccount.whatsappNumber
      );

      setLastResponse(response);
      setConversationHistory((prev) => [...prev, { role: 'assistant', text: response.spokenReply }]);

      // Vocalize response
      speak(response.spokenReply);

      // Handle Context Update
      if (response.activeContextUpdate) {
        setActiveContext(response.activeContextUpdate);
      }

      // 1. Matched Search Items -> switch context and view
      if (response.matchedItems && response.matchedItems.length > 0) {
        const topMatch = response.matchedItems[0];
        if (topMatch.channel === 'email') {
          const matchedEmail = emails.find((e) => e.id === topMatch.id);
          if (matchedEmail) {
            setSelectedEmail(matchedEmail);
            setActiveContext({
              type: 'email',
              id: matchedEmail.id,
              name: matchedEmail.sender.name,
              title: matchedEmail.subject,
              snippet: matchedEmail.snippet,
              channel: 'email',
            });
          }
        } else if (topMatch.channel === 'whatsapp') {
          const matchedChat = whatsappChats.find((w) => w.id === topMatch.id);
          if (matchedChat) {
            setSelectedWhatsAppChat(matchedChat);
            setActiveContext({
              type: 'whatsapp',
              id: matchedChat.id,
              name: matchedChat.name,
              title: 'WhatsApp conversation',
              snippet: matchedChat.lastMessage,
              channel: 'whatsapp',
            });
          }
        }
      }

      // 2. Draft Creation -> STRICT RULE: "Draft = never send"
      if (response.newDraft) {
        const newDraftItem: DraftMessage = {
          id: `draft-${Date.now()}`,
          channel: response.newDraft.channel,
          recipient: {
            name: response.newDraft.recipientName,
            identifier: response.newDraft.recipientIdentifier,
          },
          subject: response.newDraft.subject,
          content: response.newDraft.content,
          replyToId: response.newDraft.replyToId,
          tone: response.newDraft.tone,
          status: 'draft',
          createdAt: 'Just now',
        };

        setDrafts((prev) => [newDraftItem, ...prev]);
        setActiveTab('drafts');
        playSuccessChime();
      }

      // 3. Request Authorization / Send Inquiry
      if (response.intent === 'request_send_authorization' && response.sendDraftId) {
        const targetDraft = drafts.find((d) => d.id === response.sendDraftId) || drafts[0];
        if (targetDraft) {
          setVerificationModalDraft(targetDraft);
          playAlertChime();
        }
      }

      // 4. Confirm Send -> STRICT RULE: Only when user explicitly authorizes
      if (response.intent === 'confirm_send' && response.sendDraftId) {
        handleFinalSendAuthorization(response.sendDraftId);
      }
    } catch (err) {
      console.error('Command execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Dual Channel query trigger (scans both Email and WhatsApp)
  const handleDualChannelQuery = (targetEmail: string, targetWhatsAppNumber: string, name?: string) => {
    const label = name ? name : targetEmail || targetWhatsAppNumber;
    const command = `Search both Email ${targetEmail ? `(${targetEmail})` : ''} and WhatsApp ${targetWhatsAppNumber ? `(${targetWhatsAppNumber})` : ''} for ${label} and synthesize all accurate results.`;
    handleExecuteCommand(command, targetEmail, targetWhatsAppNumber);
    setActiveTab('unified');
  };

  const handleAddEmail = (newEmail: Email) => {
    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmail(newEmail);
    setActiveContext({
      type: 'email',
      id: newEmail.id,
      name: newEmail.sender.name,
      title: newEmail.subject,
      snippet: newEmail.snippet,
      channel: 'email',
    });
    playSuccessChime();
  };

  // Final sending execution (moves from Draft to Sent and appends to thread)
  const handleFinalSendAuthorization = (draftId: string, updatedContent?: string) => {
    const draftIndex = drafts.findIndex((d) => d.id === draftId);
    if (draftIndex === -1) return;

    const draft = drafts[draftIndex];
    const finalContent = updatedContent || draft.content;

    // 1. Mark draft as sent
    const updatedDraft: DraftMessage = {
      ...draft,
      content: finalContent,
      status: 'sent',
      authorizedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newDrafts = [...drafts];
    newDrafts[draftIndex] = updatedDraft;
    setDrafts(newDrafts);

    // 2. Transmit to Channel
    if (draft.channel === 'email') {
      const sentEmail: Email = {
        id: `sent-em-${Date.now()}`,
        sender: {
          name: 'You (CEO)',
          email: 'executive@nexuscorp.com',
          title: 'Chief Executive Officer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: draft.recipient.name, email: draft.recipient.identifier }],
        subject: draft.subject || 'Follow-up',
        snippet: finalContent.slice(0, 100) + '...',
        body: finalContent,
        date: 'Just now',
        timestamp: new Date().toISOString(),
        unread: false,
        starred: false,
        folder: 'sent',
        attachments: [],
      };
      setEmails((prev) => [sentEmail, ...prev]);
    } else {
      // WhatsApp transmission
      setWhatsappChats((prev) =>
        prev.map((chat) => {
          if (chat.id === draft.replyToId || chat.name.includes(draft.recipient.name)) {
            const newMsg = {
              id: `msg-wa-${Date.now()}`,
              chatId: chat.id,
              sender: 'user' as const,
              senderName: 'You',
              senderPhone: '+1 415 000 1122',
              text: finalContent,
              timestamp: 'Just now',
              status: 'sent' as const,
            };
            return {
              ...chat,
              lastMessage: finalContent,
              lastMessageTime: 'Just now',
              messages: [...chat.messages, newMsg],
            };
          }
          return chat;
        })
      );
    }

    setVerificationModalDraft(null);
    playSuccessChime();
    speak(`Authorized and sent to ${draft.recipient.name}.`);
  };

  const handleDiscardDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    setVerificationModalDraft(null);
  };

  // Replay Assistant Voice Audio
  const handleReplaySpeech = () => {
    if (lastResponse?.spokenReply) {
      speak(lastResponse.spokenReply);
    }
  };

  // Quick Action Triggers
  const handleSelectEmail = (email: Email | null) => {
    setSelectedEmail(email);
    if (email) {
      setActiveContext({
        type: 'email',
        id: email.id,
        name: email.sender.name,
        title: email.subject,
        snippet: email.snippet,
        channel: 'email',
      });
    }
  };

  const handleSelectWhatsApp = (chat: WhatsAppChat | null) => {
    setSelectedWhatsAppChat(chat);
    if (chat) {
      setActiveContext({
        type: 'whatsapp',
        id: chat.id,
        name: chat.name,
        title: 'WhatsApp Chat',
        snippet: chat.lastMessage,
        channel: 'whatsapp',
      });
    }
  };

  const handleDraftCommandFromView = (targetName: string, channel: 'email' | 'whatsapp') => {
    handleExecuteCommand(`Draft a reply to ${targetName} on ${channel}`);
  };

  const handleSendTextMessage = (chatId: string, text: string) => {
    setWhatsappChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const newMsg = {
            id: `msg-wa-${Date.now()}`,
            chatId: chat.id,
            sender: 'user' as const,
            senderName: 'You',
            senderPhone: '+1 415 000 1122',
            text,
            timestamp: 'Just now',
            status: 'sent' as const,
          };
          return {
            ...chat,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );
  };

  const unreadEmailCount = emails.filter((e) => e.unread).length;
  const unreadWaCount = whatsappChats.reduce((sum, c) => sum + c.unreadCount, 0);
  const pendingDraftsCount = drafts.filter((d) => d.status !== 'sent').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeContext={activeContext}
        userAccount={userAccount}
        onOpenChannelConfig={() => setIsChannelModalOpen(true)}
        pendingDraftsCount={pendingDraftsCount}
        unreadEmailCount={unreadEmailCount}
        unreadWaCount={unreadWaCount}
        isListening={isListening}
        isSpeaking={isSpeaking}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onMicClick={toggleListening}
      />

      {/* Voice Assistant HUD Bar */}
      <VoiceAssistantBar
        isListening={isListening}
        transcript={transcript}
        interimTranscript={interimTranscript}
        audioLevel={audioLevel}
        isSpeaking={isSpeaking}
        isProcessing={isProcessing}
        lastResponse={lastResponse}
        activeContext={activeContext}
        onToggleListening={toggleListening}
        onSubmitCommand={handleExecuteCommand}
        onReplaySpeech={handleReplaySpeech}
      />

      {/* Main Channel Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'unified' && (
          <UnifiedExecutiveView
            emails={emails}
            whatsappChats={whatsappChats}
            pendingDrafts={drafts.filter((d) => d.status !== 'sent')}
            activeContext={activeContext}
            userAccount={userAccount}
            onOpenChannelConfig={() => setIsChannelModalOpen(true)}
            onSelectEmail={(e) => {
              handleSelectEmail(e);
              setActiveTab('email');
            }}
            onSelectWhatsApp={(c) => {
              handleSelectWhatsApp(c);
              setActiveTab('whatsapp');
            }}
            onTriggerDraftCommand={handleDraftCommandFromView}
            onOpenDraftAuthorization={(d) => setVerificationModalDraft(d)}
            onVoiceCommand={handleExecuteCommand}
          />
        )}

        {activeTab === 'email' && (
          <EmailClient
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
            activeContext={activeContext}
            onOpenAddEmail={() => setIsAddEmailModalOpen(true)}
            onDraftReplyVoice={(email) => {
              handleExecuteCommand(`Draft a reply to ${email.sender.name} saying I'll review and call tomorrow.`);
            }}
            onToggleStar={(id) => {
              setEmails((prev) =>
                prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
              );
            }}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppClient
            chats={whatsappChats}
            selectedChat={selectedWhatsAppChat}
            onSelectChat={handleSelectWhatsApp}
            activeContext={activeContext}
            onVoiceDraftReply={(chat) => {
              handleExecuteCommand(`Draft a WhatsApp reply to ${chat.name}`);
            }}
            onSendTextMessage={handleSendTextMessage}
          />
        )}

        {activeTab === 'drafts' && (
          <StagedDraftsView
            drafts={drafts}
            onOpenAuthorization={(draft) => setVerificationModalDraft(draft)}
            onDiscardDraft={handleDiscardDraft}
            onConfirmSend={(draftId) => handleFinalSendAuthorization(draftId)}
          />
        )}
      </main>

      {/* Draft Authorization & Verification Modal */}
      {verificationModalDraft && (
        <DraftVerificationModal
          draft={verificationModalDraft}
          isOpen={Boolean(verificationModalDraft)}
          onClose={() => setVerificationModalDraft(null)}
          onConfirmSend={handleFinalSendAuthorization}
          onDiscardDraft={handleDiscardDraft}
        />
      )}

      {/* Channel Configuration & Dual-Routing Modal */}
      <ChannelConfigModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        userAccount={userAccount}
        linkedContacts={linkedContacts}
        onSaveUserAccount={(updated) => setUserAccount(updated)}
        onAddLinkedContact={(contact) => setLinkedContacts((prev) => [...prev, contact])}
        onDeleteLinkedContact={(id) => setLinkedContacts((prev) => prev.filter((c) => c.id !== id))}
        onDualChannelQuery={handleDualChannelQuery}
      />

      {/* Add Email to Inbox Modal */}
      <AddEmailModal
        isOpen={isAddEmailModalOpen}
        onClose={() => setIsAddEmailModalOpen(false)}
        userEmail={userAccount.email}
        onAddEmail={handleAddEmail}
      />

    </div>
  );
}
