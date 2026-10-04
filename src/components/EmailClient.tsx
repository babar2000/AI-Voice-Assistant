import React, { useState } from 'react';
import { 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  Paperclip, 
  Clock, 
  Search, 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Download,
  AlertCircle,
  Calendar,
  DollarSign,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { Email, ActiveContext } from '../types';

interface EmailClientProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  activeContext: ActiveContext;
  onDraftReplyVoice: (email: Email) => void;
  onToggleStar: (id: string) => void;
  onOpenAddEmail?: () => void;
}

export const EmailClient: React.FC<EmailClientProps> = ({
  emails,
  selectedEmail,
  onSelectEmail,
  activeContext,
  onDraftReplyVoice,
  onToggleStar,
  onOpenAddEmail,
}) => {
  const [folder, setFolder] = useState<'inbox' | 'starred' | 'sent'>('inbox');
  const [search, setSearch] = useState('');

  const filteredEmails = emails.filter((e) => {
    if (folder === 'starred' && !e.starred) return false;
    if (folder === 'sent' && e.folder !== 'sent') return false;
    if (folder === 'inbox' && e.folder !== 'inbox') return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.sender.name.toLowerCase().includes(q) ||
      e.snippet.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[750px]">
      
      {/* Sidebar Folders */}
      <div className="w-full md:w-56 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col justify-between shrink-0">
        <div className="space-y-1 w-full flex md:flex-col gap-1 overflow-x-auto">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:flex">
            <span>Mailboxes</span>
            {onOpenAddEmail && (
              <button
                onClick={onOpenAddEmail}
                className="text-[10px] text-teal-400 hover:text-teal-300 font-medium normal-case flex items-center gap-1 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20"
                title="Add an email to your inbox"
              >
                + Add Email
              </button>
            )}
          </div>
          
          <button
            onClick={() => setFolder('inbox')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              folder === 'inbox'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4 text-amber-400" />
              Inbox
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {emails.filter(e => e.folder === 'inbox').length}
            </span>
          </button>

          <button
            onClick={() => setFolder('starred')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              folder === 'starred'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              Starred
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {emails.filter(e => e.starred).length}
            </span>
          </button>

          <button
            onClick={() => setFolder('sent')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              folder === 'sent'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Send className="w-4 h-4 text-cyan-400" />
              Sent
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {emails.filter(e => e.folder === 'sent').length}
            </span>
          </button>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 hidden md:block">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-teal-400" />
            Voice Navigation
          </div>
          Try saying: <br />
          <span className="text-teal-300 font-medium">"Find Ahmed's latest email"</span>
        </div>
      </div>

      {/* Middle Pane: Email List */}
      <div className={`${selectedEmail ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 border-r border-slate-800 bg-slate-900/60`}>
        {/* Search & Add */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          {onOpenAddEmail && (
            <button
              onClick={onOpenAddEmail}
              className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1 shrink-0 shadow-sm"
              title="Add or paste an email"
            >
              <span>+ Add</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredEmails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            const isContextActive = activeContext.type === 'email' && activeContext.id === email.id;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-4 border-l-teal-400'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email.id);
                      }}
                      className="text-slate-500 hover:text-amber-400"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          email.starred ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                    <span className="font-semibold text-xs text-slate-100 truncate max-w-[140px]">
                      {email.sender.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{email.date}</span>
                </div>

                <div className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">
                  {email.subject}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {email.snippet}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {email.attachments.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      <Paperclip className="w-3 h-3 text-teal-400" />
                      {email.attachments.length} file{email.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {isContextActive && (
                    <span className="text-[10px] text-teal-300 font-mono px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                      Active Context
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Reading Pane */}
      <div className={`${!selectedEmail ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-slate-900`}>
        {selectedEmail ? (
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            {/* Thread Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => onSelectEmail(null as any)}
                  className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100">
                    {selectedEmail.subject}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDraftReplyVoice(selectedEmail)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/20 transition-all"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Reply</span>
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedEmail.sender.avatar}
                    alt={selectedEmail.sender.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <div className="font-semibold text-sm text-slate-200">
                      {selectedEmail.sender.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      &lt;{selectedEmail.sender.email}&gt;
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>{selectedEmail.date}</div>
                  <div className="text-[11px] text-teal-400">To: You (CEO)</div>
                </div>
              </div>
            </div>

            {/* AI Extracted Executive Summary Box */}
            {selectedEmail.extractedMetadata && (
              <div className="m-4 sm:m-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Assistant Extracted Intelligence
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono">
                    Ready for Voice Action
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedEmail.extractedMetadata.amounts && selectedEmail.extractedMetadata.amounts.length > 0 && (
                    <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Amounts Mentioned</div>
                        <div className="font-semibold text-slate-200">
                          {selectedEmail.extractedMetadata.amounts.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEmail.extractedMetadata.meetingDetails && (
                    <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Meeting Timeline</div>
                        <div className="font-semibold text-slate-200">
                          {selectedEmail.extractedMetadata.meetingDetails}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedEmail.extractedMetadata.actionItems && (
                  <div className="pt-2 border-t border-slate-700/60">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                      Required Action Items:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedEmail.extractedMetadata.actionItems.map((act, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{act.text}</span>
                          {act.deadline && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 ml-auto">
                              {act.deadline}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Email Body */}
            <div className="p-4 sm:p-6 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans flex-1">
              {selectedEmail.body}
            </div>

            {/* Attachments Section */}
            {selectedEmail.attachments.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/40">
                <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-teal-400" />
                  Attachments ({selectedEmail.attachments.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEmail.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between hover:border-teal-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-200 truncate">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{file.size}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading verified document: ${file.name}`)}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-teal-600 text-slate-300 hover:text-white transition-colors"
                        title="Download attachment"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Inbox className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Email Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select an email from the list or speak a voice command like "Find Ahmed's latest email" to open directly.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
