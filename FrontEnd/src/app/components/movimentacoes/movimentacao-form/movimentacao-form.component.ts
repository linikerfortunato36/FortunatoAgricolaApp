import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Produtor, Transportadora, CreateMovimentacaoPayload, Usuario } from '../../../services/api.service';
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
    umidadePorcentagem: 14.0,
    impurezaPorcentagem: 1.0,
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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
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

    this.apiService.getUsuarios().subscribe(data => {
      this.vendedores = data.filter(u => u.isActive);
    });

    this.apiService.getConfiguracao().subscribe(data => {
      if (data && data.length > 0) {
        this.config = data[0];
        // Preencher valores de configuração padrão
        this.form.valorImpostoPorSaca = this.config.valorImpostoPorSaca || 0;
        this.form.comissaoLdPorSaca = this.config.valorComissaoPorSaca || 0;
      }
    });
  }

  calcularDescontos(): void {
    if (this.form.pesoDescargaKg > 0) {
      // O usuário pediu que umidade e impureza em KG NÃO sejam calculados automaticamente?
      // "na tela de clientes, os valores de umidade e impurezas, não serão calculados automaticamente" -> Isso se refere a tela de CLIENTES (aquele board que eu fiz?)
      // Mas em "nova movimentação", ele listou: "umidade (em kg e %, sendo dois campos), impurezas (em kg e porcentagem, sendo dois campos)"
      // E disse "peso final (com descontos, calculado automaticamente)".
      // Geralmente KG = % * Peso. Vou manter o cálculo automático aqui na movimentação, a menos que ele queira manual.
      // Re-lendo: "na tela de clientes, os valores de umidade e impurezas, não serão calculados automaticamente"
      // No ClienteFormComponent eu não calculei umidade/impureza nos boards, apenas progresso de entrega.
      // Vou manter automatizado aqui na Movimentação para ajudar o usuário, mas permitindo edição.
      this.form.umidadeKg = parseFloat((this.form.pesoDescargaKg * (this.form.umidadePorcentagem / 100)).toFixed(2));
      this.form.impurezaKg = parseFloat((this.form.pesoDescargaKg * (this.form.impurezaPorcentagem / 100)).toFixed(2));
    }
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
