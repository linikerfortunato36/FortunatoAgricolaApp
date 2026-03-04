import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Transportadora } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-transportadoras-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule],
  templateUrl: './transportadoras-list.component.html',
  styleUrl: './transportadoras-list.component.css'
})
export class TransportadorasListComponent implements OnInit {
  transportadoras: Transportadora[] = [];
  termoBusca: string = '';
  p: number = 1;

  constructor(private apiService: ApiService, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadTransportadoras();
  }

  loadTransportadoras(): void {
    this.apiService.getTransportadoras().subscribe(data => {
      this.transportadoras = data;
    });
  }

  getTransportadorasFiltradas(): Transportadora[] {
    if (!this.termoBusca) return this.transportadoras;
    const term = this.termoBusca.toLowerCase();
    return this.transportadoras.filter(t =>
      t.nome.toLowerCase().includes(term) ||
      (t.cpfCnpj && t.cpfCnpj.toLowerCase().includes(term))
    );
  }

  deleteTransportadora(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Isso inativará ou excluirá esta transportadora permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, inativar/excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteTransportadora(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Transportadora excluída/inativada com sucesso.', 'success');
            this.loadTransportadoras();
          },
          error: (err) => {
            const msg = err.error?.Message || err.error?.message || 'Erro ao excluir Transportadora.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }
}
