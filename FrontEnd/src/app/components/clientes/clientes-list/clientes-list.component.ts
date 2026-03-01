import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Cliente } from '../../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css'
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.apiService.getClientes().subscribe(data => {
      this.clientes = data;
    });
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
            Swal.fire('Sucesso!', 'Cliente atualizado com sucesso.', 'success');
            this.loadClientes();
          },
          error: (err) => {
            console.error('Erro ao excluir cliente:', err);
            const msg = err.error?.Message || err.error?.message || 'Não foi possível excluir o cliente no momento.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }
}
