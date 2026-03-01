import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  userMenuOpen = false;
  notifMenuOpen = false;
  notificacoes: any[] = [];
  unreadCount = 0;

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarNotificacoes();
  }

  carregarNotificacoes(): void {
    if (this.authService.isLoggedIn()) {
      this.dashboardService.getNotificacoes().subscribe({
        next: (data) => {
          this.notificacoes = data;
          this.unreadCount = this.notificacoes.filter(n => !n.lida).length;
        },
        error: (err) => console.error('Erro ao carregar notificações', err)
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Don't close if clicking inside the toggle buttons or the menu itself
    if (!target.closest('.dropdown-toggle') && !target.closest('.dropdown-menu')) {
      this.userMenuOpen = false;
      this.notifMenuOpen = false;
    }
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    this.notifMenuOpen = false;
  }

  toggleNotifMenu(event: Event): void {
    event.stopPropagation();
    this.notifMenuOpen = !this.notifMenuOpen;
    this.userMenuOpen = false;
  }

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
