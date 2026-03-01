import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Produtor } from '../../../services/api.service';

@Component({
  selector: 'app-produtor-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './produtor-form.component.html',
  styleUrl: './produtor-form.component.css'
})
export class ProdutorFormComponent implements OnInit {
  isEditing = false;
  produtorId: string | null = null;

  produtor: any = {
    nome: '',
    cpfCnpj: '',
    inscricaoEstadual: '',
    telefone: '',
    email: '',
    isActive: true
  };

  loading = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.produtorId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.produtorId;

    if (this.isEditing && this.produtorId) {
      this.loading = true;
      this.apiService.getProdutorById(this.produtorId).subscribe({
        next: (data) => {
          this.produtor = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.produtor.nome || !this.produtor.cpfCnpj) {
      alert('Nome e CPF/CNPJ são obrigatórios.');
      return;
    }

    this.submitting = true;
    if (this.isEditing && this.produtorId) {
      this.apiService.updateProdutor(this.produtorId, this.produtor).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/produtores']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.apiService.createProdutor(this.produtor).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/app/produtores']);
        },
        error: (err) => {
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
}
