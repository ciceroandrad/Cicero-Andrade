import React from 'react';
import { Download, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Mode } from '../types';

interface RightPanelProps {
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  onGenerate: () => void;
  mode: Mode;
  selectedFunction: string | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  generatedImage,
  isGenerating,
  error,
  onGenerate,
  mode,
  selectedFunction,
}) => {
  
  const accentColor = 'text-accent';
  const btnBg = 'bg-accent hover:bg-[#33ff99]';
  const shadowColor = 'shadow-[0_0_20px_rgba(0,255,128,0.15)]';
  const loaderBorder = 'border-t-accent';

  return (
    <div className="flex flex-col gap-4 h-full">
      
      <div className="relative w-full flex-1 min-h-[500px] lg:min-h-[600px] bg-[#0f1113cc] backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group">
        
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full border-4 border-white/10 ${loaderBorder} animate-spin`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className={`w-6 h-6 animate-pulse ${accentColor}`} />
              </div>
            </div>
            <p className={`${accentColor} font-medium tracking-wide animate-pulse text-sm`}>
              {mode === Mode.EDIT ? 'Processando...' : 'Criando sua arte...'}
            </p>
          </div>
        ) : generatedImage ? (
           <img 
             src={generatedImage} 
             alt="Generated result" 
             className="max-w-full max-h-full object-contain shadow-2xl z-10 animate-in fade-in zoom-in duration-500" 
           />
        ) : (
          <div className="flex flex-col items-center gap-4 text-white/20 z-10 max-w-xs text-center p-8">
             <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-2 border border-white/5">
                <ImageIcon className="w-10 h-10 opacity-50" />
             </div>
            <p className="text-sm font-medium">Sua criação aparecerá aqui</p>
            <p className="text-xs opacity-60">
              {mode === Mode.EDIT 
                ? 'Envie uma foto e escolha "Restaurar Antigas" ou "Vida Luxuosa" para começar.'
                : 'Digite uma ideia e clique em Gerar.'}
            </p>
          </div>
        )}

        {error && !isGenerating && (
          <div className="absolute bottom-6 left-6 right-6 bg-red-500/10 border border-red-500/20 backdrop-blur-md text-red-200 p-4 rounded-xl flex items-start gap-3 z-20 animate-in slide-in-from-bottom-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
            <div className="text-sm">{error}</div>
          </div>
        )}
      </div>

      <div className={`flex items-center justify-between gap-4 bg-[#0f1113cc] backdrop-blur-xl p-4 rounded-2xl border border-white/5`}>
        
        <div className="flex flex-col gap-1 pl-2">
           <div className="text-[10px] uppercase tracking-widest text-muted font-semibold">Status</div>
           <div className="text-sm text-white flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-400 animate-pulse' : 'bg-accent'}`}></span>
             {isGenerating ? 'Processando...' : 'Pronto'}
             {selectedFunction && <span className="text-white/30 text-xs px-2">• {selectedFunction}</span>}
           </div>
        </div>

        <div className="flex items-center gap-3">
            {generatedImage && !isGenerating && (
               <a 
                  href={generatedImage} 
                  download={`mestres-ai-${Date.now()}.png`}
                  className={`h-12 px-6 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium uppercase tracking-wider group border-white/10 hover:bg-white/5 text-white`}
                >
                   <Download className={`w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-white`} />
                   <span className="hidden sm:inline">Clique aqui para baixar</span>
                </a>
            )}

            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`h-12 px-8 rounded-xl text-black font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${shadowColor} hover:shadow-lg active:scale-[0.98]
                ${isGenerating 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : btnBg
                }`}
            >
              {isGenerating ? (
                 <span className="animate-pulse">Trabalhando...</span>
              ) : (
                 <>
                   <Sparkles className="w-4 h-4" />
                   {mode === Mode.EDIT ? 'Gerar' : 'Criar Imagem'}
                 </>
              )}
            </button>
        </div>
      </div>

    </div>
  );
};