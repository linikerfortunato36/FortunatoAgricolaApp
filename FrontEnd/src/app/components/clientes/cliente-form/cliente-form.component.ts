import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Cliente } from '../../../services/api.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  isEditing = false;
  clienteId: string | null = null;

  cliente: any = {
    nome: '',
    cnpj: '',
    inscricaoEstadual: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'MT',
    isActive: true
  };

  loading = false;
  submitting = false;
  activeTab = 'form';
  contratos: any[] = [];
  cnpjCarregando = false;
  cnpjErro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.clienteId;

    if (this.isEditing && this.clienteId) {
      this.activeTab = 'boards'; // Aba padrão quando editando
      this.loading = true;
      this.apiService.getClienteById(this.clienteId).subscribe({
        next: (data) => {
          this.cliente = data;
          this.loading = false;
          this.loadContratos();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.activeTab = 'form'; // Somente formulário na inserção
    }
  }

  loadContratos(): void {
    if (this.clienteId) {
      this.apiService.getContratosByCliente(this.clienteId).subscribe(data => {
        this.contratos = data;
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  buscarCnpj(): void {
    const cnpj = (this.cliente.cnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return; // só CNPJ tem 14 dígitos
    this.cnpjCarregando = true;
    this.cnpjErro = '';
    this.apiService.getBrasilApiCNPJ(cnpj).subscribe({
      next: (data: any) => {
        if (data) {
          if (data.razaoSocial || data.razao_social) this.cliente.nome = data.razaoSocial ?? data.razao_social;
          if (data.email) this.cliente.email = data.email;
          if (data.cep) this.cliente.cep = data.cep;
          if (data.logradouro) this.cliente.logradouro = data.logradouro;
          if (data.numero) this.cliente.numero = data.numero;
          if (data.bairro) this.cliente.bairro = data.bairro;
          if (data.municipio || data.cidade) this.cliente.cidade = data.municipio ?? data.cidade;
          if (data.uf || data.estado) this.cliente.estado = data.uf ?? data.estado;
        }
        this.cnpjCarregando = false;
      },
      error: () => {
        this.cnpjErro = 'CNPJ não encontrado ou inválido.';
        this.cnpjCarregando = false;
      }
    });
  }

  getProgressoWidth(entregue: number, total: number): number {
    if (total === 0) return 0;
    return (entregue / total) * 100;
  }

  onSubmit(): void {
    if (!this.cliente.nome || !this.cliente.cnpj) {
      alert('Nome e CNPJ são obrigatórios.');
      return;
    }

    this.submitting = true;
    if (this.isEditing && this.clienteId) {
      this.apiService.updateCliente(this.clienteId, this.cliente).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/clientes']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.apiService.createCliente(this.cliente).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/clientes']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
}
