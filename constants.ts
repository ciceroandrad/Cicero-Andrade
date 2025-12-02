import { FunctionCardData } from './types';

export const CREATE_FUNCTIONS: FunctionCardData[] = [
  { id: 'cinematic', icon: '🎬', label: 'Cinematográfico', description: 'Iluminação e composição de cinema' },
  { id: 'digital-art', icon: '🎨', label: 'Arte Digital', description: 'Ilustração estilizada vibrante' },
  { id: 'photoreal', icon: '📸', label: 'Fotorealista', description: 'Fotografia hiper-realista' },
  { id: 'cyberpunk', icon: '🌃', label: 'Cyberpunk', description: 'Luzes neon e paisagens futuristas' },
];

export const EDIT_FUNCTIONS: FunctionCardData[] = [
  { id: 'restore-old', icon: '🕰️', label: 'Restaurar Antigas', description: 'Restaurar fotos velhas/danificadas' },
  { id: 'merge-people', icon: '🫂', label: 'Unir Pessoas', description: 'Colocar pessoas abraçadas/juntas' },
  { id: 'age-progression', icon: '⏳', label: 'Viajar no Tempo', description: 'Simular versão idosa ou jovem' },
  { id: 'luxury-life', icon: '💎', label: 'Vida Luxuosa', description: 'Mansões, carros e alta costura' },
  { id: 'variations', icon: '🔄', label: 'Variações', description: 'Gerar versões diferentes' },
];

export const PROMPT_MODIFIERS: Record<string, string> = {
  'cinematic': 'cinematic lighting, 35mm lens, shallow depth of field, movie scene, 8k resolution, highly detailed',
  'digital-art': 'digital art style, vibrant colors, clean lines, concept art, artstation trending',
  'photoreal': 'photorealistic, 8k, highly detailed, raw photo, natural lighting, sharp focus',
  'cyberpunk': 'cyberpunk aesthetic, neon green and purple lighting, futuristic city, high tech, rainy street',
  'variations': 'creative variation of this image, maintaining composition but changing details',
  'style-transfer': 'in the artistic style described, maintaining the original structure',
  'restore-old': 'restore old photo, remove scratches, fix tears, colorize if black and white, sharpen details, remove blur, high definition, restoration',
  'merge-people': 'merge these people together into one scene, make them hugging or standing close together realistically, seamless blend, consistent lighting, high quality',
  'age-progression': 'realistic age progression or regression, transform the subject to look significantly older or younger based on context, maintaining facial identity, realistic skin texture, high detail',
  'luxury-life': 'place subject in a luxurious setting, expensive mansion background, luxury sports car nearby, wearing expensive haute couture fashion, wealth, golden hour lighting, sophisticated atmosphere, high quality',
};