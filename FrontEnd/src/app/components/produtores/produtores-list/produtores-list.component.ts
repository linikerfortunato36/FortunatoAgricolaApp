import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Produtor } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produtores-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produtores-list.component.html',
  styleUrl: './produtores-list.component.css'
})
export class ProdutoresListComponent implements OnInit {
  produtores: Produtor[] = [];

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
