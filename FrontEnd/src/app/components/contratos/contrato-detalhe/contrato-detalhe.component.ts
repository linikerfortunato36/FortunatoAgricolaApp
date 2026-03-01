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
    }
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

        doc.setFontSize(18);
        doc.text(`FECHAMENTO DE CONTRATO - ${c.numeroContrato}`, 14, 22);

        doc.setFontSize(12);
        doc.text(`Cliente: ${c.clienteNome}`, 14, 32);
        doc.text(`Status: ${c.status}`, 14, 38);

        doc.text(`Total Negociado: ${c.quantidadeTotalKg.toLocaleString('pt-BR')} Kg`, 150, 32);
        doc.text(`Total Entregue: ${c.quantidadeEntregueKg.toLocaleString('pt-BR')} Kg`, 150, 38);

        autoTable.default(doc, {
          startY: 45,
          head: [['Data', 'Produtor', 'De (Kg)', 'Quebra', 'Final', 'NF-e', 'Venda']],
          body: this.movimentacoes.map(m => [
            new Date(m.data).toLocaleDateString('pt-BR'),
            m.produtorOrigemNome,
            m.quantidadeOrigemKg.toLocaleString('pt-BR'),
            m.diferencaPesoKg.toLocaleString('pt-BR'),
            m.pesoFinal.toLocaleString('pt-BR'),
            m.nfe || '-',
            m.valorTotalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          ])
        });

        doc.save(`Fechamento_${c.numeroContrato.replace('/', '-')}.pdf`);
      });
    });
  }

  getProgressoPct(): number {
    if (!this.contrato || this.contrato.quantidadeTotalKg === 0) return 0;
    return (this.contrato.quantidadeEntregueKg / this.contrato.quantidadeTotalKg) * 100;
  }
}
