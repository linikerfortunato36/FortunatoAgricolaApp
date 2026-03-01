import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Cliente } from '../../../services/api.service';

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

  constructor(private apiService: ApiService) { }

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
}
