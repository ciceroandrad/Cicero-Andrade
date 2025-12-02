import React, { useRef } from 'react';
import { Mode, FunctionCardData } from '../types';
import { CREATE_FUNCTIONS, EDIT_FUNCTIONS } from '../constants';
import { Upload, X, Wand2, Sliders, Users, Info, Settings } from 'lucide-react';

interface LeftPanelProps {
  mode: Mode;
  prompt: string;
  selectedFunction: string | null;
  inputImage: string | null;
  secondaryInputImage: string | null;
  isGenerating: boolean;
  onModeChange: (mode: Mode) => void;
  onPromptChange: (prompt: string) => void;
  onFunctionSelect: (id: string | null) => void;
  onImageUpload: (base64: string | null) => void;
  onSecondaryImageUpload: (base64: string | null) => void;
  onConfigureApi?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  mode,
  prompt,
  selectedFunction,
  inputImage,
  secondaryInputImage,
  isGenerating,
  onModeChange,
  onPromptChange,
  onFunctionSelect,
  onImageUpload,
  onSecondaryImageUpload,
  onConfigureApi
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secFileInputRef = useRef<HTMLInputElement>(null);

  const activeFunctions = mode === Mode.CREATE ? CREATE_FUNCTIONS : EDIT_FUNCTIONS;
  
  const accentColor = 'text-accent';
  const accentBorder = 'border-accent/20';
  const accentBg = 'bg-accent/10';
  const accentShadow = 'shadow-[0_0_15px_rgba(0,255,128,0.1)]';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isSecondary) {
          onSecondaryImageUpload(result);
        } else {
          onImageUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearInputImage = (e: React.MouseEvent, isSecondary = false) => {
    e.stopPropagation();
    if (isSecondary) {
      onSecondaryImageUpload(null);
      if (secFileInputRef.current) secFileInputRef.current.value = '';
    } else {
      onImageUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-[#0f1113cc] backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col gap-6 h-fit shadow-2xl shadow-green-900/5`}>
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-wide mb-1 flex items-center gap-2 ${accentColor}`}>
            <Wand2 className="w-5 h-5" />
            Mestres AI Studio
          </h1>
          <p className="text-muted text-sm">Suíte de Geração Profissional</p>
        </div>
        {onConfigureApi && (
          <button 
            onClick={onConfigureApi} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Configurar API Key"
          >
            <Settings size={18} />
          </button>
        )}
      </div>

      <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
        <button
          onClick={() => onModeChange(Mode.CREATE)}
          className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-lg transition-all ${
            mode === Mode.CREATE
              ? `${accentBg} ${accentColor} ${accentBorder} ${accentShadow}`
              : 'text-muted hover:text-white'
          }`}
          disabled={isGenerating}
        >
          CRIAR
        </button>
        <button
          onClick={() => onModeChange(Mode.EDIT)}
          className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-lg transition-all ${
            mode === Mode.EDIT
              ? `${accentBg} ${accentColor} ${accentBorder} ${accentShadow}`
              : 'text-muted hover:text-white'
          }`}
          disabled={isGenerating}
        >
          EDITAR
        </button>
      </div>

      <div className={`p-3 rounded-lg border text-xs leading-relaxed flex gap-2 bg-green-500/5 border-green-500/10 text-green-200/80`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
        <div>
          {mode === Mode.CREATE ? (
            <>
              <strong>Como criar:</strong> Digite o que você imagina no campo abaixo e clique em <strong>Gerar Imagem</strong>. Nosso app criará uma arte exclusiva para você.
            </>
          ) : (
            <>
              <strong>Como editar:</strong> 
              <ol className="list-decimal ml-4 mt-1 space-y-1 opacity-90">
                 <li>Envie sua foto clicando na área de upload.</li>
                 <li>Escolha uma ferramenta (ex: Restaurar, Viajar no Tempo).</li>
                 <li>Descreva o ajuste desejado e clique em <strong>Gerar</strong>.</li>
              </ol>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={`text-xs font-semibold opacity-70 uppercase tracking-wider text-green-100`}>
          {mode === Mode.CREATE ? 'Descreva sua ideia' : 'Descreva sua edição'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={mode === Mode.CREATE 
            ? "Ex: Uma cidade cyberpunk futurista..." 
            : "Ex: Deixe ele bem velhinho com cabelos brancos ou restaure esta foto antiga..."}
          className={`w-full min-h-[100px] p-4 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none resize-none transition-all placeholder:text-white/20 text-sm leading-relaxed
            focus:border-accent/50 focus:ring-accent/50 focus:ring-1`}
          disabled={isGenerating}
        />
      </div>

      {mode === Mode.EDIT && (
        <div className="animate-fadeIn flex flex-col gap-4">
          
          <div>
            <label className="text-xs font-semibold text-green-100/70 uppercase tracking-wider mb-2 block">
              {selectedFunction === 'merge-people' ? 'Foto da 1ª Pessoa' : 'Envie sua foto aqui para editar'}
            </label>
            <div 
              className={`relative w-full h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${inputImage ? 'border-accent/30' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {inputImage ? (
                <>
                  <img src={inputImage} alt="Upload" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/10">Trocar Foto</span>
                  </div>
                  <button 
                    onClick={(e) => clearInputImage(e, false)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-green-500/20 hover:text-green-400 text-white rounded-full transition-colors border border-white/10"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className={`flex flex-col items-center gap-2 text-muted transition-colors group-hover:text-accent/80`}>
                  <Upload size={24} />
                  <span className="text-xs font-medium">
                    {selectedFunction === 'merge-people' ? 'Upload Foto 1' : 'Clique para enviar foto'}
                  </span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, false)}
                disabled={isGenerating}
              />
            </div>
          </div>

          {selectedFunction === 'merge-people' && (
            <div className="animate-slideDown">
              <label className="text-xs font-semibold text-green-100/70 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Users className="w-3 h-3" />
                Foto da 2ª Pessoa (para unir)
              </label>
              <div 
                className={`relative w-full h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${secondaryInputImage ? 'border-accent/30' : ''}`}
                onClick={() => secFileInputRef.current?.click()}
              >
                 {secondaryInputImage ? (
                  <>
                    <img src={secondaryInputImage} alt="Upload 2" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/10">Trocar Foto</span>
                    </div>
                    <button 
                      onClick={(e) => clearInputImage(e, true)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-green-500/20 hover:text-green-400 text-white rounded-full transition-colors border border-white/10"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted group-hover:text-accent/80 transition-colors">
                    <Upload size={24} />
                    <span className="text-xs font-medium">Upload Foto 2</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={secFileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  disabled={isGenerating}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1">
        <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-green-100/70`}>
          <Sliders className="w-3 h-3" />
          {mode === Mode.CREATE ? 'Estilos' : 'Ferramentas de Edição'}
        </label>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 max-h-[300px] custom-scrollbar">
          {activeFunctions.map((func: FunctionCardData) => (
            <button
              key={func.id}
              onClick={() => onFunctionSelect(selectedFunction === func.id ? null : func.id)}
              disabled={isGenerating}
              className={`p-3 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 group ${
                selectedFunction === func.id
                  ? `${accentBg} ${accentBorder} ${accentShadow}`
                  : `bg-white/[0.02] border-white/5 hover:shadow-lg hover:border-accent/20`
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-lg transition-colors ${
                 selectedFunction === func.id 
                 ? 'bg-accent/10 text-white' 
                 : 'bg-white/5 text-muted group-hover:text-white'
              }`}>
                {func.icon}
              </div>
              <div className={`text-xs font-bold mb-0.5 ${
                selectedFunction === func.id 
                ? 'text-accent' 
                : 'text-gray-300'
              }`}>
                {func.label}
              </div>
              <div className="text-[10px] text-white/40 leading-tight line-clamp-2">
                {func.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};