import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  perfil: string = '';

  constructor(private authService: AuthService) {
    this.perfil = this.authService.getUsuario()?.perfil || '';
  }

  isAtLeast(role: string): boolean {
    if (this.perfil === 'Administrador') return true;
    if (role === 'Operador' && this.perfil === 'Operador') return true;
    if (role === 'Leitura') return true;
    return false;
  }
}
