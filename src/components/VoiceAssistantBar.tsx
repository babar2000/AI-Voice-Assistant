import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ActiveContext, AssistantResponse } from '../types';

interface VoiceAssistantBarProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  audioLevel: number;
  isSpeaking: boolean;
  isProcessing: boolean;
  lastResponse: AssistantResponse | null;
  activeContext: ActiveContext;
  onToggleListening: () => void;
  onSubmitCommand: (text: string) => void;
  onReplaySpeech: () => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  isListening,
  transcript,
  interimTranscript,
  audioLevel,
  isSpeaking,
  isProcessing,
  lastResponse,
  activeContext,
  onToggleListening,
  onSubmitCommand,
  onReplaySpeech,
}) => {
  const [typedInput, setTypedInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    onSubmitCommand(typedInput.trim());
    setTypedInput('');
  };

  const samplePrompts = [
    { label: "Find Ahmed's latest email.", text: "Find Ahmed's latest email." },
    { label: "Check WhatsApp for the Dubai meeting.", text: "Check WhatsApp for the Dubai meeting." },
    { label: "Search both channels for Ahmed", text: "Search both Email and WhatsApp for Ahmed and summarize all updates." },
    { label: "Draft a reply saying I'll call tomorrow.", text: "Draft a reply saying I'll call tomorrow." },
    { label: "Send this to Ahmed.", text: "Send this to Ahmed." },
    { label: "What are my pending action items and amounts?", text: "What are my pending action items and amounts?" },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 shadow-2xl relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Main Assistant Command Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: The Voice Orb & Status */}
          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="relative">
              {/* Dynamic Aura Rings */}
              {isListening && (
                <div
                  className="absolute inset-0 rounded-full bg-rose-500/20 blur-md animate-ping"
                  style={{ transform: `scale(${1 + audioLevel * 0.8})` }}
                />
              )}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-teal-400/30 blur-md animate-pulse" />
              )}
              {isProcessing && (
                <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-md animate-spin" />
              )}

              {/* Central Mic Button */}
              <button
                onClick={onToggleListening}
                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening
                    ? 'bg-rose-600 text-white shadow-rose-600/40 scale-105 ring-4 ring-rose-500/30'
                    : isSpeaking
                    ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-teal-500/30 ring-4 ring-teal-500/20'
                    : isProcessing
                    ? 'bg-amber-600 text-white shadow-amber-600/30 animate-pulse'
                    : 'bg-gradient-to-tr from-slate-800 to-slate-700 hover:from-teal-600 hover:to-emerald-500 text-slate-100 shadow-slate-950/60 border border-slate-600/60'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to speak a voice command'}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7 animate-pulse" />
                ) : (
                  <Mic className="w-7 h-7" />
                )}
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200 text-base">
                  {isListening
                    ? 'Listening to you...'
                    : isProcessing
                    ? 'Assistant Thinking...'
                    : isSpeaking
                    ? 'Speaking Response...'
                    : 'Executive Voice Assistant'}
                </span>
                {isSpeaking && (
                  <button
                    onClick={onReplaySpeech}
                    className="p-1 rounded text-teal-400 hover:bg-slate-800"
                    title="Replay Voice Audio"
                  >
                    <Volume2 className="w-4 h-4 animate-bounce" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isListening
                  ? 'Speak naturally: "Find Ahmed\'s email" or "Draft a reply"'
                  : 'Tap the mic or click a quick executive command below'}
              </p>

              {/* Audio Waveform Bars */}
              {(isListening || isSpeaking) && (
                <div className="flex items-center gap-1 mt-2 h-4">
                  {[...Array(12)].map((_, i) => {
                    const heightPercent = isListening
                      ? Math.max(20, Math.min(100, (audioLevel * 100 * (1 + (i % 3) * 0.4))))
                      : isSpeaking
                      ? 30 + Math.sin(Date.now() / 200 + i) * 35 + 35
                      : 20;
                    return (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          isListening ? 'bg-rose-500' : 'bg-teal-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Spoken Response Card & Transcript */}
          <div className="lg:col-span-8 flex flex-col gap-2.5">
            {/* Live Voice Transcript Banner */}
            {(isListening || interimTranscript || transcript) && (
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Voice Input:
                </span>
                <span className="text-sm text-slate-100 font-medium truncate">
                  {interimTranscript || transcript || 'Speak your command...'}
                </span>
              </div>
            )}

            {/* Assistant Spoken Response Display */}
            {lastResponse && (
              <div className={`p-3.5 rounded-xl border transition-all ${
                lastResponse.needsClarification
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : lastResponse.intent === 'confirm_send'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                  : lastResponse.intent === 'request_send_authorization'
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-100'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                      {lastResponse.needsClarification ? (
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-teal-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-relaxed">
                        "{lastResponse.spokenReply}"
                      </p>

                      {/* Dual-Channel Cross Correlation Badge */}
                      {lastResponse.crossChannelSummary && (
                        <div className="mt-2 text-xs bg-cyan-950/40 text-cyan-200 p-2.5 rounded-lg border border-cyan-500/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="font-semibold text-slate-100">
                              Dual-Channel Match:
                            </span>
                            <span className="text-amber-300 font-medium">
                              {lastResponse.crossChannelSummary.emailCount} Email{lastResponse.crossChannelSummary.emailCount === 1 ? '' : 's'}
                            </span>
                            <span className="text-slate-500">+</span>
                            <span className="text-emerald-300 font-medium">
                              {lastResponse.crossChannelSummary.whatsappCount} WhatsApp Thread{lastResponse.crossChannelSummary.whatsappCount === 1 ? '' : 's'}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shrink-0">
                            Synthesized
                          </span>
                        </div>
                      )}
                      
                      {/* Clarification prompt banner if needed */}
                      {lastResponse.needsClarification && lastResponse.clarificationQuestion && (
                        <div className="mt-2 text-xs bg-amber-500/10 text-amber-300 p-2 rounded-lg border border-amber-500/20 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Clarification needed: {lastResponse.clarificationQuestion}</span>
                        </div>
                      )}

                      {/* Extracted Metadata Pills */}
                      {lastResponse.extractedDetails && (
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-700/50 text-xs">
                          {lastResponse.extractedDetails.amounts?.map((amt, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <DollarSign className="w-3 h-3" />
                              {amt}
                            </span>
                          ))}
                          {lastResponse.extractedDetails.dates?.map((dt, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              <Calendar className="w-3 h-3" />
                              {dt}
                            </span>
                          ))}
                          {lastResponse.extractedDetails.actionItems?.map((act, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              {act}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onReplaySpeech}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                    title="Hear again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Natural Text / Fallback Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type or speak executive command (e.g. 'Find Ahmed's latest email' or 'Draft a reply...')"
                className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
              <button
                type="submit"
                disabled={!typedInput.trim() || isProcessing}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Voice Prompt Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Executive Voice Prompts:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => onSubmitCommand(p.text)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-teal-900/40 hover:text-teal-200 text-slate-300 border border-slate-700 hover:border-teal-500/40 transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              <span>🎙️</span>
              <span>"{p.label}"</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
