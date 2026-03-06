import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Redireciona para o login quando a API retorna erro 401 Não Autorizado
                console.warn('API retornou 401 Não Autorizado. Redirecionando para /login...');
                localStorage.removeItem('token'); // limpa o token que está inválido
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
