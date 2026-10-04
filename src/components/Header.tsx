import React from 'react';
import { 
  Sparkles, 
  Mail, 
  MessageSquare, 
  FileText, 
  Volume2, 
  VolumeX, 
  Layers, 
  ShieldCheck, 
  Mic, 
  Radio,
  Settings,
  Link2
} from 'lucide-react';
import { ActiveContext, UserAccountConfig } from '../types';

interface HeaderProps {
  activeTab: 'unified' | 'email' | 'whatsapp' | 'drafts';
  setActiveTab: (tab: 'unified' | 'email' | 'whatsapp' | 'drafts') => void;
  activeContext: ActiveContext;
  userAccount: UserAccountConfig;
  onOpenChannelConfig: () => void;
  pendingDraftsCount: number;
  unreadEmailCount: number;
  unreadWaCount: number;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onMicClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeContext,
  userAccount,
  onOpenChannelConfig,
  pendingDraftsCount,
  unreadEmailCount,
  unreadWaCount,
  isListening,
  isSpeaking,
  isMuted,
  onToggleMute,
  onMicClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & System Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-slate-100">
                  APEX <span className="text-teal-400 font-mono text-sm uppercase">Voice EA</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Voice-Controlled Executive Hub • Email & WhatsApp
              </p>
            </div>
          </div>

          {/* Active Context Chip */}
          <div className="hidden md:flex items-center bg-slate-800/80 border border-slate-700/60 rounded-full px-3.5 py-1 text-xs">
            <span className="text-slate-400 mr-2 flex items-center gap-1">
              <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
              Active Memory:
            </span>
            {activeContext.type !== 'none' ? (
              <span className="font-medium text-teal-300 flex items-center gap-1.5 max-w-[240px] truncate">
                {activeContext.channel === 'email' ? (
                  <Mail className="w-3 h-3 text-amber-400" />
                ) : (
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                )}
                {activeContext.name || activeContext.title}
              </span>
            ) : (
              <span className="text-slate-400 italic">No specific message focused</span>
            )}
          </div>

          {/* Controls & Voice State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Linked Channels Pill */}
            <button
              onClick={onOpenChannelConfig}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
              title="Configure your WhatsApp Number and Email ID for dual routing"
            >
              <Link2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline text-amber-300 font-mono text-[11px] truncate max-w-[130px]">
                {userAccount.email}
              </span>
              <span className="hidden xl:inline text-slate-500">|</span>
              <span className="hidden xl:inline text-emerald-300 font-mono text-[11px]">
                {userAccount.whatsappNumber}
              </span>
              <span className="xl:hidden text-teal-300 text-xs font-medium">Channels</span>
            </button>

            <button
              onClick={onToggleMute}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isMuted ? 'Voice output is muted' : 'Voice output is active'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onMicClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                  : isSpeaking
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {isListening ? 'Listening...' : isSpeaking ? 'Assistant Speaking' : 'Voice Command'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto py-2 text-xs sm:text-sm scrollbar-none">
          <button
            onClick={() => setActiveTab('unified')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'unified'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Executive Overview
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            Email Inbox
            {unreadEmailCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {unreadEmailCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            WhatsApp Web
            {unreadWaCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {unreadWaCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'drafts'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Staged Drafts & Authorization
            {pendingDraftsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-rose-500 text-white font-bold animate-pulse">
                {pendingDraftsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
