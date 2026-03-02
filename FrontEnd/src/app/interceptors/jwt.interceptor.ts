import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = window.localStorage.getItem('token');

    if (token && token !== 'undefined' && token !== 'null') {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(authReq);
    } else {
        console.warn(`%c[JWT Debug] ❌ Nenhum token válido encontrado para esta chamada.`, 'color: orange;');
    }

    return next(req);
};