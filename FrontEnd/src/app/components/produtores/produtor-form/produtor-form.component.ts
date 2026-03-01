import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Produtor, Movimentacao } from '../../../services/api.service';

@Component({
  selector: 'app-produtor-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './produtor-form.component.html',
  styleUrl: './produtor-form.component.css'
})
export class ProdutorFormComponent implements OnInit {
  isEditing = false;
  produtorId: string | null = null;
  activeTab = 'form'; // 'boards' ou 'form'

  produtor: any = {
    nome: '',
    cpfCnpj: '',
    inscricaoEstadual: '',
    telefone: '',
    email: '',
    isActive: true
  };

  movimentacoes: Movimentacao[] = [];
  contratosGrouped: any[] = [];
  filtroContrato: string = '';

  loading = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.produtorId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.produtorId;

    if (this.isEditing && this.produtorId) {
      this.activeTab = 'boards'; // Mostrar aba de boards apenas na edição
      this.loading = true;

      this.apiService.getProdutorById(this.produtorId).subscribe({
        next: (data) => {
          this.produtor = data;
          this.loadMovimentacoes();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.activeTab = 'form'; // Só tem formulário na criação
    }
  }

  loadMovimentacoes(): void {
    if (!this.produtorId) return;

    this.apiService.getMovimentacoesByProdutor(this.produtorId).subscribe({
      next: (data) => {
        this.movimentacoes = data;
        this.processarDashboard();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar movimentações do produtor', err);
        this.loading = false;
      }
    });
  }

  processarDashboard(): void {
    const map = new Map<string, any>();

    this.movimentacoes.forEach(m => {
      if (!map.has(m.contratoNumero)) {
        map.set(m.contratoNumero, {
          contratoId: m.contratoId,
          contratoNumero: m.contratoNumero,
          clienteNome: m.clienteNome,
          totalEntregueKg: 0,
          totalSacas: 0,
          totalDescargas: 0
        });
      }
      const resumo = map.get(m.contratoNumero);
      resumo.totalEntregueKg += m.pesoLiquidofazenda; // ou pesoFinal
      resumo.totalSacas += m.quantidadeSacas;
      resumo.totalDescargas += 1;
    });

    this.contratosGrouped = Array.from(map.values());
  }

  get movimentacoesFiltradas() {
    if (!this.filtroContrato) {
      return this.movimentacoes;
    }
    return this.movimentacoes.filter(m =>
      m.contratoNumero.toLowerCase().includes(this.filtroContrato.toLowerCase()) ||
      m.clienteNome.toLowerCase().includes(this.filtroContrato.toLowerCase())
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getProgressoWidth(entregue: number, total: number): number {
    if (!total || total === 0) return 0;
    return (entregue / total) * 100;
  }

  onSubmit(): void {
    if (!this.produtor.nome || !this.produtor.cpfCnpj) {
      alert('Nome e CPF/CNPJ são obrigatórios.');
      return;
    }

    this.submitting = true;
    if (this.isEditing && this.produtorId) {
      this.apiService.updateProdutor(this.produtorId, this.produtor).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/produtores']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.apiService.createProdutor(this.produtor).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/produtores']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
}
