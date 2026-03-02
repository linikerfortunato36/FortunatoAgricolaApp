import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Movimentacao, Contrato, Cliente, Produtor } from '../../services/api.service';
import { forkJoin } from 'rxjs';

interface VendedorComissao {
    vendedorNome: string;
    vendedorId: string;
    totalSacas: number;
    totalKg: number;
    totalVenda: number;
    totalCompra: number;
    comissaoTotal: number;
    numMovimentacoes: number;
}

interface BalancoContrato {
    contratoId: string;
    contratoNumero: string;
    clienteNome: string;
    totalSacas: number;
    totalKg: number;
    totalVenda: number;
    totalCompra: number;
    totalFrete: number;
    totalArmazem: number;
    totalNos: number;
    totalCliente: number;
    ganhoBruto: number;
    ganhoLiquido: number;
    numMovimentacoes: number;
}

interface BalancoProdutor {
    produtorNome: string;
    produtorId: string;
    totalSacas: number;
    totalKg: number;
    totalCompra: number;
    numMovimentacoes: number;
}

@Component({
    selector: 'app-relatorios',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './relatorios.component.html',
    styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent implements OnInit {

    // Dados brutos
    todasMovimentacoes: Movimentacao[] = [];
    todosContratos: Contrato[] = [];
    todosClientes: Cliente[] = [];
    todosProdutores: Produtor[] = [];

    loading = true;

    // Aba ativa
    abaAtiva: 'comissao' | 'custos' | 'contrato' | 'produtor' = 'comissao';

    // --- FILTROS COMISSÃO ---
    filtroComissaoMes = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    // --- FILTROS CUSTOS ---
    filtroCustosMes = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    // --- FILTROS BALANÇO POR CONTRATO ---
    filtroContratoClienteId = '';
    filtroContratoId = '';
    filtroContratoPeriodoInicio = '';
    filtroContratoPeriodoFim = '';

    // --- FILTROS BALANÇO POR PRODUTOR ---
    filtroProdutorId = '';
    filtroProdutorClienteId = '';
    filtroProdutorContratoId = '';
    filtroProdutorPeriodoInicio = '';
    filtroProdutorPeriodoFim = '';

    constructor(private api: ApiService) { }

    ngOnInit() {
        forkJoin({
            movimentacoes: this.api.getMovimentacoes(),
            contratos: this.api.getContratos(),
            clientes: this.api.getClientes(),
            produtores: this.api.getProdutores()
        }).subscribe({
            next: data => {
                this.todasMovimentacoes = data.movimentacoes;
                this.todosContratos = data.contratos;
                this.todosClientes = data.clientes;
                this.todosProdutores = data.produtores;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    // =====================
    // HELPERS
    // =====================
    private movsFiltradas(filtros: {
        mes?: string;
        clienteId?: string;
        contratoId?: string;
        produtorId?: string;
        inicio?: string;
        fim?: string;
    }): Movimentacao[] {
        return this.todasMovimentacoes.filter(m => {
            const data = new Date(m.data);
            if (filtros.mes) {
                const [ano, mes] = filtros.mes.split('-').map(Number);
                if (data.getFullYear() !== ano || data.getMonth() + 1 !== mes) return false;
            }
            if (filtros.inicio && new Date(m.data) < new Date(filtros.inicio)) return false;
            if (filtros.fim && new Date(m.data) > new Date(filtros.fim)) return false;
            if (filtros.contratoId && m.contratoId !== filtros.contratoId) return false;
            if (filtros.produtorId && m.produtorOrigemId !== filtros.produtorId) return false;
            if (filtros.clienteId) {
                const contrato = this.todosContratos.find(c => c.id === m.contratoId);
                if (!contrato || contrato.clienteId !== filtros.clienteId) return false;
            }
            return true;
        });
    }

    // =====================
    // RELATÓRIO COMISSÃO
    // =====================
    get comissaoVendedores(): VendedorComissao[] {
        const movs = this.movsFiltradas({ mes: this.filtroComissaoMes });
        const map = new Map<string, VendedorComissao>();
        for (const m of movs) {
            if (!map.has(m.vendedorId)) {
                map.set(m.vendedorId, {
                    vendedorId: m.vendedorId,
                    vendedorNome: m.vendedorNome || 'Sem Vendedor',
                    totalSacas: 0, totalKg: 0, totalVenda: 0,
                    totalCompra: 0, comissaoTotal: 0, numMovimentacoes: 0
                });
            }
            const v = map.get(m.vendedorId)!;
            v.totalSacas += m.quantidadeSacas;
            v.totalKg += m.pesoFinal;
            v.totalVenda += m.valorTotalVenda;
            v.totalCompra += m.valorTotalCompra;
            v.comissaoTotal += m.totalComissaoLd;
            v.numMovimentacoes++;
        }
        return Array.from(map.values()).sort((a, b) => b.comissaoTotal - a.comissaoTotal);
    }

    get comissaoTotais() {
        const v = this.comissaoVendedores;
        return {
            sacas: v.reduce((s, x) => s + x.totalSacas, 0),
            venda: v.reduce((s, x) => s + x.totalVenda, 0),
            comissao: v.reduce((s, x) => s + x.comissaoTotal, 0),
            movs: v.reduce((s, x) => s + x.numMovimentacoes, 0)
        };
    }

    // =====================
    // RELATÓRIO CUSTOS
    // =====================
    get custosMov(): Movimentacao[] {
        return this.movsFiltradas({ mes: this.filtroCustosMes });
    }

    get custosTotais() {
        const movs = this.custosMov;
        return {
            sacas: movs.reduce((s, m) => s + m.quantidadeSacas, 0),
            frete: movs.reduce((s, m) => s + m.valorTotalFrete, 0),
            armazemNos: movs.filter(m => m.quemPagaArmazem === 'Nos').reduce((s, m) => s + m.valorTotalArmazem, 0),
            armazemCliente: movs.filter(m => m.quemPagaArmazem !== 'Nos').reduce((s, m) => s + m.valorTotalArmazem, 0),
            totalCustos: movs.reduce((s, m) => s + m.valorTotalFrete + (m.quemPagaArmazem === 'Nos' ? m.valorTotalArmazem : 0), 0)
        };
    }

    get custosTransportadoras() {
        const movs = this.custosMov;
        const map = new Map<string, { nome: string; sacas: number; frete: number; viagens: number }>();
        for (const m of movs) {
            const key = m.transportadoraNome || 'Sem Transportadora';
            if (!map.has(key)) map.set(key, { nome: key, sacas: 0, frete: 0, viagens: 0 });
            const t = map.get(key)!;
            t.sacas += m.quantidadeSacas;
            t.frete += m.valorTotalFrete;
            t.viagens++;
        }
        return Array.from(map.values()).sort((a, b) => b.frete - a.frete);
    }

    // =====================
    // RELATÓRIO CONTRATO
    // =====================
    get balancoContratos(): BalancoContrato[] {
        const movs = this.movsFiltradas({
            clienteId: this.filtroContratoClienteId,
            contratoId: this.filtroContratoId,
            inicio: this.filtroContratoPeriodoInicio,
            fim: this.filtroContratoPeriodoFim
        });
        const map = new Map<string, BalancoContrato>();
        for (const m of movs) {
            if (!map.has(m.contratoId)) {
                map.set(m.contratoId, {
                    contratoId: m.contratoId,
                    contratoNumero: m.contratoNumero,
                    clienteNome: m.clienteNome,
                    totalSacas: 0, totalKg: 0,
                    totalVenda: 0, totalCompra: 0,
                    totalFrete: 0, totalArmazem: 0,
                    totalNos: 0, totalCliente: 0,
                    ganhoBruto: 0, ganhoLiquido: 0,
                    numMovimentacoes: 0
                });
            }
            const c = map.get(m.contratoId)!;
            c.totalSacas += m.quantidadeSacas;
            c.totalKg += m.pesoFinal;
            c.totalVenda += m.valorTotalVenda;
            c.totalCompra += m.valorTotalCompra;
            c.totalFrete += m.valorTotalFrete;
            c.totalArmazem += m.valorTotalArmazem;
            c.ganhoBruto += m.ganhoBruto;
            c.ganhoLiquido += m.ganhoLiquido;
            if (m.quemPagaArmazem === 'Nos') c.totalNos += m.valorTotalArmazem;
            else c.totalCliente += m.valorTotalArmazem;
            c.numMovimentacoes++;
        }
        return Array.from(map.values()).sort((a, b) => b.totalVenda - a.totalVenda);
    }

    get balancoContratosTotais() {
        const c = this.balancoContratos;
        return {
            sacas: c.reduce((s, x) => s + x.totalSacas, 0),
            venda: c.reduce((s, x) => s + x.totalVenda, 0),
            frete: c.reduce((s, x) => s + x.totalFrete, 0),
            armazem: c.reduce((s, x) => s + x.totalArmazem, 0),
            ganhoBruto: c.reduce((s, x) => s + x.ganhoBruto, 0),
            ganhoLiquido: c.reduce((s, x) => s + x.ganhoLiquido, 0),
        };
    }

    // =====================
    // RELATÓRIO PRODUTOR
    // =====================
    get balancoProdutor(): BalancoProdutor[] {
        const movs = this.movsFiltradas({
            produtorId: this.filtroProdutorId,
            clienteId: this.filtroProdutorClienteId,
            contratoId: this.filtroProdutorContratoId,
            inicio: this.filtroProdutorPeriodoInicio,
            fim: this.filtroProdutorPeriodoFim
        });
        const map = new Map<string, BalancoProdutor>();
        for (const m of movs) {
            if (!map.has(m.produtorOrigemId)) {
                map.set(m.produtorOrigemId, {
                    produtorId: m.produtorOrigemId,
                    produtorNome: m.produtorOrigemNome || 'Sem Produtor',
                    totalSacas: 0, totalKg: 0, totalCompra: 0, numMovimentacoes: 0
                });
            }
            const p = map.get(m.produtorOrigemId)!;
            p.totalSacas += m.quantidadeSacas;
            p.totalKg += m.pesoFinal;
            p.totalCompra += m.valorTotalCompra;
            p.numMovimentacoes++;
        }
        return Array.from(map.values()).sort((a, b) => b.totalKg - a.totalKg);
    }

    get balancoProdutor_Totais() {
        const p = this.balancoProdutor;
        return {
            sacas: p.reduce((s, x) => s + x.totalSacas, 0),
            kg: p.reduce((s, x) => s + x.totalKg, 0),
            compra: p.reduce((s, x) => s + x.totalCompra, 0),
        };
    }

    // Contratos filtrados por cliente (para o dropdown dependente)
    get contratosPorCliente(): Contrato[] {
        if (!this.filtroContratoClienteId) return this.todosContratos;
        return this.todosContratos.filter(c => c.clienteId === this.filtroContratoClienteId);
    }

    get contratosPorClienteProdutor(): Contrato[] {
        if (!this.filtroProdutorClienteId) return this.todosContratos;
        return this.todosContratos.filter(c => c.clienteId === this.filtroProdutorClienteId);
    }

    limparFiltrosContrato() {
        this.filtroContratoClienteId = '';
        this.filtroContratoId = '';
        this.filtroContratoPeriodoInicio = '';
        this.filtroContratoPeriodoFim = '';
    }

    limparFiltrosProdutor() {
        this.filtroProdutorId = '';
        this.filtroProdutorClienteId = '';
        this.filtroProdutorContratoId = '';
        this.filtroProdutorPeriodoInicio = '';
        this.filtroProdutorPeriodoFim = '';
    }
}
