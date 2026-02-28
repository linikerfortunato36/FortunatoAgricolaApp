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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.contratoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.contratoId) {
      this.carregarContrato();
      this.carregarMovimentacoes();
    }
  }

  carregarContrato(): void {
    this.apiService.getContratoById(this.contratoId).subscribe(
      (data) => this.contrato = data,
      (error) => console.error('Erro ao buscar contrato:', error)
    );
  }

  carregarMovimentacoes(): void {
    this.apiService.getMovimentacoesByContrato(this.contratoId).subscribe(
      (data) => this.movimentacoes = data,
      (error) => console.error('Erro ao buscar movimentações:', error)
    );
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

  getProgressoPct(): number {
    if (!this.contrato || this.contrato.quantidadeTotalKg === 0) return 0;
    return (this.contrato.quantidadeEntregueKg / this.contrato.quantidadeTotalKg) * 100;
  }
}
