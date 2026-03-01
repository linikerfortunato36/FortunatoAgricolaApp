import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  onGlobalSearch(): void {
    if (this.searchQuery.trim()) {
      // Por enquanto, redireciona para a lista de contratos com o termo de busca (opcional futuramente)
      console.log('Pesquisando por:', this.searchQuery);
      this.router.navigate(['/app/contratos']);
    }
  }

  get usuario() {
    return this.authService.getUsuario();
  }

  logout(): void {
    this.authService.logout();
  }
}
