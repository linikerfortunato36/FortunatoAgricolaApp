import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Cliente, Produtor } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule, NgxPaginationModule],
  templateUrl: './contratos-list.component.html',
  styleUrl: './contratos-list.component.css'
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];
  clientes: Cliente[] = [];

  filtroStatus = 'Todos';
  filtroClienteId: string | null = null;
  filtroNumero = '';
  filtroDataEntrega: string = '';
  filtroDataLimiteProdutor: string = '';

  sortColumn: string = 'numeroContrato';
  sortDirection: 'asc' | 'desc' = 'asc';

  p: number = 1;

  produtores: Produtor[] = [];
  isCompraModalOpen = false;
  compraSelecionado: Contrato | null = null;
  novaCompra = {
    produtorId: null as string | null,
    quantidadeCotaKg: null as number | null,
    valorCompraPorSaca: null as number | null,
    dataFinalEntrega: null as string | null
  };

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) { }

  public Math = Math;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.filtroNumero = params['q'];
      }
    });

    this.carregarContratos();
    this.carregarClientes();
    this.carregarProdutores();
  }

  carregarProdutores(): void {
    this.apiService.getProdutores().subscribe(data => this.produtores = data.filter(p => p.isActive));
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
    this.filtroDataEntrega = '';
    this.filtroDataLimiteProdutor = '';
    this.p = 1;
  }

  getContratosFiltrados(): Contrato[] {
    let filtrados = this.contratos.filter(c => {
      const matchStatus = this.filtroStatus === 'Todos' || c.status === this.filtroStatus;
      const matchCliente = !this.filtroClienteId || c.clienteId === this.filtroClienteId;
      const matchNumero = !this.filtroNumero || c.numeroContrato.toLowerCase().includes(this.filtroNumero.toLowerCase());

      let matchData = true;
      if (this.filtroDataEntrega) {
        if (!c.dataFinalEntrega) {
          matchData = false;
        } else {
          const contractDate = new Date(c.dataFinalEntrega).toISOString().split('T')[0];
          matchData = contractDate <= this.filtroDataEntrega;
        }
      }

      let matchDataProdutor = true;
      if (this.filtroDataLimiteProdutor) {
        matchDataProdutor = (c.produtoresVinculados || []).some(p => {
          if (!p.dataFinalEntrega) return false;
          const pDate = new Date(p.dataFinalEntrega).toISOString().split('T')[0];
          return pDate <= this.filtroDataLimiteProdutor;
        });
      }

      return matchStatus && matchCliente && matchNumero && matchData && matchDataProdutor;
    });

    // Sorting
    return filtrados.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Handle special columns
      if (this.sortColumn === 'faltaComprar') {
        valA = this.getFaltaComprar(a);
        valB = this.getFaltaComprar(b);
      } else if (this.sortColumn === 'percentual') {
        valA = a.quantidadeTotalKg > 0 ? (a.quantidadeEntregueKg / a.quantidadeTotalKg) : 0;
        valB = b.quantidadeTotalKg > 0 ? (b.quantidadeEntregueKg / b.quantidadeTotalKg) : 0;
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const factor = this.sortDirection === 'asc' ? 1 : -1;
      return valA > valB ? factor : -factor;
    });
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.p = 1; // Reset to first page
  }

  getProgressoWidth(entregue: number, total: number): number {
    if (total === 0) return 0;
    return (entregue / total) * 100;
  }

  getFaltaComprar(c: Contrato): number {
    const totalCotas = (c.produtoresVinculados || []).reduce((s, p) => s + p.quantidadeCotaKg, 0);
    return c.quantidadeTotalKg - totalCotas;
  }

  abrirCompraModal(contrato: Contrato): void {
    this.compraSelecionado = contrato;
    this.novaCompra = { produtorId: null, quantidadeCotaKg: null, valorCompraPorSaca: null, dataFinalEntrega: null };
    this.isCompraModalOpen = true;
  }

  fecharCompraModal(): void {
    this.isCompraModalOpen = false;
    this.compraSelecionado = null;
  }

  salvarCompra(): void {
    if (!this.compraSelecionado || !this.novaCompra.produtorId || !this.novaCompra.quantidadeCotaKg || !this.novaCompra.valorCompraPorSaca) {
      Swal.fire('Erro', 'Preencha todos os campos.', 'error');
      return;
    }

    const maxPermitido = this.getFaltaComprar(this.compraSelecionado);
    const msgAviso = this.novaCompra.quantidadeCotaKg > maxPermitido && maxPermitido > 0
      ? `Atenção: A quantidade informada (${this.novaCompra.quantidadeCotaKg} kg) excede o limite disponível do contrato (${maxPermitido} kg). Este excedente será registrado.`
      : '';

    const c = this.compraSelecionado;
    const novosProdutores = c.produtoresVinculados ? [...c.produtoresVinculados] : [];

    // Check if produtor already exists
    const existente = novosProdutores.find(p => p.produtorId === this.novaCompra.produtorId);
    if (existente) {
      existente.quantidadeCotaKg += this.novaCompra.quantidadeCotaKg;
      existente.valorCompraPorSaca = this.novaCompra.valorCompraPorSaca;
      existente.dataFinalEntrega = this.novaCompra.dataFinalEntrega || undefined;
    } else {
      novosProdutores.push({
        contratoId: c.id,
        produtorId: this.novaCompra.produtorId,
        produtorNome: '', // API vai preencher
        quantidadeCotaKg: this.novaCompra.quantidadeCotaKg,
        quantidadeEntregueKg: 0,
        quantidadeRestanteKg: this.novaCompra.quantidadeCotaKg,
        valorCompraPorSaca: this.novaCompra.valorCompraPorSaca,
        dataFinalEntrega: this.novaCompra.dataFinalEntrega || undefined
      });
    }

    const payload = {
      id: c.id,
      numeroContrato: c.numeroContrato,
      quantidadeTotalKg: c.quantidadeTotalKg,
      valorVendaPorSaca: c.valorVendaPorSaca,
      status: c.status,
      isActive: c.isActive,
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
        Swal.fire('Sucesso', 'Vínculo de compra realizado com sucesso!', 'success');
        this.fecharCompraModal();
        this.carregarContratos();
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Erro', 'Falha ao salvar a compra.', 'error');
      }
    });
  }

  excluirContrato(id: string, numero: string): void {
    if (!this.authService.isAdminOrMaster()) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: `Isso apagará o contrato ${numero} permanentemente!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteContrato(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Contrato excluído.', 'success');
            this.carregarContratos();
          },
          error: (err) => {
            const msg = err.error?.Message || err.error?.message || 'Erro ao excluir contrato. Talvez já existam vinculações.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }

  exportarPDF(): void {
    const contratos = this.getContratosFiltrados();
    if (contratos.length === 0) return;

    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const agora = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    });

    const fmt = (n: number) => n.toLocaleString('pt-BR');
    const fmtCurrency = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // HEADER FUNCTION
    const drawHeader = () => {
      doc.setFillColor(26, 46, 28); // verde escuro
      doc.rect(0, 0, pageW, 25, 'F');
      doc.setTextColor(201, 168, 76); // dourado
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FORTUNATO AGRÍCOLA', 14, 11);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório Analítico de Contratos e Produtores', 14, 18);
      doc.setFontSize(8);
      doc.text(`Gerado em: ${agora}`, pageW - 14, 18, { align: 'right' });
    };

    drawHeader();
    let yPos = 32;

    // Resumo no topo
    const totalKg = contratos.reduce((s, c) => s + (c.quantidadeTotalKg ?? 0), 0);
    const entregueKg = contratos.reduce((s, c) => s + (c.quantidadeEntregueKg ?? 0), 0);
    const totalNfe = contratos.reduce((s, c) => s + (c.valorTotalNfe ?? 0), 0);

    doc.setFillColor(244, 241, 234);
    doc.roundedRect(14, yPos, pageW - 28, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 46, 28);
    doc.text(`Total de Contratos: ${contratos.length}    |    Total Acordado: ${fmt(totalKg)} Kg    |    Total Entregue: ${fmt(entregueKg)} Kg    |    Valor Total NF-e: ${fmtCurrency(totalNfe)}`, 18, yPos + 8);
    yPos += 22;

    // Iterate over Contracts
    contratos.forEach((c, idx) => {
      // Check page break
      if (yPos > pageH - 50) {
        doc.addPage();
        drawHeader();
        yPos = 35;
      }

      const faltaComprar = this.getFaltaComprar(c);
      const faltaEntregar = c.quantidadeRestanteKg ?? 0;

      // Contract Title Box
      doc.setFillColor(26, 46, 28);
      doc.rect(14, yPos, pageW - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`CONTRATO Nº ${c.numeroContrato}  —  Cliente: ${c.clienteNome}`, 18, yPos + 5.5);
      doc.setFontSize(8);
      const dataLimiteText = c.dataFinalEntrega ? new Date(c.dataFinalEntrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';
      doc.text(`Status: ${c.status} | Data Limite: ${dataLimiteText}`, pageW - 18, yPos + 5.5, { align: 'right' });
      yPos += 8;

      // Contract Info
      doc.setFillColor(250, 250, 250);
      doc.rect(14, yPos, pageW - 28, 10, 'F');
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      let xInfo = 18;
      doc.text(`Total Contrato: `, xInfo, yPos + 6); doc.setFont('helvetica', 'normal'); doc.text(`${fmt(c.quantidadeTotalKg)} Kg`, xInfo + 23, yPos + 6);
      xInfo += 52;

      if (faltaComprar < 0) {
        doc.setFont('helvetica', 'bold');
        doc.text(`Excedentes: `, xInfo, yPos + 6); doc.setTextColor(202, 138, 4); doc.text(`${fmt(Math.abs(faltaComprar))} Kg`, xInfo + 22, yPos + 6); doc.setTextColor(50, 50, 50);
      } else {
        doc.setFont('helvetica', 'bold');
        doc.text(`Falta Comprar: `, xInfo, yPos + 6); doc.setTextColor(220, 38, 38); doc.text(`${fmt(faltaComprar)} Kg`, xInfo + 24, yPos + 6); doc.setTextColor(50, 50, 50);
      }

      xInfo += 48;
      doc.setFont('helvetica', 'bold');
      doc.text(`Entregue: `, xInfo, yPos + 6); doc.setFont('helvetica', 'normal'); doc.text(`${fmt(c.quantidadeEntregueKg)} Kg`, xInfo + 15, yPos + 6);
      xInfo += 38;
      doc.setFont('helvetica', 'bold');
      doc.text(`Falta Entregar: `, xInfo, yPos + 6); doc.setTextColor(202, 138, 4); doc.text(`${fmt(faltaEntregar)} Kg`, xInfo + 24, yPos + 6); doc.setTextColor(50, 50, 50);
      yPos += 14;

      if (c.produtoresVinculados && c.produtoresVinculados.length > 0) {
        const tCotas = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeCotaKg, 0);
        const tEntrg = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeEntregueKg, 0);
        const tFalta = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeRestanteKg, 0);

        autoTable(doc, {
          startY: yPos,
          head: [['Produtor Original', 'Cota Comprada', 'Data Limite', 'Entregue', 'Falta Entregar', 'Valor de Compra (Sc)']],
          body: c.produtoresVinculados.map(p => [
            p.produtorNome,
            fmt(p.quantidadeCotaKg) + ' Kg',
            p.dataFinalEntrega ? new Date(p.dataFinalEntrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-',
            fmt(p.quantidadeEntregueKg) + ' Kg',
            fmt(p.quantidadeRestanteKg) + ' Kg',
            fmtCurrency(p.valorCompraPorSaca ?? 0)
          ]),
          foot: [['TOTAIS', fmt(tCotas) + ' Kg', '', fmt(tEntrg) + ' Kg', fmt(tFalta) + ' Kg', '']],
          styles: { fontSize: 7.5, cellPadding: 2, lineColor: [220, 220, 220], lineWidth: 0.1 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
          footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right', textColor: [202, 138, 4] },
            5: { halign: 'right', fontStyle: 'bold' }
          },
          margin: { left: 16, right: 16 }
        });
        yPos = (doc as any).lastAutoTable.finalY + 12;
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('Nenhum produtor vinculado a este contrato.', 18, yPos);
        yPos += 10;
      }
    });

    // ---- Rodapé ----
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(26, 46, 28);
      doc.rect(0, pageH - 8, pageW, 8, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(201, 168, 76);
      doc.text('Fortunato Agrícola — Documento gerado automaticamente pelo sistema', 14, pageH - 3);
      doc.setTextColor(255, 255, 255);
      doc.text(`Pág. ${i} / ${pageCount}`, pageW - 14, pageH - 3, { align: 'right' });
    }

    const dataStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`resumo_contratos_${dataStr}.pdf`);
  }
}
