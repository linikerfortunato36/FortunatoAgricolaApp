import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Produtor, Transportadora, CreateMovimentacaoPayload } from '../../../services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-movimentacao-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgSelectModule],
  templateUrl: './movimentacao-form.component.html',
  styleUrl: './movimentacao-form.component.css'
})
export class MovimentacaoFormComponent implements OnInit {

  // Lists for dropdowns
  contratos: Contrato[] = [];
  produtores: Produtor[] = [];
  transportadoras: Transportadora[] = [];

  // Form model
  form: CreateMovimentacaoPayload = {
    data: new Date().toISOString().split('T')[0],
    contratoId: '',
    produtorOrigemId: '',
    quantidadeOrigemKg: 0,
    pesoDescargaKg: 0,
    umidadeKg: 0,
    impurezaKg: 0,
    umidadePorcentagem: 14.0,
    impurezaPorcentagem: 1.0,
    pesoLiquidofazenda: 0,
    motorista: '',
    transportadoraId: ''
  };

  // UI state
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  // Computed from form
  get pesoFinalCalculado(): number {
    return this.form.pesoDescargaKg - this.form.umidadeKg - this.form.impurezaKg;
  }

  get diferencaPeso(): number {
    return this.form.quantidadeOrigemKg - this.form.pesoDescargaKg;
  }

  get contratoSelecionado(): Contrato | undefined {
    return this.contratos.find(c => c.id === this.form.contratoId);
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Pre-populate contratoId from query params if navigating from contrato detalhe
    const contratoId = this.route.snapshot.queryParamMap.get('contratoId');
    if (contratoId) {
      this.form.contratoId = contratoId;
    }

    this.apiService.getContratos().subscribe(data => {
      this.contratos = data.filter(c => c.status !== 'Finalizado' && c.isActive);
    });

    this.apiService.getProdutores().subscribe(data => {
      this.produtores = data.filter(p => p.isActive);
    });

    this.apiService.getTransportadoras().subscribe(data => {
      this.transportadoras = data.filter(t => t.isActive);
    });
  }

  // Auto-calculate umidade and impureza from percentages when peso changes
  calcularDescontos(): void {
    if (this.form.pesoDescargaKg > 0) {
      this.form.umidadeKg = parseFloat(
        (this.form.pesoDescargaKg * (this.form.umidadePorcentagem / 100)).toFixed(2)
      );
      this.form.impurezaKg = parseFloat(
        (this.form.pesoDescargaKg * (this.form.impurezaPorcentagem / 100)).toFixed(2)
      );
    }
  }

  onSubmit(): void {
    if (!this.form.contratoId || !this.form.produtorOrigemId || !this.form.transportadoraId) {
      this.submitError = 'Preencha todos os campos obrigatórios (Contrato, Produtor e Transportadora).';
      return;
    }
    if (this.form.pesoDescargaKg <= 0) {
      this.submitError = 'Informe o Peso de Descarga em Kg.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.apiService.createMovimentacao(this.form).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        // Navigate back to contrato detail after 2s
        setTimeout(() => {
          if (this.form.contratoId) {
            this.router.navigate(['/app/contratos/detalhe', this.form.contratoId]);
          } else {
            this.router.navigate(['/app/contratos']);
          }
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Erro ao registrar movimentação. Verifique os dados e tente novamente.';
        console.error(err);
      }
    });
  }

  cancelar(): void {
    const contratoId = this.form.contratoId;
    if (contratoId) {
      this.router.navigate(['/app/contratos/detalhe', contratoId]);
    } else {
      this.router.navigate(['/app/contratos']);
    }
  }
}
