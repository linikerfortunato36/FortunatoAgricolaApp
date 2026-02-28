import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Produtor } from '../../../services/api.service';

@Component({
  selector: 'app-produtores-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produtores-list.component.html',
  styleUrl: './produtores-list.component.css'
})
export class ProdutoresListComponent implements OnInit {
  produtores: Produtor[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getProdutores().subscribe(
      (data) => this.produtores = data,
      (error) => console.error('Erro ao buscar produtores:', error)
    );
  }
}
