import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Cliente } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule],
  templateUrl: './contratos-list.component.html',
  styleUrl: './contratos-list.component.css'
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];
  clientes: Cliente[] = [];

  filtroStatus = 'Todos';
  filtroClienteId: string | null = null;
  filtroNumero = '';

  constructor(private apiService: ApiService, public authService: AuthService) { }

  ngOnInit(): void {
    this.carregarContratos();
    this.carregarClientes();
  }

  carregarContratos(): void {
    this.apiService.getContratos().subscribe(
      (data) => this.contratos = data,
      (error) => console.error('Erro ao buscar contratos:', error)
    );
  }

  carregarClientes(): void {
    this.apiService.getClientes().subscribe(data => this.clientes = data);
  }

  limparFiltros(): void {
    this.filtroStatus = 'Todos';
    this.filtroClienteId = null;
    this.filtroNumero = '';
  }

  getContratosFiltrados(): Contrato[] {
    return this.contratos.filter(c => {
      const matchStatus = this.filtroStatus === 'Todos' || c.status === this.filtroStatus;
      const matchCliente = !this.filtroClienteId || c.clienteId === this.filtroClienteId;
      const matchNumero = !this.filtroNumero || c.numeroContrato.toLowerCase().includes(this.filtroNumero.toLowerCase());
      return matchStatus && matchCliente && matchNumero;
    });
  }

  getProgressoWidth(entregue: number, total: number): number {
    if (total === 0) return 0;
    return (entregue / total) * 100;
  }

  exportarPDF(): void {
    const contratos = this.getContratosFiltrados();
    if (contratos.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const agora = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    });

    // ---- Cabeçalho ----
    doc.setFillColor(26, 46, 28); // verde escuro
    doc.rect(0, 0, pageW, 28, 'F');

    doc.setTextColor(201, 168, 76); // dourado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FORTUNATO AGRÍCOLA', 14, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Contratos', 14, 20);

    doc.setFontSize(8);
    doc.text(`Gerado em: ${agora}`, pageW - 14, 20, { align: 'right' });

    // ---- Filtros aplicados ----
    let yPos = 33;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const filtroTexto: string[] = [];
    if (this.filtroStatus !== 'Todos') filtroTexto.push(`Status: ${this.filtroStatus}`);
    if (this.filtroClienteId) {
      const cli = this.clientes.find(c => c.id === this.filtroClienteId);
      if (cli) filtroTexto.push(`Cliente: ${cli.nome}`);
    }
    if (this.filtroNumero) filtroTexto.push(`Nº Contrato: ${this.filtroNumero}`);

    if (filtroTexto.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros aplicados: ', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(filtroTexto.join(' | '), 50, yPos);
      yPos += 7;
    }

    // ---- Totalizadores ----
    const totalKg = contratos.reduce((s, c) => s + (c.quantidadeTotalKg ?? 0), 0);
    const entregueKg = contratos.reduce((s, c) => s + (c.quantidadeEntregueKg ?? 0), 0);
    const totalNfe = contratos.reduce((s, c) => s + (c.valorTotalNfe ?? 0), 0);

    const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const fmtCurrency = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Caixa de resumo
    doc.setFillColor(244, 241, 234);
    doc.roundedRect(14, yPos, pageW - 28, 16, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 46, 28);
    doc.text(`Total de Contratos: ${contratos.length}`, 20, yPos + 7);
    doc.text(`Total Acordado: ${fmt(totalKg)} kg`, 80, yPos + 7);
    doc.text(`Total Entregue: ${fmt(entregueKg)} kg`, 145, yPos + 7);
    doc.text(`Valor Total NF-e: ${fmtCurrency(totalNfe)}`, 210, yPos + 7);
    yPos += 21;

    // ---- Tabela ----
    const statusColors: Record<string, [number, number, number]> = {
      'Aberto': [37, 99, 235],
      'Em Andamento': [234, 179, 8],
      'Finalizado': [22, 163, 74]
    };

    autoTable(doc, {
      startY: yPos,
      head: [[
        'Nº Contrato', 'Cliente', 'Status', 'Produto',
        'Total (kg)', 'Entregue (kg)', 'Restante (kg)', 'Entregas',
        '% Entregue', 'Valor NF-e', 'Ativo'
      ]],
      body: contratos.map(c => [
        c.numeroContrato,
        c.clienteNome,
        c.status,
        (c as any).produto ?? '-',
        fmt(c.quantidadeTotalKg ?? 0) + ' kg',
        fmt(c.quantidadeEntregueKg ?? 0) + ' kg',
        fmt(c.quantidadeRestanteKg ?? 0) + ' kg',
        String(c.quantidadeEntregas ?? 0),
        ((c.percentualEntregue ?? 0).toFixed(1)) + '%',
        fmtCurrency(c.valorTotalNfe ?? 0),
        c.isActive ? 'Sim' : 'Não'
      ]),
      styles: {
        fontSize: 7.5,
        cellPadding: 3,
        valign: 'middle',
        lineColor: [226, 232, 240],
        lineWidth: 0.3
      },
      headStyles: {
        fillColor: [26, 46, 28],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [37, 99, 235] },
        9: { halign: 'right', fontStyle: 'bold' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right', textColor: [220, 38, 38] },
        7: { halign: 'center' },
        8: { halign: 'center' }
      },
      didDrawCell: (data: any) => {
        // Colorir a coluna de status
        if (data.section === 'body' && data.column.index === 2) {
          const status = String(data.cell.raw);
          const [r, g, b] = statusColors[status] ?? [100, 100, 100];
          doc.setFillColor(r, g, b);
          const x = data.cell.x + 1;
          const y = data.cell.y + data.cell.height / 2 - 3;
          doc.roundedRect(x, y, data.cell.width - 2, 6, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6.5);
          doc.text(status, x + (data.cell.width - 2) / 2, y + 4, { align: 'center' });
          doc.setTextColor(0, 0, 0);
        }
      },
      margin: { left: 14, right: 14 },
      tableLineColor: [201, 168, 76],
      tableLineWidth: 0.5
    });

    // ---- Rodapé ----
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(26, 46, 28);
      doc.rect(0, doc.internal.pageSize.getHeight() - 8, pageW, 8, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(201, 168, 76);
      doc.text('Fortunato Agrícola — Documento gerado automaticamente pelo sistema', 14, doc.internal.pageSize.getHeight() - 2.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Pág. ${i} / ${pageCount}`, pageW - 14, doc.internal.pageSize.getHeight() - 2.5, { align: 'right' });
    }

    const dataStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`contratos_${dataStr}.pdf`);
  }
}
