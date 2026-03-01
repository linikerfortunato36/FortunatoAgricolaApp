import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Cliente } from '../../../services/api.service';

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
    if (confirm(`Tem certeza que deseja desativar o cliente "${nome}"?`)) {
      this.apiService.deleteCliente(id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: (err) => {
          console.error('Erro ao excluir cliente:', err);
          alert('Não foi possível excluir o cliente no momento.');
        }
      });
    }
  }
}
