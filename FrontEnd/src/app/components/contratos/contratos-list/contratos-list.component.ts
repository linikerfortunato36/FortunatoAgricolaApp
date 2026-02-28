import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Contrato } from '../../../services/api.service';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contratos-list.component.html',
  styleUrl: './contratos-list.component.css'
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getContratos().subscribe(
      (data) => this.contratos = data,
      (error) => console.error('Erro ao buscar contratos:', error)
    );
  }

  getProgressoWidth(entregue: number, total: number): number {
    if (total === 0) return 0;
    return (entregue / total) * 100;
  }
}
