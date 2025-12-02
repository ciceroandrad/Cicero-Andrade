import React, { useState, useCallback, useEffect } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { AppState, Mode, GenerationConfig } from './types';
import { generateImage } from './services/geminiService';
import { X, Save, Key } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: Mode.CREATE,
    prompt: '',
    selectedFunction: null,
    generatedImage: null,
    inputImage: null,
    secondaryInputImage: null,
    isGenerating: false,
    error: null,
  });

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('mestres_ai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
    
    const initKey = async () => {
      try {
        if (window.aistudio?.hasSelectedApiKey) {
          // This call is mainly for AI Studio playground environment,
          // for Vercel, API key management is handled via modal/env vars.
          await window.aistudio.hasSelectedApiKey();
        }
      } catch (e) {
        console.error("Failed to check API key status", e);
      }
    };
    initKey();
  }, []);

  const handleModeChange = (mode: Mode) => {
    setState((prev) => ({ ...prev, mode, selectedFunction: null, error: null }));
  };

  const handlePromptChange = (prompt: string) => {
    setState((prev) => ({ ...prev, prompt }));
  };

  const handleFunctionSelect = (funcId: string | null) => {
    setState((prev) => ({ ...prev, selectedFunction: funcId }));
  };

  const handleImageUpload = (base64: string | null) => {
    setState((prev) => ({ ...prev, inputImage: base64 }));
  };
  
  const handleSecondaryImageUpload = (base64: string | null) => {
    setState((prev) => ({ ...prev, secondaryInputImage: base64 }));
  };

  const handleConfigureApi = async () => {
    // Prioritize AI Studio's native key selector if available (for playground)
    if (window.aistudio?.openSelectKey) {
       try {
         await window.aistudio.openSelectKey();
         // Assume success, UI will update after a successful generation or if key is later needed.
       } catch(e) {
         // Fallback to local modal if AI Studio key selection fails
         setShowKeyModal(true);
       }
    } else {
       // Always show local modal for external deployments like Vercel
       setShowKeyModal(true);
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setState(prev => ({ ...prev, error: 'A API Key não pode estar vazia.' }));
      return;
    }
    localStorage.setItem('mestres_ai_api_key', apiKey);
    setShowKeyModal(false);
    setState(prev => ({ ...prev, error: null }));
  };

  const handleGenerate = useCallback(async () => {
    if (!state.prompt && state.mode === Mode.CREATE) {
      setState((prev) => ({ ...prev, error: 'Por favor, insira um prompt para criar.' }));
      return;
    }

    if (state.mode === Mode.EDIT && !state.inputImage) {
      setState((prev) => ({ ...prev, error: 'Envie sua foto aqui para editar antes de continuar.' }));
      return;
    }

    if (state.mode === Mode.EDIT && state.selectedFunction === 'merge-people' && !state.secondaryInputImage) {
      setState((prev) => ({ ...prev, error: 'Para unir pessoas, envie também a segunda foto.' }));
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const config: GenerationConfig = {
        prompt: state.prompt || (state.mode === Mode.EDIT ? "Melhorar esta imagem" : "Create art"),
        mode: state.mode,
        selectedFunction: state.selectedFunction,
        inputImage: state.inputImage,
        secondaryInputImage: state.secondaryInputImage,
        apiKey: apiKey 
      };

      const imageBase64 = await generateImage(config);
      
      if (imageBase64) {
        setState((prev) => ({ ...prev, generatedImage: imageBase64 }));
      } else {
        setState((prev) => ({ ...prev, error: 'Nenhuma imagem gerada. Por favor, tente novamente.' }));
      }
    } catch (err) {
      const errorObj = err as any;
      const errorMessage = errorObj.message || 'Ocorreu um erro desconhecido';
      
      if (errorMessage.includes('404') || errorMessage.includes('Requested entity was not found')) {
         // If a 404 occurs, it often means the API key lacks permissions or is invalid for the model.
         // Prompt user to select a new key or check their existing one.
         if (window.aistudio?.openSelectKey) {
           await window.aistudio.openSelectKey(); // Try opening the native key selector first
         }
         setShowKeyModal(true); // Always show our local modal as a fallback or for external deployments
         setState((prev) => ({ 
            ...prev, 
            error: 'Erro de autenticação (404). Verifique sua API Key e tente novamente.' 
         }));
      } else if (errorMessage.includes('API Key não encontrada')) {
         setShowKeyModal(true);
         setState((prev) => ({ ...prev, error: errorMessage }));
      } else {
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    } finally {
      setState((prev) => ({ ...prev, isGenerating: false }));
    }
  }, [state.prompt, state.mode, state.selectedFunction, state.inputImage, state.secondaryInputImage, apiKey]);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex justify-center items-start relative">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        
        <LeftPanel 
          mode={state.mode}
          prompt={state.prompt}
          selectedFunction={state.selectedFunction}
          inputImage={state.inputImage}
          secondaryInputImage={state.secondaryInputImage}
          isGenerating={state.isGenerating}
          onModeChange={handleModeChange}
          onPromptChange={handlePromptChange}
          onFunctionSelect={handleFunctionSelect}
          onImageUpload={handleImageUpload}
          onSecondaryImageUpload={handleSecondaryImageUpload}
          onConfigureApi={handleConfigureApi}
        />

        <RightPanel 
          generatedImage={state.generatedImage}
          isGenerating={state.isGenerating}
          error={state.error}
          onGenerate={handleGenerate}
          mode={state.mode}
          selectedFunction={state.selectedFunction}
        />
      </div>

      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1113] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                Configurar API Key
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              Insira sua Google Gemini API Key para continuar. A chave será salva no seu navegador.
            </p>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua API Key aqui..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-accent/50 mb-4 text-sm font-mono"
            />

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={saveApiKey}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-black hover:bg-accent/90 flex items-center gap-2"
              >
                <Save size={16} />
                Salvar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;