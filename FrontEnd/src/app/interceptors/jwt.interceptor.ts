import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    // 1. Tentar pegar o token do localStorage (usando window.localStorage para ser absoluto)
    const token = window.localStorage.getItem('token');

    // 2. DEBUG: Log obrigatório para sabermos se o interceptor está sendo chamado
    // Abra o console do navegador (F12) e procure por essas mensagens.
    console.log(`%c[JWT Debug] Interceptando requisição: ${req.method} ${req.url}`, 'color: blue; font-weight: bold;');

    // 3. Verificar o token
    if (token && token !== 'undefined' && token !== 'null') {
        console.log(`%c[JWT Debug] ✅ Token encontrado no localStorage. Injetando...`, 'color: green;');

        // Clonar e definir o Header Authorization: Bearer <token>
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        // 4. Verificar se o header foi realmente adicionado ao clone (debug interno)
        console.log(`%c[JWT Debug] Headers atuais:`, 'color: gray;', authReq.headers.get('Authorization'));

        return next(authReq);
    } else {
        console.warn(`%c[JWT Debug] ❌ Nenhum token válido encontrado para esta chamada.`, 'color: orange;');
    }

    return next(req);
};