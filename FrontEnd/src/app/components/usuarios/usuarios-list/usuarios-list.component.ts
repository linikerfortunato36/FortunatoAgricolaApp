import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Usuario } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.css'
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private apiService: ApiService, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Erro ao buscar usuários', err)
    });
  }

  deleteUsuario(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "A inativação/exclusão poderá afetar acessos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, inativar/excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUsuario(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Usuário excluído com sucesso.', 'success');
            this.loadUsuarios();
          },
          error: (err) => {
            // Se for 400 BadRequest (nosso erro tratado), pego a mensagem
            const msg = err.error?.Message || err.error?.message || 'Erro ao excluir usuário.';
            Swal.fire('Atenção', msg, 'warning');
          }
        });
      }
    });
  }
}
