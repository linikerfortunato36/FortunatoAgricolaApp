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

  p: number = 1;

  produtores: Produtor[] = [];
  isCompraModalOpen = false;
  compraSelecionado: Contrato | null = null;
  novaCompra = {
    produtorId: null as string | null,
    quantidadeCotaKg: null as number | null,
    valorCompraPorSaca: null as number | null
  };

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) { }

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
    this.p = 1;
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

  getFaltaComprar(c: Contrato): number {
    const totalCotas = (c.produtoresVinculados || []).reduce((s, p) => s + p.quantidadeCotaKg, 0);
    return Math.max(0, c.quantidadeTotalKg - totalCotas);
  }

  abrirCompraModal(contrato: Contrato): void {
    this.compraSelecionado = contrato;
    this.novaCompra = { produtorId: null, quantidadeCotaKg: null, valorCompraPorSaca: null };
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
    if (this.novaCompra.quantidadeCotaKg > maxPermitido) {
      Swal.fire('Erro', `A quantidade informada excede o limite disponível do contrato.\nFalta comprar no máximo ${maxPermitido.toLocaleString()} kg.`, 'error');
      return;
    }

    const c = this.compraSelecionado;
    const novosProdutores = c.produtoresVinculados ? [...c.produtoresVinculados] : [];

    // Check if produtor already exists
    const existente = novosProdutores.find(p => p.produtorId === this.novaCompra.produtorId);
    if (existente) {
      existente.quantidadeCotaKg += this.novaCompra.quantidadeCotaKg;
      existente.valorCompraPorSaca = this.novaCompra.valorCompraPorSaca;
    } else {
      novosProdutores.push({
        contratoId: c.id,
        produtorId: this.novaCompra.produtorId,
        produtorNome: '', // API vai preencher
        quantidadeCotaKg: this.novaCompra.quantidadeCotaKg,
        quantidadeEntregueKg: 0,
        quantidadeRestanteKg: this.novaCompra.quantidadeCotaKg,
        valorCompraPorSaca: this.novaCompra.valorCompraPorSaca
      });
    }

    const payload = {
      id: c.id,
      numeroContrato: c.numeroContrato,
      quantidadeTotalKg: c.quantidadeTotalKg,
      valorVendaPorSaca: c.valorVendaPorSaca,
      status: c.status,
      isActive: c.isActive,
      produtoresVinculados: novosProdutores.map(p => ({
        produtorId: p.produtorId,
        quantidadeCotaKg: p.quantidadeCotaKg,
        valorCompraPorSaca: p.valorCompraPorSaca
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

    const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
    doc.text(`Total de Contratos: ${contratos.length}    |    Total Acordado: ${fmt(totalKg)} kg    |    Total Entregue: ${fmt(entregueKg)} kg    |    Valor Total NF-e: ${fmtCurrency(totalNfe)}`, 18, yPos + 8);
    yPos += 22;

    // Iterate over Contracts
    contratos.forEach((c, idx) => {
      // Check page break
      if (yPos > pageH - 50) {
        doc.addPage();
        drawHeader();
        yPos = 35;
      }

      const totalCotas = (c.produtoresVinculados || []).reduce((s, p) => s + p.quantidadeCotaKg, 0);
      const faltaComprar = Math.max(0, c.quantidadeTotalKg - totalCotas);
      const faltaEntregar = c.quantidadeRestanteKg ?? 0;

      // Contract Title Box
      doc.setFillColor(26, 46, 28);
      doc.rect(14, yPos, pageW - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`CONTRATO Nº ${c.numeroContrato}  —  Cliente: ${c.clienteNome}`, 18, yPos + 5.5);
      doc.setFontSize(8);
      doc.text(`Status: ${c.status}`, pageW - 18, yPos + 5.5, { align: 'right' });
      yPos += 8;

      // Contract Info
      doc.setFillColor(250, 250, 250);
      doc.rect(14, yPos, pageW - 28, 10, 'F');
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      let xInfo = 18;
      doc.text(`Total Contrato: `, xInfo, yPos + 6); doc.setFont('helvetica', 'normal'); doc.text(`${fmt(c.quantidadeTotalKg)} kg`, xInfo + 23, yPos + 6);
      xInfo += 52;
      doc.setFont('helvetica', 'bold');
      doc.text(`Falta Comprar: `, xInfo, yPos + 6); doc.setTextColor(220, 38, 38); doc.text(`${fmt(faltaComprar)} kg`, xInfo + 24, yPos + 6); doc.setTextColor(50, 50, 50);
      xInfo += 48;
      doc.setFont('helvetica', 'bold');
      doc.text(`Entregue: `, xInfo, yPos + 6); doc.setFont('helvetica', 'normal'); doc.text(`${fmt(c.quantidadeEntregueKg)} kg`, xInfo + 15, yPos + 6);
      xInfo += 38;
      doc.setFont('helvetica', 'bold');
      doc.text(`Falta Entregar: `, xInfo, yPos + 6); doc.setTextColor(202, 138, 4); doc.text(`${fmt(faltaEntregar)} kg`, xInfo + 24, yPos + 6); doc.setTextColor(50, 50, 50);
      yPos += 14;

      if (c.produtoresVinculados && c.produtoresVinculados.length > 0) {
        const tCotas = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeCotaKg, 0);
        const tEntrg = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeEntregueKg, 0);
        const tFalta = c.produtoresVinculados.reduce((s, p) => s + p.quantidadeRestanteKg, 0);

        autoTable(doc, {
          startY: yPos,
          head: [['Produtor Original', 'Cota Comprada', 'Entregue', 'Falta Entregar', 'Valor de Compra (Sc)']],
          body: c.produtoresVinculados.map(p => [
            p.produtorNome,
            fmt(p.quantidadeCotaKg) + ' kg',
            fmt(p.quantidadeEntregueKg) + ' kg',
            fmt(p.quantidadeRestanteKg) + ' kg',
            fmtCurrency(p.valorCompraPorSaca ?? 0)
          ]),
          foot: [['TOTAIS', fmt(tCotas) + ' kg', fmt(tEntrg) + ' kg', fmt(tFalta) + ' kg', '']],
          styles: { fontSize: 7.5, cellPadding: 2, lineColor: [220, 220, 220], lineWidth: 0.1 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
          footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right', textColor: [202, 138, 4] },
            4: { halign: 'right', fontStyle: 'bold' }
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
