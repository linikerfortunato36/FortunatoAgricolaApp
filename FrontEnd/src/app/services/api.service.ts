import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Produtor {
  id: string;
  nome: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  telefone?: string;
  email?: string;
  isActive: boolean;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
}

export interface Transportadora {
  id: string;
  nome: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  cep?: string;
  logradouro?: string;
  estado?: string;
  isActive: boolean;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
  totalViagens?: number;
}

export interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  isActive: boolean;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
  contratosAtivos?: number;
  valorTotalNegociado?: number;
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
  quantidadeEntregas: number;
  valorTotalNfe: number;
  percentualEntregue: number;
  isActive: boolean;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  login: string;
  perfil: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  updatedByName?: string;
}

export interface Movimentacao {
  id: string;
  data: string;
  contratoId: string;
  contratoNumero: string;
  clienteNome: string;
  produtorOrigemId: string;
  produtorOrigemNome: string;
  quantidadeOrigemKg: number;
  quantidadeSacas: number;
  pesoDescargaKg: number;
  diferencaPesoKg: number;
  umidadeKg: number;
  umidadePorcentagem: number;
  impurezaKg: number;
  impurezaPorcentagem: number;
  pesoFinal: number;
  pesoLiquidofazenda: number;
  motorista: string;
  transportadoraId: string;
  transportadoraNome: string;
  vendedorId: string;
  vendedorNome: string;

  // Financeiro
  custoFretePorSaca: number;
  valorCompraPorSaca: number;
  valorTotalCompra: number;
  valorTotalFrete: number;
  valorPorSacaArmazem: number;
  valorTotalArmazem: number;
  quemPagaArmazem: string;
  valorVendaPorSaca: number;
  valorTotalVenda: number;
  nfe: string;
  valorNfe: number;
  totalCompra: number;
  ganhoBruto: number;
  imposto: number;
  totalComissaoLd: number;
  ganhoLiquido: number;

  observacao?: string;
  dataPrevistaPagamento?: string;
  dataEntrega?: string;
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
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
  pesoLiquidofazenda: number;
  motorista: string;
  transportadoraId: string;
  vendedorId: string;

  // Novos campos
  custoFretePorSaca: number;
  valorCompraPorSaca: number;
  valorPorSacaArmazem: number;
  quemPagaArmazem: string;
  valorVendaPorSaca: number;
  nfe: string;
  valorNfe: number;
  observacao?: string;
  dataPrevistaPagamento?: string;
  dataEntrega?: string;

  // Configs
  valorImpostoPorSaca: number;
  comissaoLdPorSaca: number;
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

  getProdutorById(id: string): Observable<Produtor> {
    return this.http.get<Produtor>(`${this.baseUrl}/Produtores/${id}`);
  }

  createProdutor(produtor: any): Observable<Produtor> {
    return this.http.post<Produtor>(`${this.baseUrl}/Produtores`, produtor);
  }

  updateProdutor(id: string, produtor: any): Observable<Produtor> {
    return this.http.put<Produtor>(`${this.baseUrl}/Produtores/${id}`, produtor);
  }

  deleteProdutor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Produtores/${id}`);
  }

  // Transportadoras
  getTransportadoras(): Observable<Transportadora[]> {
    return this.http.get<Transportadora[]>(`${this.baseUrl}/Transportadoras`);
  }

  getTransportadoraById(id: string): Observable<Transportadora> {
    return this.http.get<Transportadora>(`${this.baseUrl}/Transportadoras/${id}`);
  }

  createTransportadora(transportadora: any): Observable<Transportadora> {
    return this.http.post<Transportadora>(`${this.baseUrl}/Transportadoras`, transportadora);
  }

  updateTransportadora(id: string, transportadora: any): Observable<Transportadora> {
    return this.http.put<Transportadora>(`${this.baseUrl}/Transportadoras/${id}`, transportadora);
  }

  deleteTransportadora(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Transportadoras/${id}`);
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/Clientes`);
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/Clientes/${id}`);
  }

  createCliente(cliente: any): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}/Clientes`, cliente);
  }

  updateCliente(id: string, cliente: any): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/Clientes/${id}`, cliente);
  }

  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Clientes/${id}`);
  }

  getContratosByCliente(clienteId: string): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/Contratos/by-cliente/${clienteId}`);
  }

  // Contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/Contratos`);
  }

  getContratoById(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/Contratos/${id}`);
  }

  createContrato(contrato: any): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.baseUrl}/Contratos`, contrato);
  }

  updateContrato(id: string, contrato: any): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.baseUrl}/Contratos/${id}`, contrato);
  }

  // Movimentacoes
  getMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.baseUrl}/Movimentacoes`);
  }

  getMovimentacoesByContrato(contratoId: string): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.baseUrl}/Movimentacoes/by-contrato/${contratoId}`);
  }

  getMovimentacoesByProdutor(produtorId: string): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.baseUrl}/Movimentacoes/by-produtor/${produtorId}`);
  }

  createMovimentacao(payload: CreateMovimentacaoPayload): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(`${this.baseUrl}/Movimentacoes`, payload);
  }

  deleteMovimentacao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Movimentacoes/${id}`);
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Dashboard/stats`);
  }

  // Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/Usuarios`);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuarios/${id}`);
  }

  createUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/Usuarios`, usuario);
  }

  updateUsuario(id: string, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/Usuarios/${id}`, usuario);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Usuarios/${id}`);
  }

  // Configuracoes
  getConfiguracao(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Configuracoes`);
  }

  updateConfiguracao(config: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Configuracoes`, config);
  }

  // BrasilAPI — Consulta de CNPJ
  getBrasilApiCNPJ(cnpj: string): Observable<any> {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    return this.http.get<any>(`${this.baseUrl}/BrasilApi/${cnpjLimpo}`);
  }
}
