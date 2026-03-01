import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    expiry: string;
    nome: string;
    email: string;
    perfil: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('usuario', JSON.stringify({
                    nome: response.nome,
                    email: response.email,
                    perfil: response.perfil,
                    expiry: response.expiry
                }));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        const usuarioStr = localStorage.getItem('usuario');
        if (!token || !usuarioStr) return false;

        try {
            const usuario = JSON.parse(usuarioStr);
            const expiry = new Date(usuario.expiry);
            return expiry > new Date();
        } catch {
            return false;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUsuario(): { nome: string; email: string; perfil: string } | null {
        const str = localStorage.getItem('usuario');
        return str ? JSON.parse(str) : null;
    }

    canModify(): boolean {
        const usuario = this.getUsuario();
        return usuario?.perfil === 'Administrador' || usuario?.perfil === 'Operador';
    }
}
