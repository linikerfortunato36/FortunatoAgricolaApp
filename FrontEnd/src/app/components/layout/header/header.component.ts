import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchQuery = '';

  constructor(public authService: AuthService) { }

  onGlobalSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Pesquisando por:', this.searchQuery);
      // Aqui poderíamos redirecionar para uma página de resultados
    }
  }

  get usuario() {
    return this.authService.getUsuario();
  }

  logout(): void {
    this.authService.logout();
  }
}
