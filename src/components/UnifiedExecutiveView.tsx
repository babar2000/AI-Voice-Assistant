import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Paperclip, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle,
  Search,
  Sparkles,
  ExternalLink,
  Send,
  UserCheck
} from 'lucide-react';
import { Email, WhatsAppChat, DraftMessage, ActiveContext, UserAccountConfig } from '../types';

interface UnifiedExecutiveViewProps {
  emails: Email[];
  whatsappChats: WhatsAppChat[];
  pendingDrafts: DraftMessage[];
  activeContext: ActiveContext;
  userAccount: UserAccountConfig;
  onOpenChannelConfig: () => void;
  onSelectEmail: (email: Email) => void;
  onSelectWhatsApp: (chat: WhatsAppChat) => void;
  onTriggerDraftCommand: (targetName: string, channel: 'email' | 'whatsapp') => void;
  onOpenDraftAuthorization: (draft: DraftMessage) => void;
  onVoiceCommand: (cmd: string) => void;
}

export const UnifiedExecutiveView: React.FC<UnifiedExecutiveViewProps> = ({
  emails,
  whatsappChats,
  pendingDrafts,
  activeContext,
  userAccount,
  onOpenChannelConfig,
  onSelectEmail,
  onSelectWhatsApp,
  onTriggerDraftCommand,
  onOpenDraftAuthorization,
  onVoiceCommand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'emails' | 'whatsapp' | 'attachments'>('all');

  // Filter cross-channel items
  const filteredEmails = emails.filter((e) => {
    if (filterType === 'whatsapp') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hasAttach = e.attachments.some(a => a.name.toLowerCase().includes(q));
    return (
      e.subject.toLowerCase().includes(q) ||
      e.sender.name.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q) ||
      hasAttach
    );
  });

  const filteredWaChats = whatsappChats.filter((chat) => {
    if (filterType === 'emails') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(q) ||
      chat.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Rules & Assistant Guarantee */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Executive Assistant Safety Guarantee
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
                Draft = Never Send • Human in the Loop
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              The AI drafts replies in your voice but will <strong className="text-slate-200">never transmit</strong> any email or WhatsApp message without explicit authorization.
            </p>
          </div>
        </div>

        {pendingDrafts.length > 0 && (
          <button
            onClick={() => onOpenDraftAuthorization(pendingDrafts[0])}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Review {pendingDrafts.length} Staged Draft{pendingDrafts.length > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* Dual-Channel Active Configuration Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">
                Dual-Channel Multi-Routing Active
              </h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                Email + WhatsApp
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1.5 text-amber-300 font-mono">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {userAccount.email}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                {userAccount.whatsappNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onVoiceCommand(`Search both Email ${userAccount.email} and WhatsApp ${userAccount.whatsappNumber} for urgent updates.`)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            🎙️ Query Both Accounts
          </button>

          <button
            onClick={onOpenChannelConfig}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition-all"
          >
            Configure Channels
          </button>
        </div>
      </div>

      {/* High-Level Intelligence Matrix: Action Items & Financial Sums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Urgent Action Items */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Urgent Action Items
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                4 Required
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>
                  <strong>Ahmed Al-Mansoori:</strong> Sign off on slide 4 valuation multipliers before 3:00 PM today.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>
                  <strong>Rashid (Dubai Lead):</strong> Submit delegation passport copies by Monday morning for high-security badges.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>
                  <strong>David Keller:</strong> DocuSign AWS annual contract renewal ($185k) before Friday.
                </span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onVoiceCommand("What are my pending action items and amounts?")}
            className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
          >
            <span>🎙️ Ask assistant to summarize pending items</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Financial Commitments & Amounts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Extracted Amounts & Capital
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                Active
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-100">$4,200,000</div>
                  <div className="text-[11px] text-slate-400">Gulf Seed Round (Ahmed Al-Mansoori)</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Email</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-100">$250,000</div>
                  <div className="text-[11px] text-slate-400">Escrow Transfer (Sarah Jenkins CFO)</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Cleared</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-100">$185,000</div>
                  <div className="text-[11px] text-slate-400">AWS Infrastructure Renewal (David Keller)</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Pending</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Tracked: $4,635,000</span>
            <span className="text-emerald-400 font-medium">Audited</span>
          </div>
        </div>

        {/* Key Dates & Meetings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Meetings & Timeline
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
                Confirmed
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center justify-between font-medium text-slate-100">
                  <span>Dubai Ministry Meeting</span>
                  <span className="text-teal-400">Next Wed, 11:00 AM</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Venue: Emirates Towers, Floor 42 (via Rashid WhatsApp)
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center justify-between font-medium text-slate-100">
                  <span>Dinner at Zuma DIFC</span>
                  <span className="text-teal-400">Next Tue, 8:00 PM</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Host: Ahmed Al-Mansoori (via Email)
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center justify-between font-medium text-slate-100">
                  <span>Emirates Flight EK204</span>
                  <span className="text-teal-400">Oct 14, 10:40 AM</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  JFK to DXB (via Amira Operations)
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onVoiceCommand("Check WhatsApp for the Dubai meeting")}
            className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
          >
            <span>🎙️ Query Dubai meeting details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Cross-Channel Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across Email & WhatsApp by person ('Ahmed'), keyword ('Dubai meeting'), attachment, or date..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Channels ({filteredEmails.length + filteredWaChats.length})
            </button>
            <button
              onClick={() => setFilterType('emails')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'emails'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Emails ({filteredEmails.length})
            </button>
            <button
              onClick={() => setFilterType('whatsapp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'whatsapp'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp ({filteredWaChats.length})
            </button>
          </div>
        </div>
      </div>

      {/* Dual Channel Split Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Email Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              Recent Executive Emails
            </h4>
            <span className="text-xs text-slate-400">{filteredEmails.length} messages</span>
          </div>

          <div className="space-y-3">
            {filteredEmails.map((email) => {
              const isActive = activeContext.type === 'email' && activeContext.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    isActive
                      ? 'bg-slate-800/95 border-teal-500/80 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={email.sender.avatar}
                        alt={email.sender.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-100">
                            {email.sender.name}
                          </span>
                          {email.unread && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{email.sender.title}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {email.date}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {email.subject}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {email.snippet}
                    </p>
                  </div>

                  {/* Attachments & Meta */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {email.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                        >
                          <Paperclip className="w-3 h-3 text-teal-400" />
                          {att.name}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerDraftCommand(email.sender.name, 'email');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[11px] font-medium transition-colors shrink-0"
                    >
                      Draft Reply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp Conversations
            </h4>
            <span className="text-xs text-slate-400">{filteredWaChats.length} active threads</span>
          </div>

          <div className="space-y-3">
            {filteredWaChats.map((chat) => {
              const isActive = activeContext.type === 'whatsapp' && activeContext.id === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectWhatsApp(chat)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    isActive
                      ? 'bg-slate-800/95 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-100">
                            {chat.name}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{chat.role}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      "{chat.lastMessage}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {chat.phone}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerDraftCommand(chat.name, 'whatsapp');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-medium transition-colors shrink-0"
                    >
                      Draft WhatsApp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
