import React from 'react';
import { 
  ShieldCheck, 
  Send, 
  Trash2, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  FileCheck,
  User
} from 'lucide-react';
import { DraftMessage } from '../types';

interface StagedDraftsViewProps {
  drafts: DraftMessage[];
  onOpenAuthorization: (draft: DraftMessage) => void;
  onDiscardDraft: (draftId: string) => void;
  onConfirmSend: (draftId: string) => void;
}

export const StagedDraftsView: React.FC<StagedDraftsViewProps> = ({
  drafts,
  onOpenAuthorization,
  onDiscardDraft,
  onConfirmSend,
}) => {
  const pending = drafts.filter((d) => d.status !== 'sent');
  const sent = drafts.filter((d) => d.status === 'sent');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Policy Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-100">
            Executive Authorization & Outbox Staging
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            In accordance with the executive rules, voice instructions to "draft a reply" place messages into this staging area. No message is transmitted across Email or WhatsApp until you authorize sending either via voice command (<em>"Send this to Ahmed"</em> / <em>"Confirm send"</em>) or manual button click.
          </p>
        </div>
      </div>

      {/* Pending Staged Drafts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Pending Executive Drafts ({pending.length})
          </h4>
          <span className="text-xs text-slate-500">Requires Authorization</span>
        </div>

        {pending.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
            <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No pending drafts awaiting review.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Say: <span className="text-teal-400 font-medium">"Draft a reply saying I'll call tomorrow"</span> to generate a staging draft.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((draft) => {
              const isEmail = draft.channel === 'email';
              return (
                <div
                  key={draft.id}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3">
                    <span className="text-[10px] font-mono px-3 py-1 rounded-bl-xl bg-amber-500/20 text-amber-300 font-semibold border-b border-l border-amber-500/30">
                      NOT SENT • DRAFT
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isEmail ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
                      }`}>
                        {isEmail ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        {isEmail ? 'Email Draft' : 'WhatsApp Reply'}
                      </span>
                      <span className="text-[10px] text-slate-500">{draft.createdAt}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      Recipient: {draft.recipient.name}
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({draft.recipient.identifier})
                      </span>
                    </div>

                    {isEmail && draft.subject && (
                      <div className="text-xs font-medium text-slate-300 mt-1">
                        Subject: {draft.subject}
                      </div>
                    )}

                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed line-clamp-4">
                      {draft.content}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onDiscardDraft(draft.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition-colors"
                      title="Discard draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenAuthorization(draft)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Review & Edit
                      </button>

                      <button
                        onClick={() => onConfirmSend(draft.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Authorize & Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispatched / Sent Communications Log */}
      {sent.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Authorized & Dispatched Messages ({sent.length})
            </h4>
            <span className="text-xs text-emerald-400 font-mono">Transmission Verified</span>
          </div>

          <div className="space-y-2">
            {sent.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    {item.channel === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span>To: {item.recipient.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">({item.recipient.identifier})</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1 mt-0.5">{item.content}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle className="w-3 h-3" />
                    Sent
                  </div>
                  <div>{item.authorizedAt || 'Just now'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
