import { Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/home/home.component';
import { ClientesListComponent } from './components/clientes/clientes-list/clientes-list.component';
import { ClienteFormComponent } from './components/clientes/cliente-form/cliente-form.component';
import { ContratosListComponent } from './components/contratos/contratos-list/contratos-list.component';
import { ContratoDetalheComponent } from './components/contratos/contrato-detalhe/contrato-detalhe.component';
import { ContratoFormComponent } from './components/contratos/contrato-form/contrato-form.component';
import { ProdutoresListComponent } from './components/produtores/produtores-list/produtores-list.component';
import { ProdutorFormComponent } from './components/produtores/produtor-form/produtor-form.component';
import { TransportadorasListComponent } from './components/transportadoras/transportadoras-list/transportadoras-list.component';
import { TransportadoraFormComponent } from './components/transportadoras/transportadora-form/transportadora-form.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes/configuracoes.component';
import { MovimentacaoFormComponent } from './components/movimentacoes/movimentacao-form/movimentacao-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingPageComponent } from './components/public/landing-page/landing-page.component';

export const routes: Routes = [
    // Landing Page (Página Inicial Pública)
    { path: '', component: LandingPageComponent },

    // Rota de Login pública
    { path: 'login', component: LoginComponent },

    // Redireciona raiz do app para dashboard se logado
    { path: 'app', redirectTo: '/app/dashboard', pathMatch: 'full' },

    // Rotas protegidas pelo AuthGuard
    {
        path: 'app',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: HomeComponent },
            { path: 'clientes', component: ClientesListComponent },
            { path: 'clientes/novo', component: ClienteFormComponent },
            { path: 'clientes/editar/:id', component: ClienteFormComponent },
            { path: 'contratos', component: ContratosListComponent },
            { path: 'contratos/novo', component: ContratoFormComponent },
            { path: 'contratos/editar/:id', component: ContratoFormComponent },
            { path: 'contratos/detalhe/:id', component: ContratoDetalheComponent },
            { path: 'produtores', component: ProdutoresListComponent },
            { path: 'produtores/novo', component: ProdutorFormComponent },
            { path: 'produtores/editar/:id', component: ProdutorFormComponent },
            { path: 'transportadoras', component: TransportadorasListComponent },
            { path: 'transportadoras/novo', component: TransportadoraFormComponent },
            { path: 'transportadoras/editar/:id', component: TransportadoraFormComponent },
            { path: 'movimentacoes/novo', component: MovimentacaoFormComponent },
            { path: 'usuarios', component: UsuariosListComponent },
            { path: 'usuarios/novo', component: UsuarioFormComponent },
            { path: 'usuarios/editar/:id', component: UsuarioFormComponent },
            { path: 'configuracoes', component: ConfiguracoesComponent }
        ]
    }
];
