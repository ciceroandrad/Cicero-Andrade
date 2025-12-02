export enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}

export interface AppState {
  mode: Mode;
  prompt: string;
  selectedFunction: string | null;
  generatedImage: string | null; // Base64 Data URI
  inputImage: string | null; // Base64
  secondaryInputImage: string | null; // Base64 para unir fotos
  isGenerating: boolean;
  error: string | null;
}

export interface FunctionCardData {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface GenerationConfig {
  prompt: string;
  mode: Mode;
  selectedFunction: string | null;
  inputImage: string | null;
  secondaryInputImage: string | null;
  apiKey?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
  
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}