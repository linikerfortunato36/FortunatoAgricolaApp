import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Produtor {
  id: string;
  nome: string;
  cpfCnpj: string;
  inscricaoEstadual: string;
  isActive: boolean;
}

export interface Transportadora {
  id: string;
  nome: string;
  cpfCnpj: string;
  isActive: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  isActive: boolean;
}

export interface Contrato {
  id: string;
  clienteId: string;
  clienteNome: string;
  numeroContrato: string;
  status: string;
  quantidadeTotalKg: number;
  quantidadeEntregueKg: number;
  quantidadeRestanteKg: number;
  isActive: boolean;
}

export interface Movimentacao {
  id: string;
  data: string;
  contratoId: string;
  contratoNumero: string;
  produtorOrigemId: string;
  produtorOrigemNome: string;
  quantidadeOrigemKg: number;
  pesoDescargaKg: number;
  umidadeKg: number;
  impurezaKg: number;
  umidadePorcentagem: number;
  impurezaPorcentagem: number;
  pesoFinal: number;
  motorista: string;
  transportadoraId: string;
  transportadoraNome: string;
  custoFretePorSaca: number;
  valorCompraPorSaca: number;
  valorVendaPorSaca: number;
  ganhoLiquido: number;
}

export interface CreateMovimentacaoPayload {
  data: string;
  contratoId: string;
  produtorOrigemId: string;
  quantidadeOrigemKg: number;
  pesoDescargaKg: number;
  umidadeKg: number;
  impurezaKg: number;
  umidadePorcentagem: number;
  impurezaPorcentagem: number;
  motorista: string;
  transportadoraId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Produtores
  getProdutores(): Observable<Produtor[]> {
    return this.http.get<Produtor[]>(`${this.baseUrl}/Produtores`);
  }

  // Transportadoras
  getTransportadoras(): Observable<Transportadora[]> {
    return this.http.get<Transportadora[]>(`${this.baseUrl}/Transportadoras`);
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/Clientes`);
  }

  // Contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/Contratos`);
  }

  getContratoById(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/Contratos/${id}`);
  }

  // Movimentacoes
  getMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.baseUrl}/Movimentacoes`);
  }

  getMovimentacoesByContrato(contratoId: string): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.baseUrl}/Movimentacoes/by-contrato/${contratoId}`);
  }

  createMovimentacao(payload: CreateMovimentacaoPayload): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(`${this.baseUrl}/Movimentacoes`, payload);
  }

  deleteMovimentacao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Movimentacoes/${id}`);
  }
}
