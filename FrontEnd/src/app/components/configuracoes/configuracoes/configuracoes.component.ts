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
    valorImpostoPorSaca: 0,
    valorComissaoPorSaca: 0,
    logoBase64: null as string | null
  };

  loading = true;
  success = false;

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.config.logoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.apiService.getConfiguracao().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.config = data[0];
        } else if (data && !Array.isArray(data)) {
          this.config = data;
        }
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
