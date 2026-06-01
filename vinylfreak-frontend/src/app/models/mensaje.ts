export interface Mensaje {
  remitente: string;
  contenido: string;
  fecha?: string;
  tipo: 'CHAT' | 'UNION' | 'DEJADA';
}
