import React, { useState } from 'react';
import { TreeState, GeneratedGreeting } from '../types';
import { generateLuxuryGreeting } from '../services/geminiService';
import { Wand2, Component, Sparkles, Loader2 } from 'lucide-react';

interface UIOverlayProps {
  currentState: TreeState;
  onToggleState: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ currentState, onToggleState }) => {
  const [greeting, setGreeting] = useState<GeneratedGreeting | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateGreeting = async () => {
    setIsLoading(true);
    const data = await generateLuxuryGreeting();
    setGreeting(data);
    setIsLoading(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-5xl font-bold text-yellow-500 font-serif tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            ARIX
          </h1>
          <p className="text-emerald-400 text-sm tracking-[0.3em] mt-2 uppercase font-light">
            Signature Collection
          </p>
        </div>
      </header>

      {/* AI Greeting Card */}
      {greeting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg pointer-events-auto">
           <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-600/30 p-8 rounded-sm text-center shadow-2xl animate-in fade-in zoom-in duration-500">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl text-yellow-200 font-serif mb-4">{greeting.title}</h3>
              <p className="text-slate-300 font-serif leading-relaxed italic text-lg">
                "{greeting.message}"
              </p>
              <button 
                onClick={() => setGreeting(null)}
                className="mt-6 text-xs text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
              >
                Close Card
              </button>
           </div>
        </div>
      )}

      {/* Footer Controls */}
      <footer className="flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-auto">
        
        {/* State Toggle */}
        <div className="flex gap-4">
           <button
             onClick={onToggleState}
             className="group relative px-6 py-3 bg-slate-900/80 border border-emerald-900/50 hover:border-emerald-500/50 text-emerald-100 transition-all duration-300 overflow-hidden"
           >
             <div className="absolute inset-0 bg-emerald-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             <div className="relative flex items-center gap-2">
                <Component className={`w-4 h-4 transition-transform duration-500 ${currentState === TreeState.SCATTERED ? 'rotate-180' : ''}`} />
                <span className="font-serif tracking-widest text-xs">
                  {currentState === TreeState.SCATTERED ? 'ASSEMBLE' : 'SCATTER'}
                </span>
             </div>
           </button>

           <button
             onClick={handleGenerateGreeting}
             disabled={isLoading}
             className="group relative px-6 py-3 bg-slate-900/80 border border-yellow-900/50 hover:border-yellow-500/50 text-yellow-100 transition-all duration-300 overflow-hidden disabled:opacity-50"
           >
             <div className="absolute inset-0 bg-yellow-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             <div className="relative flex items-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span className="font-serif tracking-widest text-xs">
                  AI GREETING
                </span>
             </div>
           </button>
        </div>

        <div className="text-right">
           <div className="text-xs text-slate-500 tracking-widest uppercase">Interactive Experience</div>
           <div className="text-xs text-slate-600 font-mono mt-1">v.2.5.0 // GEMINI POWERED</div>
        </div>

      </footer>
    </div>
  );
};
