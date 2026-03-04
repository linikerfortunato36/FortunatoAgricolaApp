import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApiService, Cliente } from '../../../services/api.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css'
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  termoBusca: string = '';
  p: number = 1;

  constructor(private apiService: ApiService, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.apiService.getClientes().subscribe(data => this.clientes = data);
  }

  getClientesFiltrados(): Cliente[] {
    if (!this.termoBusca) return this.clientes;
    const term = this.termoBusca.toLowerCase();
    return this.clientes.filter(c =>
      c.nome.toLowerCase().includes(term) ||
      (c.cnpj && c.cnpj.toLowerCase().includes(term))
    );
  }

  onDelete(id: string, nome: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja inativar/excluir o cliente "${nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteCliente(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Operação realizada com sucesso.', 'success');
            this.loadClientes();
          },
          error: (err) => {
            console.error('Erro ao excluir cliente:', err);
            const msg = err.error?.Message || err.error?.message || 'Não foi possível realizar a operação no momento.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }
}
