import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Movimentacao, Produtor, ContratoProdutor } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-contrato-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule, NgSelectModule],
  templateUrl: './contrato-detalhe.component.html',
  styleUrl: './contrato-detalhe.component.css'
})
export class ContratoDetalheComponent implements OnInit {
  contrato: Contrato | null = null;
  movimentacoes: Movimentacao[] = [];
  contratoId: string = '';
  selectedMovimentacao: Movimentacao | null = null;
  configuracao: any = null;
  p_mov: number = 1;
  produtores: Produtor[] = [];
  isCompraModalOpen = false;
  isEditVinculo = false;
  activeProducerMenu: string | null = null;
  novaCompra = {
    produtorId: null as string | null,
    quantidadeCotaKg: null as number | null,
    valorCompraPorSaca: null as number | null,
    dataFinalEntrega: null as string | null
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contratoId = id;
      this.carregarContrato();
      this.carregarMovimentacoes();
      this.carregarConfiguracao();
      this.carregarProdutores();
    }
  }

  carregarProdutores(): void {
    this.apiService.getProdutores().subscribe(data => this.produtores = data.filter(p => p.isActive));
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

    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
    const c = this.contrato!;
    const movs = this.movimentacoes;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        const agora = new Date().toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
        });
        const fmt = (n: number) => (n ?? 0).toLocaleString('pt-BR');
        const fmtR = (n: number) => (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const fmtD = (s: string) => s ? new Date(s).toLocaleDateString('pt-BR') : '-';

        // ── CABEÇALHO ──────────────────────────────────
        doc.setFillColor(26, 46, 28);
        doc.rect(0, 0, pageW, 36, 'F');
        doc.setFillColor(201, 168, 76);
        doc.rect(0, 36, pageW, 3, 'F');

        doc.setTextColor(201, 168, 76);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('FORTUNATO AGRIC\u00d3OLA', 14, 15);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Fechamento de Contrato \u2014 Relat\u00f3rio Detalhado', 14, 25);
        doc.text(`Emitido em: ${agora}`, 14, 32);

        // badge contrato
        doc.setFillColor(201, 168, 76);
        doc.roundedRect(pageW - 82, 6, 68, 24, 3, 3, 'F');
        doc.setTextColor(26, 46, 28);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('N\u00ba CONTRATO', pageW - 48, 14, { align: 'center' });
        doc.setFontSize(13);
        doc.text(c.numeroContrato, pageW - 48, 24, { align: 'center' });

        // ── INFO DO CONTRATO ────────────────────────────
        let y = 46;
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMA\u00c7\u00d5ES DO CONTRATO', 14, y);
        doc.setFillColor(201, 168, 76);
        doc.rect(14, y + 2, 55, 0.5, 'F');
        y += 8;

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, pageW - 28, 22, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(14, y, pageW - 28, 22, 3, 3, 'S');

        const faltaComprar = this.getFaltaComprar();
        const infoL = [
          { label: 'CLIENTE DESTINO', val: c.clienteNome, x: 16, w: 55 },
          { label: 'STATUS', val: c.status, x: 75, w: 30 },
          { label: 'TOTAL ACORDADO', val: `${fmt(c.quantidadeTotalKg)} Kg`, x: 110, w: 35 },
          { label: 'FRETE COTADO', val: `${fmtR(c.valorFreteCotado || 0)} / Sc`, x: 160, w: 35 },
          { label: 'ENTREGUE', val: `${fmt(c.quantidadeEntregueKg)} Kg`, x: 210, w: 35 },
          { label: 'RESTANTE', val: `${fmt(c.quantidadeRestanteKg)} Kg`, x: 250, w: 35 },
        ];
        infoL.forEach(info => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(100, 116, 139);
          doc.text(info.label, info.x, y + 6);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 41, 59);
          if (info.label === 'STATUS') {
            const sc: Record<string, [number, number, number]> = {
              'Aberto': [37, 99, 235], 'Em Andamento': [202, 138, 4], 'Finalizado': [22, 163, 74]
            };
            const [sr, sg, sb] = sc[c.status] ?? [100, 100, 100];
            doc.setFillColor(sr, sg, sb);
            doc.roundedRect(info.x, y + 8, 30, 7, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.text(c.status, info.x + 15, y + 13, { align: 'center' });
          } else {
            if (info.label === 'ENTREGUE') doc.setTextColor(22, 163, 74);
            if (info.label === 'RESTANTE' || info.label === 'FALTA COMPRAR') doc.setTextColor(220, 38, 38);
            doc.text(info.val, info.x, y + 14);
          }
        });
        y += 28;

        // ── KPI CARDS ──────────────────────────────────
        const totalVenda = movs.reduce((s, m) => s + (m.valorTotalVenda || 0), 0);
        const totalCompra = movs.reduce((s, m) => s + (m.valorTotalCompra || 0), 0);
        const totalFrete = movs.reduce((s, m) => s + (m.valorTotalFrete || 0), 0);
        const totalArmazem = movs.reduce((s, m) => s + (m.valorTotalArmazem || 0), 0);
        const ganhoBruto = movs.reduce((s, m) => s + (m.ganhoBruto || 0), 0);
        const imposto = movs.reduce((s, m) => s + (m.imposto || 0), 0);
        const comissao = movs.reduce((s, m) => s + (m.totalComissaoLd || 0), 0);
        const totalDifFrete = movs.reduce((s, m) => s + (m.diferencaFrete * m.quantidadeSacas || 0), 0);
        const ganhoLiquido = movs.reduce((s, m) => s + (m.ganhoLiquido || 0), 0);
        const totalSacas = movs.reduce((s, m) => s + (m.quantidadeSacas || 0), 0);
        const totalKgFinal = movs.reduce((s, m) => s + (m.pesoFinal || 0), 0);
        const totalNfe = movs.reduce((s, m) => s + (m.valorNfe || 0), 0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text('RESUMO FINANCEIRO', 14, y);
        doc.setFillColor(201, 168, 76);
        doc.rect(14, y + 2, 55, 0.5, 'F');
        y += 8;

        type RGB = [number, number, number];
        const kpis: { label: string; value: string; color: RGB }[] = [
          { label: 'TOTAL VENDAS', value: fmtR(totalVenda), color: [22, 163, 74] },
          { label: 'CUSTO COMPRA', value: fmtR(totalCompra), color: [220, 38, 38] },
          { label: 'FRETE TOTAL', value: fmtR(totalFrete), color: [37, 99, 235] },
          { label: 'ARMAZEM TOTAL', value: fmtR(totalArmazem), color: [202, 138, 4] },
          { label: 'GANHO BRUTO', value: fmtR(ganhoBruto), color: [22, 163, 74] },
          { label: 'IMPOSTOS', value: fmtR(imposto), color: [220, 38, 38] },
          { label: 'COMISS\u00c3O LD', value: fmtR(comissao), color: [139, 92, 246] },
          { label: 'DIFEREN\u00c7A FRETE', value: fmtR(totalDifFrete), color: totalDifFrete >= 0 ? [22, 163, 74] : [220, 38, 38] },
          { label: 'GANHO L\u00cdQUIDO', value: fmtR(ganhoLiquido), color: [22, 163, 74] },
        ];

        const cardW = (pageW - 28 - kpis.length * 3) / kpis.length;
        kpis.forEach((kpi, i) => {
          const cx = 14 + i * (cardW + 3);
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(cx, y, cardW, 20, 2, 2, 'F');
          doc.setFillColor(...kpi.color);
          doc.rect(cx, y, 2.5, 20, 'F');
          doc.setFontSize(5.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(100, 116, 139);
          doc.text(kpi.label, cx + 5, y + 7);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...kpi.color);
          doc.text(kpi.value, cx + 5, y + 15);
        });
        y += 26;

        // barra de resumo
        doc.setFillColor(26, 46, 28);
        doc.roundedRect(14, y, pageW - 28, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`${movs.length} viagens`, 20, y + 6.5);
        doc.text(`${fmt(totalSacas)} Sacas`, 60, y + 6.5);
        doc.text(`Peso Final: ${fmt(totalKgFinal)} Kg`, 110, y + 6.5);
        doc.text(`NF-e Emitidas: ${fmtR(totalNfe)}`, 190, y + 6.5);
        const pct = c.quantidadeTotalKg > 0 ? ((c.quantidadeEntregueKg / c.quantidadeTotalKg) * 100).toFixed(1) : '0.0';
        doc.text(`Conclus\u00e3o: ${pct}%`, 255, y + 6.5);
        y += 16;

        // ── PRODUTORES VINCULADOS ──────────────────────
        if (c.produtoresVinculados && c.produtoresVinculados.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text('PRODUTORES PARTICIPANTES (COTAS)', 14, y);
          doc.setFillColor(201, 168, 76);
          doc.rect(14, y + 2, 70, 0.5, 'F');
          y += 7;

          autoTable(doc, {
            startY: y,
            head: [['Produtor', 'Cota Total', 'Data Limite', 'Entregue', 'Faltante / Restante', 'Conclus\u00e3o']],
            body: c.produtoresVinculados.map(p => {
              const pct = p.quantidadeCotaKg > 0 ? ((p.quantidadeEntregueKg / p.quantidadeCotaKg) * 100).toFixed(1) : '0.0';
              return [
                p.produtorNome || '-',
                fmt(p.quantidadeCotaKg) + ' Kg',
                p.dataFinalEntrega ? new Date(p.dataFinalEntrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-',
                fmt(p.quantidadeEntregueKg) + ' Kg',
                fmt(p.quantidadeRestanteKg) + ' Kg',
                `${pct}%`
              ];
            }),
            styles: { fontSize: 7, cellPadding: 2.5, valign: 'middle', lineColor: [226, 232, 240], lineWidth: 0.25 },
            headStyles: { fillColor: [26, 46, 28], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: {
              1: { halign: 'right' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right', textColor: [220, 38, 38], fontStyle: 'bold' }, 5: { halign: 'center', fontStyle: 'bold' }
            },
            margin: { left: 14, right: 14 },
          });

          y = (doc as any).lastAutoTable.finalY + 12;
        }

        // ── TABELA DE MOVIMENTAÇÕES ────────────────────
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text('MOVIMENTA\u00c7\u00d5ES DETALHADAS', 14, y);
        doc.setFillColor(201, 168, 76);
        doc.rect(14, y + 2, 70, 0.5, 'F');
        y += 7;

        autoTable(doc, {
          startY: y,
          head: [[
            'Data', 'Produtor Origem', 'Transportadora', 'Motorista',
            'Kg Origem', 'Kg Desc.', 'KG Final',
            'Compra/sc', 'Venda/sc', 'Frete/sc', 'Dif. Frete',
            'Total Venda', 'G. L\u00edquido', 'NF-e'
          ]],
          body: movs.map(m => [
            fmtD(m.data),
            m.produtorOrigemNome || '-',
            m.transportadoraNome || '-',
            m.motorista || '-',
            fmt(m.quantidadeOrigemKg) + ' Kg',
            fmt(m.pesoDescargaKg) + ' Kg',
            fmt(m.pesoFinal) + ' Kg',
            fmtR(m.valorCompraPorSaca ?? 0),
            fmtR(m.valorVendaPorSaca ?? 0),
            fmtR(m.custoFretePorSaca ?? 0),
            fmtR(m.diferencaFrete ?? 0),
            fmtR(m.valorTotalVenda ?? 0),
            fmtR(m.ganhoLiquido ?? 0),
            m.nfe || '-'
          ]),
          foot: [[
            'TOTAIS', '', '', '',
            fmt(movs.reduce((s, m) => s + (m.quantidadeOrigemKg || 0), 0)) + ' Kg',
            fmt(movs.reduce((s, m) => s + (m.pesoDescargaKg || 0), 0)) + ' Kg',
            fmt(totalKgFinal) + ' Kg',
            '', '', '',
            fmtR(totalDifFrete),
            fmtR(totalVenda),
            fmtR(ganhoLiquido),
            ''
          ]],
          styles: { fontSize: 6.5, cellPadding: 2.5, valign: 'middle', lineColor: [226, 232, 240], lineWidth: 0.25 },
          headStyles: { fillColor: [26, 46, 28], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6, cellPadding: 3, halign: 'center' },
          footStyles: { fillColor: [26, 46, 28], textColor: [201, 168, 76], fontStyle: 'bold', fontSize: 6.5 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          columnStyles: {
            0: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
            1: { cellWidth: 22 }, 2: { cellWidth: 20 }, 3: { cellWidth: 18 },
            4: { halign: 'right' }, 5: { halign: 'right' },
            6: { halign: 'center' }, 7: { halign: 'center' },
            8: { halign: 'right', fontStyle: 'bold' }, 9: { halign: 'center' },
            10: { halign: 'right' }, 11: { halign: 'right' },
            12: { halign: 'right' }, 13: { halign: 'right' },
            14: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] },
            15: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] },
            16: { halign: 'center' }
          },
          margin: { left: 14, right: 14 },
          tableLineColor: [201, 168, 76],
          tableLineWidth: 0.4
        });

        // ── RODAP\u00c9 em todas as páginas ──────────────────
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFillColor(26, 46, 28);
          doc.rect(0, pageH - 9, pageW, 9, 'F');
          doc.setFontSize(6.5);
          doc.setTextColor(201, 168, 76);
          doc.text(`Fortunato Agr\u00edcola \u2014 Fechamento ${c.numeroContrato} \u2014 Documento gerado automaticamente`, 14, pageH - 3);
          doc.setTextColor(255, 255, 255);
          doc.text(`P\u00e1g. ${i} / ${pageCount}`, pageW - 14, pageH - 3, { align: 'right' });
        }

    const dataStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`Fechamento_${c.numeroContrato.replace(/\//g, '-')}_${dataStr}.pdf`);
  }

  getProgressoPct(): number {
    if (!this.contrato || this.contrato.quantidadeTotalKg === 0) return 0;
    return (this.contrato.quantidadeEntregueKg / this.contrato.quantidadeTotalKg) * 100;
  }

  getFaltaComprar(): number {
    if (!this.contrato) return 0;
    const totalCotas = (this.contrato.produtoresVinculados || []).reduce((s, p) => s + p.quantidadeCotaKg, 0);
    return Math.max(0, this.contrato.quantidadeTotalKg - totalCotas);
  }

  // --- MÉTODOS DE COMPRA / VÍNCULO ---
  abrirCompraModal(): void {
    this.isEditVinculo = false;
    this.novaCompra = { produtorId: null, quantidadeCotaKg: null, valorCompraPorSaca: null, dataFinalEntrega: null };
    this.isCompraModalOpen = true;
  }

  editarVinculo(p: ContratoProdutor): void {
    this.isEditVinculo = true;
    this.novaCompra = {
      produtorId: p.produtorId,
      quantidadeCotaKg: p.quantidadeCotaKg,
      valorCompraPorSaca: p.valorCompraPorSaca || null,
      dataFinalEntrega: p.dataFinalEntrega ? new Date(p.dataFinalEntrega).toISOString().split('T')[0] : null
    };
    this.isCompraModalOpen = true;
  }

  fecharCompraModal(): void {
    this.isCompraModalOpen = false;
  }

  salvarCompra(): void {
    if (!this.contrato || !this.novaCompra.produtorId || !this.novaCompra.quantidadeCotaKg || !this.novaCompra.valorCompraPorSaca) {
      Swal.fire('Erro', 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const c = this.contrato;
    const novosProdutores = c.produtoresVinculados ? [...c.produtoresVinculados] : [];

    if (this.isEditVinculo) {
      const idx = novosProdutores.findIndex(p => p.produtorId === this.novaCompra.produtorId);
      if (idx !== -1) {
        novosProdutores[idx].quantidadeCotaKg = this.novaCompra.quantidadeCotaKg;
        novosProdutores[idx].valorCompraPorSaca = this.novaCompra.valorCompraPorSaca;
        novosProdutores[idx].dataFinalEntrega = this.novaCompra.dataFinalEntrega || undefined;
      }
    } else {
      const existente = novosProdutores.find(p => p.produtorId === this.novaCompra.produtorId);
      if (existente) {
        existente.quantidadeCotaKg += this.novaCompra.quantidadeCotaKg;
        existente.valorCompraPorSaca = this.novaCompra.valorCompraPorSaca;
        existente.dataFinalEntrega = this.novaCompra.dataFinalEntrega || undefined;
      } else {
        novosProdutores.push({
          contratoId: c.id,
          produtorId: this.novaCompra.produtorId,
          produtorNome: '',
          quantidadeCotaKg: this.novaCompra.quantidadeCotaKg,
          quantidadeEntregueKg: 0,
          quantidadeRestanteKg: this.novaCompra.quantidadeCotaKg,
          valorCompraPorSaca: this.novaCompra.valorCompraPorSaca,
          dataFinalEntrega: this.novaCompra.dataFinalEntrega || undefined
        });
      }
    }

    const payload = {
      id: c.id,
      numeroContrato: c.numeroContrato,
      quantidadeTotalKg: c.quantidadeTotalKg,
      valorVendaPorSaca: c.valorVendaPorSaca,
      status: c.status,
      isActive: c.isActive,
      dataFinalEntrega: c.dataFinalEntrega,
      valorFreteCotado: c.valorFreteCotado,
      produtoresVinculados: novosProdutores.map(p => ({
        produtorId: p.produtorId,
        quantidadeCotaKg: p.quantidadeCotaKg,
        valorCompraPorSaca: p.valorCompraPorSaca,
        dataFinalEntrega: p.dataFinalEntrega
      }))
    };

    this.apiService.updateContrato(c.id, payload).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Vínculo salvo com sucesso!', 'success');
        this.fecharCompraModal();
        this.carregarContrato();
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Erro', 'Falha ao salvar o vínculo.', 'error');
      }
    });
  }

  excluirVinculo(produtorId: string): void {
    if (!this.contrato) return;

    Swal.fire({
      title: 'Remover Vínculo?',
      text: 'O produtor será removido deste contrato. Movimentações existentes não serão apagadas, mas perderão a referência de cota.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const c = this.contrato!;
        const novosProdutores = (c.produtoresVinculados || []).filter(p => p.produtorId !== produtorId);

        const payload = {
          id: c.id,
          numeroContrato: c.numeroContrato,
          quantidadeTotalKg: c.quantidadeTotalKg,
          valorVendaPorSaca: c.valorVendaPorSaca,
          status: c.status,
          isActive: c.isActive,
          dataFinalEntrega: c.dataFinalEntrega,
          valorFreteCotado: c.valorFreteCotado,
          produtoresVinculados: novosProdutores.map(p => ({
            produtorId: p.produtorId,
            quantidadeCotaKg: p.quantidadeCotaKg,
            valorCompraPorSaca: p.valorCompraPorSaca,
            dataFinalEntrega: p.dataFinalEntrega
          }))
        };

        this.apiService.updateContrato(c.id, payload).subscribe({
          next: () => {
            Swal.fire('Removido!', 'Vínculo removido.', 'success');
            this.carregarContrato();
          },
          error: () => Swal.fire('Erro', 'Falha ao remover vínculo.', 'error')
        });
      }
    });
  }

  toggleProducerMenu(id: string): void {
    this.activeProducerMenu = this.activeProducerMenu === id ? null : id;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeProducerMenu = null;
  }
}
