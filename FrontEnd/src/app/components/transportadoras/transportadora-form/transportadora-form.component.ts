import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Transportadora } from '../../../services/api.service';

@Component({
  selector: 'app-transportadora-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './transportadora-form.component.html',
  styleUrl: './transportadora-form.component.css'
})
export class TransportadoraFormComponent implements OnInit {
  isEditing = false;
  transportadoraId: string | null = null;

  transportadora: any = {
    nome: '',
    cpfCnpj: '',
    inscricaoEstadual: '',
    cep: '',
    logradouro: '',
    estado: 'MT',
    isActive: true
  };

  loading = false;
  submitting = false;
  cnpjCarregando = false;
  cnpjErro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.transportadoraId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.transportadoraId;

    if (this.isEditing && this.transportadoraId) {
      this.loading = true;
      this.apiService.getTransportadoraById(this.transportadoraId).subscribe({
        next: (data) => {
          this.transportadora = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  buscarCnpj(): void {
    const cnpj = (this.transportadora.cpfCnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    this.cnpjCarregando = true;
    this.cnpjErro = '';
    this.apiService.getBrasilApiCNPJ(cnpj).subscribe({
      next: (data: any) => {
        if (data) {
          if (data.razaoSocial || data.razao_social) this.transportadora.nome = data.razaoSocial ?? data.razao_social;
          if (data.email) this.transportadora.email = data.email;
          if (data.cep) this.transportadora.cep = data.cep;
          if (data.logradouro) this.transportadora.logradouro = data.logradouro;
          if (data.numero) this.transportadora.numero = data.numero;
          if (data.bairro) this.transportadora.bairro = data.bairro;
          if (data.municipio || data.cidade) this.transportadora.cidade = data.municipio ?? data.cidade;
          if (data.uf || data.estado) this.transportadora.estado = data.uf ?? data.estado;
        }
        this.cnpjCarregando = false;
      },
      error: () => {
        this.cnpjErro = 'CNPJ não encontrado ou inválido.';
        this.cnpjCarregando = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.transportadora.nome || !this.transportadora.cpfCnpj) {
      alert('Nome e CPF/CNPJ são obrigatórios.');
      return;
    }

    this.submitting = true;
    if (this.isEditing && this.transportadoraId) {
      this.apiService.updateTransportadora(this.transportadoraId, this.transportadora).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/transportadoras']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.apiService.createTransportadora(this.transportadora).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/transportadoras']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
}
