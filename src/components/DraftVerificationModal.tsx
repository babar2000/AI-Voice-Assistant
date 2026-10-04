import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  X, 
  Mail, 
  MessageSquare, 
  Check, 
  Edit3, 
  User, 
  FileText,
  Lock,
  Mic
} from 'lucide-react';
import { DraftMessage } from '../types';

interface DraftVerificationModalProps {
  draft: DraftMessage;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: (draftId: string, updatedContent?: string) => void;
  onDiscardDraft: (draftId: string) => void;
}

export const DraftVerificationModal: React.FC<DraftVerificationModalProps> = ({
  draft,
  isOpen,
  onClose,
  onConfirmSend,
  onDiscardDraft,
}) => {
  const [content, setContent] = useState(draft.content);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmedChecks, setConfirmedChecks] = useState({
    recipient: true,
    content: true,
  });

  if (!isOpen) return null;

  const isEmail = draft.channel === 'email';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header with Safety Protocol Badge */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100">
                  Verification & Send Authorization
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  Draft = Not Sent
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rule: Outgoing communications transmit only after explicit human authorization.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Target Metadata Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Channel:</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
                isEmail ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
              }`}>
                {isEmail ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                {isEmail ? 'Official Email' : 'WhatsApp Message'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Verified Recipient:</span>
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" />
                {draft.recipient.name}
                <span className="text-slate-400 font-mono text-[11px]">
                  ({draft.recipient.identifier})
                </span>
              </span>
            </div>

            {isEmail && draft.subject && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Subject Line:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[320px]">
                  {draft.subject}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Executive Tone:</span>
              <span className="text-teal-300 font-medium capitalize">
                {draft.tone === 'professional' ? 'Business Professional & Concise' : 'Natural & Conversational'}
              </span>
            </div>
          </div>

          {/* Draft Message Preview / Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                Draft Content Review:
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 text-[11px]"
              >
                <Edit3 className="w-3 h-3" />
                {isEditing ? 'Save Edits' : 'Edit Text'}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-teal-500/50 rounded-xl p-3 text-xs sm:text-sm text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
              />
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-sans">
                {content}
              </div>
            )}
          </div>

          {/* Voice Command Confirmation Hint */}
          <div className="bg-teal-950/20 border border-teal-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-teal-300">
            <Mic className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            <span>
              You can authorize with your voice! Say: <strong className="text-white">"Confirm send"</strong> or <strong className="text-white">"Yes send it"</strong>.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onDiscardDraft(draft.id)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 text-xs font-medium transition-colors"
          >
            Discard Draft
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Keep as Draft
            </button>

            <button
              onClick={() => onConfirmSend(draft.id, content)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Authorize & Send Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
