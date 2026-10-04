import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  Plus, 
  User, 
  Search, 
  Sparkles, 
  Phone, 
  Layers, 
  Trash2, 
  ExternalLink,
  Save
} from 'lucide-react';
import { UserAccountConfig, LinkedContact } from '../types';

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccountConfig;
  linkedContacts: LinkedContact[];
  onSaveUserAccount: (config: UserAccountConfig) => void;
  onAddLinkedContact: (contact: LinkedContact) => void;
  onDeleteLinkedContact: (id: string) => void;
  onDualChannelQuery: (email: string, phone: string, name?: string) => void;
}

export const ChannelConfigModal: React.FC<ChannelConfigModalProps> = ({
  isOpen,
  onClose,
  userAccount,
  linkedContacts,
  onSaveUserAccount,
  onAddLinkedContact,
  onDeleteLinkedContact,
  onDualChannelQuery,
}) => {
  // User account form
  const [email, setEmail] = useState(userAccount.email);
  const [whatsappNumber, setWhatsappNumber] = useState(userAccount.whatsappNumber);
  const [displayName, setDisplayName] = useState(userAccount.displayName);
  const [userSaved, setUserSaved] = useState(false);

  // New Contact form
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState('');

  // Dual search query test
  const [queryEmail, setQueryEmail] = useState('');
  const [queryPhone, setQueryPhone] = useState('');

  if (!isOpen) return null;

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUserAccount({
      email: email.trim(),
      whatsappNumber: whatsappNumber.trim(),
      displayName: displayName.trim(),
      isConfigured: true,
    });
    setUserSaved(true);
    setTimeout(() => setUserSaved(false), 2500);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactEmail.trim() || !newContactPhone.trim()) return;

    onAddLinkedContact({
      id: `lc-${Date.now()}`,
      name: newContactName.trim(),
      email: newContactEmail.trim(),
      whatsappNumber: newContactPhone.trim(),
      role: newContactRole.trim() || 'Business Associate',
    });

    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactRole('');
    setShowAddContact(false);
  };

  const handleQuickDualQuery = (contact: LinkedContact) => {
    onDualChannelQuery(contact.email, contact.whatsappNumber, contact.name);
    onClose();
  };

  const handleCustomDualQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryEmail && !queryPhone) return;
    onDualChannelQuery(queryEmail.trim(), queryPhone.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Connect Channels & Dual-Account Routing
              </h3>
              <p className="text-xs text-slate-400">
                Configure WhatsApp number & Email ID so queries search both simultaneously.
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

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-6 overflow-y-auto">

          {/* Section 1: My Executive Accounts */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Your Active Accounts (Primary Executive Identity)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  The assistant checks this email inbox and this WhatsApp phone number for your incoming messages.
                </p>
              </div>
              {userSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Executive Name"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Your Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. babarzain322@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Your WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="+1 415 890 2244"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-teal-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update My Primary Accounts</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Instant Dual-Channel Query (Add Both and Search) */}
          <div className="bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Query Both Channels At Once
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                Cross-Correlated Search
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Provide an <strong>Email ID</strong> and a <strong>WhatsApp Number</strong>. The assistant will search across Email threads and WhatsApp chats simultaneously and combine the results into a single synthesized executive report.
            </p>

            <form onSubmit={handleCustomDualQuery} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={queryEmail}
                  onChange={(e) => setQueryEmail(e.target.value)}
                  placeholder="Target Email (e.g. ahmed.almansoori@gulfcap.ae)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={queryPhone}
                  onChange={(e) => setQueryPhone(e.target.value)}
                  placeholder="Target WhatsApp (e.g. +971 50 123 7890)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={!queryEmail && !queryPhone}
                  className="w-full h-full min-h-[36px] rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Query</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Linked Target Profiles (Paired Email + WhatsApp Contacts) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-400" />
                  Linked Dual-Channel Contacts ({linkedContacts.length})
                </span>
                <p className="text-[11px] text-slate-400">
                  Contacts with paired Email ID and WhatsApp phone numbers for 1-click dual querying.
                </p>
              </div>

              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>Add Contact</span>
              </button>
            </div>

            {/* Add Contact Inline Form */}
            {showAddContact && (
              <form onSubmit={handleAddContactSubmit} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300">New Contact with Paired Channels:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Full Name (e.g. Tariq Al-Sabah)"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
                    required
                  />
                  <input
                    type="text"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    placeholder="Role / Company (e.g. Board Member)"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
                  />
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="Email ID (e.g. tariq@domain.com)"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="WhatsApp Number (e.g. +965 99 123 456)"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium"
                  >
                    Save Linked Contact
                  </button>
                </div>
              </form>
            )}

            {/* List of Linked Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {linkedContacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70 flex flex-col justify-between text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={c.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-600"
                      />
                      <div>
                        <div className="font-semibold text-slate-100">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteLinkedContact(c.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-slate-300 pt-1 border-t border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-amber-300 truncate">
                      <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300 truncate">
                      <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{c.whatsappNumber}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickDualQuery(c)}
                    className="w-full py-1.5 rounded-lg bg-slate-900/90 hover:bg-teal-900/50 hover:text-teal-200 text-teal-300 border border-slate-700 hover:border-teal-500/50 font-medium text-[11px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    <span>Query Both Email & WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Active Identity: <strong className="text-slate-200">{userAccount.email}</strong> &bull; <strong className="text-slate-200">{userAccount.whatsappNumber}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
