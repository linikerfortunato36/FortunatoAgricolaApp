import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuarioId: string | null = null;
  usuario: any = {
    nome: '',
    login: '',
    senha: '',
    perfil: 'Operador',
    isActive: true
  };
  confirmarSenha = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.carregarUsuario();
    }
  }

  carregarUsuario(): void {
    if (this.usuarioId) {
      this.apiService.getUsuarioById(this.usuarioId).subscribe({
        next: (data) => {
          this.usuario = { ...data, senha: '' };
        },
        error: (err) => console.error('Erro ao carregar usuário', err)
      });
    }
  }

  salvar(): void {
    if (!this.usuario.nome || !this.usuario.login) {
      alert('Por favor, preencha os campos obrigatórios (Nome e E-mail).');
      return;
    }

    if (!this.usuarioId && !this.usuario.senha) {
      alert('A senha é obrigatória para novos usuários.');
      return;
    }

    if (this.usuario.senha !== this.confirmarSenha) {
      alert('As senhas não conferem.');
      return;
    }

    if (this.usuarioId) {
      this.apiService.updateUsuario(this.usuarioId, this.usuario).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/app/usuarios']);
        },
        error: (err) => console.error('Erro ao atualizar usuário', err)
      });
    } else {
      this.apiService.createUsuario(this.usuario).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/app/usuarios']);
        },
        error: (err) => console.error('Erro ao cadastrar usuário', err)
      });
    }
  }
}

