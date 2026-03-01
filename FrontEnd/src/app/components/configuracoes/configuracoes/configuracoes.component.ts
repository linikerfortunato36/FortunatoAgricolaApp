import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent implements OnInit {
  config: any = {
    razaoSocial: '',
    cnpj: '',
    margemLucro: 0,
    toleranciaQuebraPeso: 0,
    toleranciaUmidade: 0,
    valorBaseComissaoVendaPorSaca: 0,
    porcentagemImposto: 0
  };

  loading = true;
  success = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.apiService.getConfiguracao().subscribe({
      next: (data) => {
        if (data) this.config = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save(): void {
    this.apiService.updateConfiguracao(this.config).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.success = false, 3000);
      }
    });
  }
}
