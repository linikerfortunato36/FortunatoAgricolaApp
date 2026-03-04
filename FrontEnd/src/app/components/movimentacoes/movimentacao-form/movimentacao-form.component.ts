import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Produtor, Transportadora, CreateMovimentacaoPayload, Usuario } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-movimentacao-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgSelectModule],
  templateUrl: './movimentacao-form.component.html',
  styleUrl: './movimentacao-form.component.css'
})
export class MovimentacaoFormComponent implements OnInit {

  contratos: Contrato[] = [];
  produtores: Produtor[] = [];
  produtoresFiltrados: any[] = [];
  transportadoras: Transportadora[] = [];
  vendedores: Usuario[] = [];
  config: any;

  form: CreateMovimentacaoPayload = {
    data: new Date().toISOString().split('T')[0],
    contratoId: '',
    produtorOrigemId: '',
    quantidadeOrigemKg: 0,
    pesoDescargaKg: 0,
    umidadeKg: 0,
    impurezaKg: 0,
    umidadePorcentagem: 0,
    impurezaPorcentagem: 0,
    pesoLiquidofazenda: 0,
    motorista: '',
    transportadoraId: '',
    vendedorId: '',
    custoFretePorSaca: 0,
    valorCompraPorSaca: 0,
    valorPorSacaArmazem: 0,
    quemPagaArmazem: 'Nos',
    valorVendaPorSaca: 0,
    nfe: '',
    valorNfe: 0,
    valorImpostoPorSaca: 0,
    comissaoLdPorSaca: 0
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  // Propriedades Computadas
  get sacas(): number {
    return this.form.quantidadeOrigemKg / 60;
  }

  get pesoFinal(): number {
    return this.form.pesoDescargaKg - this.form.umidadeKg - this.form.impurezaKg;
  }

  get diferencaPeso(): number {
    return this.form.quantidadeOrigemKg - this.form.pesoDescargaKg;
  }

  get valorTotalFrete(): number {
    return this.sacas * this.form.custoFretePorSaca;
  }

  get valorTotalArmazem(): number {
    return this.sacas * this.form.valorPorSacaArmazem;
  }

  get totalCompra(): number {
    const custoProd = this.form.valorCompraPorSaca;
    const custoFrete = this.form.custoFretePorSaca;
    const custoArmazem = this.form.quemPagaArmazem === 'Nos' ? this.form.valorPorSacaArmazem : 0;
    return (custoProd + custoFrete + custoArmazem) * this.sacas;
  }

  get valorTotalVenda(): number {
    return this.sacas * this.form.valorVendaPorSaca;
  }

  get ganhoBruto(): number {
    return this.valorTotalVenda - this.totalCompra;
  }

  get imposto(): number {
    return this.sacas * this.form.valorImpostoPorSaca;
  }

  get comissaoLd(): number {
    return this.sacas * this.form.comissaoLdPorSaca;
  }

  get ganhoLiquido(): number {
    return this.ganhoBruto - this.imposto - this.comissaoLd;
  }

  get contratoSelecionado(): Contrato | undefined {
    return this.contratos.find(c => c.id === this.form.contratoId);
  }

  onContratoChange(): void {
    if (this.contratoSelecionado) {
      this.form.valorVendaPorSaca = this.contratoSelecionado.valorVendaPorSaca || 0;

      if (this.contratoSelecionado.produtoresVinculados) {
        const vinculadosIds = this.contratoSelecionado.produtoresVinculados.map(p => p.produtorId);
        this.produtoresFiltrados = this.produtores.filter(p => vinculadosIds.includes(p.id));

        // Clear selected produtor if not in the new filtered list
        if (this.form.produtorOrigemId && !vinculadosIds.includes(this.form.produtorOrigemId)) {
          this.form.produtorOrigemId = '';
        }
      } else {
        this.produtoresFiltrados = [];
        this.form.produtorOrigemId = '';
      }
    } else {
      this.form.valorVendaPorSaca = 0;
      this.produtoresFiltrados = [];
      this.form.produtorOrigemId = '';
    }

    this.updatePrecoCompra();
  }

  onProdutorOrigemChange(): void {
    this.updatePrecoCompra();
  }

  updatePrecoCompra(): void {
    const cota = this.cotaProdutorSelecionado;
    if (cota) {
      this.form.valorCompraPorSaca = cota.valorCompraPorSaca || 0;
    } else {
      this.form.valorCompraPorSaca = 0;
    }
  }

  get cotaProdutorSelecionado(): any {
    if (!this.form.produtorOrigemId || !this.contratoSelecionado || !this.contratoSelecionado.produtoresVinculados) return null;
    return this.contratoSelecionado.produtoresVinculados.find(p => p.produtorId === this.form.produtorOrigemId);
  }

  get remainingQuota(): number {
    const cota = this.cotaProdutorSelecionado;
    if (!cota) return 0;
    return cota.quantidadeCotaKg - cota.quantidadeEntregueKg;
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.canModify()) {
      this.router.navigate(['/app/contratos']);
      return;
    }
    const contratoId = this.route.snapshot.queryParamMap.get('contratoId');
    if (contratoId) {
      this.form.contratoId = contratoId;
    }

    this.apiService.getContratos().subscribe(data => {
      this.contratos = data.filter(c => c.status !== 'Finalizado' && c.isActive);
      this.updateProdutoresFiltrados();
    });

    this.apiService.getProdutores().subscribe(data => {
      this.produtores = data.filter(p => p.isActive);
      this.updateProdutoresFiltrados();
    });

    this.apiService.getTransportadoras().subscribe(data => {
      this.transportadoras = data.filter(t => t.isActive);
    });

    this.apiService.getUsuarios().subscribe(data => {
      this.vendedores = data.filter(u => u.isActive);
    });

    this.apiService.getConfiguracao().subscribe(data => {
      if (data) {
        // getConfiguracao retorna objeto único, não array
        const cfg = Array.isArray(data) ? data[0] : data;
        if (cfg) {
          this.config = cfg;
          this.form.valorImpostoPorSaca = cfg.valorImpostoPorSaca || 0;
          this.form.comissaoLdPorSaca = cfg.valorComissaoPorSaca || 0;
        }
      }
    });
  }

  updateProdutoresFiltrados(): void {
    if (this.contratos.length > 0 && this.produtores.length > 0 && this.form.contratoId) {
      this.onContratoChange();
    }
  }

  calcularDescontos(): void {
    // Cálculo automático desativado conforme solicitação do usuário.
    // O usuário prefere informar os valores de KG e % manualmente.
  }

  onSubmit(): void {
    if (!this.form.contratoId || !this.form.produtorOrigemId || !this.form.transportadoraId || !this.form.vendedorId) {
      this.submitError = 'Preencha todos os campos obrigatórios (Contrato, Produtor, Transportadora e Vendedor).';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.apiService.createMovimentacao(this.form).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
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
    if (this.form.contratoId) {
      this.router.navigate(['/app/contratos/detalhe', this.form.contratoId]);
    } else {
      this.router.navigate(['/app/contratos']);
    }
  }
}
