import React, { useState } from 'react';
import { X, Mail, Plus, Sparkles, Check, Paperclip, FileText, ArrowRight } from 'lucide-react';
import { Email } from '../types';

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onAddEmail: (email: Email) => void;
}

export const AddEmailModal: React.FC<AddEmailModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onAddEmail,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [snippet, setSnippet] = useState('');
  const [body, setBody] = useState('');
  const [attachmentsText, setAttachmentsText] = useState('');
  const [keyDates, setKeyDates] = useState('');
  const [keyAmounts, setKeyAmounts] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !subject || !body) return;

    const attachmentList = attachmentsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        size: '1.4 MB',
        type: (name.endsWith('.pdf') ? 'pdf' : name.endsWith('.xlsx') ? 'spreadsheet' : 'document') as any,
      }));

    const newEmail: Email = {
      id: `em-${Date.now()}`,
      sender: {
        name: senderName.trim(),
        email: senderEmail.trim() || 'colleague@domain.com',
        title: 'Executive Contact',
      },
      recipients: [
        { name: 'You (Executive)', email: userEmail || 'babarzain322@gmail.com' }
      ],
      subject: subject.trim(),
      snippet: snippet.trim() || body.slice(0, 110) + '...',
      body: body.trim(),
      date: 'Just now',
      timestamp: new Date().toISOString(),
      unread: true,
      starred: false,
      folder: 'inbox',
      attachments: attachmentList,
      extractedMetadata: {
        dates: keyDates ? keyDates.split(',').map((s) => s.trim()) : [],
        amounts: keyAmounts ? keyAmounts.split(',').map((s) => s.trim()) : [],
        actionItems: [
          { text: `Review message from ${senderName}`, urgent: false }
        ]
      }
    };

    onAddEmail(newEmail);
    onClose();
  };

  const handleQuickPreset = (presetType: 'investor' | 'legal' | 'flight') => {
    if (presetType === 'investor') {
      setSenderName('Marcus Sterling');
      setSenderEmail('m.sterling@sequoia-cap.com');
      setSubject('Series A Term Sheet Feedback & Valuation');
      setSnippet('Reviewed the pitch deck. Syndicate is ready with $5.0M allocation at $32M post-money.');
      setBody(`Hi Zain,\n\nOur investment committee met this morning regarding the Series A financing. The syndicate is prepared to lead with a $5,000,000 allocation at $32,000,000 post-money valuation.\n\nPlease confirm if you are available for a 20-minute discussion tomorrow at 2:00 PM EST.\n\nBest,\nMarcus Sterling\nPartner, Venture Fund`);
      setAttachmentsText('Series_A_Term_Sheet_Draft.pdf');
      setKeyDates('Tomorrow at 2:00 PM EST');
      setKeyAmounts('$5,000,000 allocation, $32,000,000 valuation');
    } else if (presetType === 'flight') {
      setSenderName('Emirates Airline');
      setSenderEmail('reservations@emirates.com');
      setSubject('Your Flight Booking Confirmation - EK 202 to Dubai');
      setSnippet('Booking reference: 7K9Y2M. Flight departs JFK at 22:40 on Tuesday, arrives DXB 19:45.');
      setBody(`Dear Passenger,\n\nYour flight booking to Dubai has been confirmed.\n\nBooking Ref: 7K9Y2M\nFlight: EK 202 (Airbus A380-800)\nDeparture: Tuesday 22:40 (New York JFK)\nArrival: Wednesday 19:45 (Dubai DXB)\nSeat: 03A (First Class)\n\nPlease check in online 24 hours prior to departure.`);
      setAttachmentsText('E-Ticket_Receipt_EK202.pdf');
      setKeyDates('Tuesday 22:40 departure, Wednesday 19:45 arrival');
      setKeyAmounts('$8,450 paid');
    } else {
      setSenderName('David Vance, Esq.');
      setSenderEmail('dvance@vancelegal.com');
      setSubject('Signed NDA & Intellectual Property Assignment');
      setSnippet('Counter-signed agreements are attached. Next step is board approval by Friday 4 PM.');
      setBody(`Dear Zain,\n\nI have attached the fully executed Mutual Non-Disclosure and IP Assignment agreements for the upcoming venture partnership.\n\nPlease have your board sign off before Friday at 4:00 PM so we can file the trademark applications.\n\nRegards,\nDavid Vance`);
      setAttachmentsText('Executed_NDA_2026.pdf, IP_Assignment_Signed.pdf');
      setKeyDates('Friday at 4:00 PM');
      setKeyAmounts('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                Add Email to Inbox ({userEmail || 'babarzain322@gmail.com'})
              </h3>
              <p className="text-[11px] text-slate-400">
                Add or paste an email so the voice assistant can query and answer questions about it.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-5 pt-3 flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => handleQuickPreset('investor')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px]"
          >
            $5M Investor Term Sheet
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('flight')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px]"
          >
            Dubai Flight EK202
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('legal')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px]"
          >
            Signed Legal NDA
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Marcus Sterling"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Sender Email</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. sender@domain.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Urgent: Q4 Board Deck & Allocation"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-medium mb-1">Email Body Content</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste or type the full email message content here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                Attachments (comma-separated)
              </label>
              <input
                type="text"
                value={attachmentsText}
                onChange={(e) => setAttachmentsText(e.target.value)}
                placeholder="e.g. Pitch_Deck.pdf, Financials.xlsx"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Key Amounts or Dates</label>
              <input
                type="text"
                value={keyAmounts || keyDates}
                onChange={(e) => {
                  setKeyAmounts(e.target.value);
                  setKeyDates(e.target.value);
                }}
                placeholder="e.g. $5,000,000, Due 3:00 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Inbox</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
