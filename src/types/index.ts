export type UserRole = "user" | "admin" | "colaborador";

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: UserRole;
  data_criacao: Date;
}

export interface Organization {
  id: string;
  nome: string;
  descricao?: string;
  site?: string;
  criado_em: Date;
}

export interface Category {
  id: string;
  nome: string;
}

export interface Event {
  id: string;
  nome: string;
  descricao?: string;
  organizacao_id?: string;
  endereco?: string;
  data: Date;
  image?: string;
  categoria_id?: string;
  criado_em: Date;
}

export interface EventImage {
  id: string;
  event_id: string;
  url: string;
  criado_em: Date;
}

export interface Comment {
  id: string;
  user_id: string;
  event_id: string;
  comentario: string;
  rating: number;
  criado_em: Date;
}
