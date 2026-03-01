import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Movimentacao } from '../../../services/api.service';

@Component({
  selector: 'app-contrato-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contrato-detalhe.component.html',
  styleUrl: './contrato-detalhe.component.css'
})
export class ContratoDetalheComponent implements OnInit {
  contrato: Contrato | null = null;
  movimentacoes: Movimentacao[] = [];
  contratoId: string = '';
  selectedMovimentacao: Movimentacao | null = null;
  configuracao: any = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contratoId = id;
      this.carregarContrato();
      this.carregarMovimentacoes();
      this.carregarConfiguracao();
    }
  }

  carregarConfiguracao(): void {
    this.apiService.getConfiguracao().subscribe({
      next: (data) => this.configuracao = data,
      error: (error) => console.error('Erro ao buscar configuração:', error)
    });
  }

  carregarContrato(): void {
    this.apiService.getContratoById(this.contratoId).subscribe({
      next: (data) => this.contrato = data,
      error: (error) => console.error('Erro ao buscar contrato:', error)
    });
  }

  carregarMovimentacoes(): void {
    this.apiService.getMovimentacoesByContrato(this.contratoId).subscribe({
      next: (data) => this.movimentacoes = data,
      error: (error) => console.error('Erro ao buscar movimentações:', error)
    });
  }

  excluirMovimentacao(id: string): void {
    if (!confirm('Deseja excluir esta movimentação? O saldo do contrato será restaurado.')) return;
    this.apiService.deleteMovimentacao(id).subscribe({
      next: () => {
        this.carregarMovimentacoes();
        this.carregarContrato(); // Atualiza saldo do contrato
      },
      error: (err) => console.error('Erro ao excluir movimentação:', err)
    });
  }

  visualizarMovimento(m: Movimentacao): void {
    this.selectedMovimentacao = m;
  }

  fecharModal(): void {
    this.selectedMovimentacao = null;
  }

  exportarFechamento(): void {
    if (!this.contrato) return;

    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(autoTable => {
        const doc = new jsPDF.default();
        const c = this.contrato!;

        // Add Logo
        if (this.configuracao?.logoBase64) {
          try {
            // Assuming the logo is a base64 image (either data:image/... or just raw base64)
            // If it doesn't have the data URL prefix, one might be needed, but usually it's saved with it.
            let logoStr = this.configuracao.logoBase64;
            if (!logoStr.startsWith('data:image')) {
              logoStr = 'data:image/png;base64,' + logoStr;
            }
            // Adding a small logo at top right corner
            doc.addImage(logoStr, 'PNG', 150, 10, 40, 20, undefined, 'FAST');
          } catch (e) {
            console.error('Erro ao incluir logo', e);
          }
        }

        const dataAtual = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        doc.setFontSize(18);
        doc.text(`FECHAMENTO DE CONTRATO`, 14, 22);

        doc.setFontSize(12);
        doc.text(`Número do Contrato: ${c.numeroContrato}`, 14, 32);
        doc.text(`Cliente: ${c.clienteNome}`, 14, 38);
        doc.text(`Data e Hora: ${dataAtual}`, 14, 44);

        doc.text(`Total Negociado: ${c.quantidadeTotalKg.toLocaleString('pt-BR')} Kg`, 100, 32);
        doc.text(`Total Entregue: ${c.quantidadeEntregueKg.toLocaleString('pt-BR')} Kg`, 100, 38);
        doc.text(`Status Atual: ${c.status}`, 100, 44);

        // Calculate some totals
        const totalVenda = this.movimentacoes.reduce((sum, m) => sum + (m.valorTotalVenda || 0), 0);
        const totalCustoFrete = this.movimentacoes.reduce((sum, m) => sum + (m.valorTotalFrete || 0), 0);
        const totalNFes = this.movimentacoes.reduce((sum, m) => sum + (m.valorNfe || 0), 0);

        autoTable.default(doc, {
          startY: 55,
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          head: [['Data', 'Produtor/Transp.', 'Peso Limpo', 'Quebra', 'Valor Válido', 'NF-e']],
          styles: { fontSize: 8 },
          body: this.movimentacoes.map(m => [
            new Date(m.data).toLocaleDateString('pt-BR'),
            `P: ${m.produtorOrigemNome}\n T: ${m.transportadoraNome}\n M: ${m.motorista}`,
            `${m.quantidadeOrigemKg.toLocaleString('pt-BR')} Kg`,
            `${m.diferencaPesoKg.toLocaleString('pt-BR')} Kg (U: ${m.umidadePorcentagem}%, I: ${m.impurezaPorcentagem}%)`,
            `${m.pesoFinal.toLocaleString('pt-BR')} Kg -> ${m.valorTotalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            `${m.nfe || '-'}\n R$ ${m.valorNfe > 0 ? m.valorNfe.toLocaleString('pt-BR') : '0,00'}`
          ])
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Resumo Financeiro do Fechamento:`, 14, finalY);
        doc.text(`Faturamento (Total Vendas): ${totalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 6);
        doc.text(`Custo Estimado Frete: ${totalCustoFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 12);
        doc.text(`Total Emitido em NF-e: ${totalNFes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 18);

        doc.setFontSize(8);
        doc.text(`Gerado pelo sistema Fortunato Agrícola em ${dataAtual}.`, 14, 280);

        doc.save(`Fechamento_${c.numeroContrato.replace(/\//g, '-')}.pdf`);
      });
    });
  }

  getProgressoPct(): number {
    if (!this.contrato || this.contrato.quantidadeTotalKg === 0) return 0;
    return (this.contrato.quantidadeEntregueKg / this.contrato.quantidadeTotalKg) * 100;
  }
}

