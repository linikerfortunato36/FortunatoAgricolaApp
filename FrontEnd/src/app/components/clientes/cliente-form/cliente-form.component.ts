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
  activeTab = 'form'; // 'boards' ou 'form'
  contratos: any[] = [];

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
