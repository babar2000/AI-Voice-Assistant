import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  CheckCheck, 
  Mic, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { WhatsAppChat, ActiveContext } from '../types';

interface WhatsAppClientProps {
  chats: WhatsAppChat[];
  selectedChat: WhatsAppChat | null;
  onSelectChat: (chat: WhatsAppChat) => void;
  activeContext: ActiveContext;
  onVoiceDraftReply: (chat: WhatsAppChat) => void;
  onSendTextMessage: (chatId: string, text: string) => void;
}

export const WhatsAppClient: React.FC<WhatsAppClientProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  activeContext,
  onVoiceDraftReply,
  onSendTextMessage,
}) => {
  const [search, setSearch] = useState('');
  const [manualText, setManualText] = useState('');

  const filteredChats = chats.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleManualSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || !selectedChat) return;
    onSendTextMessage(selectedChat.id, manualText.trim());
    setManualText('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[750px]">
      
      {/* Left Column: Chat List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-950/60 shrink-0`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-100">WhatsApp Web</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
            Connected
          </span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or start new chat..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;
            const isContextActive = activeContext.type === 'whatsapp' && activeContext.id === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`p-3.5 cursor-pointer flex items-start gap-3 transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-4 border-l-emerald-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-slate-100 truncate">
                      {chat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mt-1">
                    {chat.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-500 font-mono truncate">
                      {chat.phone}
                    </span>
                    {chat.unreadCount > 0 ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold">
                        {chat.unreadCount}
                      </span>
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat View */}
      <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-900`}>
        {selectedChat ? (
          <div className="flex-1 flex flex-col h-full">
            
            {/* Chat Top Bar */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectChat(null as any)}
                  className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                />
                <div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-100">
                    {selectedChat.name}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • {selectedChat.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVoiceDraftReply(selectedChat)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Draft WhatsApp Reply</span>
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
              
              {/* Security Banner */}
              <div className="text-center my-2">
                <span className="inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Messages end-to-end encrypted • Voice EA safe mode active
                </span>
              </div>

              {selectedChat.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-tr-none shadow-md shadow-emerald-900/20'
                          : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/70'
                      }`}
                    >
                      {!isUser && (
                        <div className="text-[10px] font-semibold text-emerald-400 mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1.5">
                          {msg.attachments.map((att, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                <span className="font-medium text-slate-200">{att.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{att.size}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-300 opacity-80">
                        <span>{msg.timestamp}</span>
                        {isUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleManualSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onVoiceDraftReply(selectedChat)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Voice Dictate"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
              </button>

              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Type a message or use voice assistant to draft..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!manualText.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Chat Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select a WhatsApp conversation or speak: "Check WhatsApp for the Dubai meeting"
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
