import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  stats: any = {
    totalClientes: 0,
    totalProdutores: 0,
    totalMovimentacoes: 0,
    totalContratos: 0,
    volumeTotal: 0,
    topContratos: [],
    ultimosMovimentos: []
  };

  constructor(private dashboardService: DashboardService, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Erro ao carregar estatísticas dashboard', err)
    });
  }
}
