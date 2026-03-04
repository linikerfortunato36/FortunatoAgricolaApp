import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Produtor } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-produtores-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule],
  templateUrl: './produtores-list.component.html',
  styleUrl: './produtores-list.component.css'
})
export class ProdutoresListComponent implements OnInit {
  produtores: Produtor[] = [];
  termoBusca: string = '';
  p: number = 1;

  constructor(private apiService: ApiService, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadProdutores();
  }

  loadProdutores(): void {
    this.apiService.getProdutores().subscribe(
      (data) => this.produtores = data,
      (error) => console.error('Erro ao buscar produtores:', error)
    );
  }

  getProdutoresFiltrados(): Produtor[] {
    if (!this.termoBusca) return this.produtores;
    const term = this.termoBusca.toLowerCase();
    return this.produtores.filter(p =>
      p.nome.toLowerCase().includes(term) ||
      (p.cpfCnpj && p.cpfCnpj.toLowerCase().includes(term))
    );
  }

  deleteProdutor(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Isso inativará ou excluirá o produtor.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteProdutor(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Produtor atualizado com sucesso.', 'success');
            this.loadProdutores();
          },
          error: (err) => {
            const msg = err.error?.Message || err.error?.message || 'Erro ao excluir Produtor.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }
}
