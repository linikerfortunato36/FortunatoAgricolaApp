import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  isLoading = false;
  errorMsg = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {
    // Se já logado, redireciona direto
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.errorMsg = 'Preencha o e-mail e a senha.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMsg = 'E-mail ou senha incorretos. Tente novamente.';
        } else {
          this.errorMsg = 'Erro ao conectar ao servidor. Verifique sua conexão.';
        }
      }
    });
  }
}
