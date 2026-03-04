import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService, Cliente } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-contrato-form',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, NgSelectModule],
    templateUrl: './contrato-form.component.html',
    styleUrl: './contrato-form.component.css'
})
export class ContratoFormComponent implements OnInit {
    isEditing = false;
    contratoId: string | null = null;
    clientes: Cliente[] = [];
    produtores: any[] = [];

    // UI state for adding new produtor logic
    selectedProdutorId: string | null = null;
    quotaInput: number | null = null;
    valorCompraInput: number | null = null;

    contrato: any = {
        clienteId: null,
        numeroContrato: '',
        quantidadeTotalKg: 0,
        valorVendaPorSaca: 0,
        status: 'Aberto',
        isActive: true,
        produtoresVinculados: []
    };

    loading = false;
    submitting = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.contratoId = this.route.snapshot.paramMap.get('id');
        this.isEditing = !!this.contratoId;

        if (!this.authService.isAdminOrMaster()) {
            this.router.navigate(['/app/contratos']);
            return;
        }

        this.carregarClientes();
        this.carregarProdutores();

        if (this.isEditing && this.contratoId) {
            this.loading = true;
            this.apiService.getContratoById(this.contratoId).subscribe({
                next: (data) => {
                    this.contrato = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    carregarClientes(): void {
        this.apiService.getClientes().subscribe(data => this.clientes = data);
    }

    carregarProdutores(): void {
        this.apiService.getProdutores().subscribe(data => this.produtores = data);
    }

    get sumQuotas(): number {
        return this.contrato.produtoresVinculados.reduce((sum: number, p: any) => sum + (p.quantidadeCotaKg || 0), 0);
    }

    addProdutor(): void {
        if (!this.selectedProdutorId || !this.quotaInput || !this.valorCompraInput) return;

        const existing = this.contrato.produtoresVinculados.find((p: any) => p.produtorId === this.selectedProdutorId);
        if (existing) {
            alert('Produtor já adicionado!');
            return;
        }

        if (this.sumQuotas + this.quotaInput > this.contrato.quantidadeTotalKg) {
            alert('A soma das cotas não pode exceder o total do contrato!');
            return;
        }

        const prod = this.produtores.find(p => p.id === this.selectedProdutorId);
        this.contrato.produtoresVinculados.push({
            produtorId: this.selectedProdutorId,
            produtorNome: prod?.nome || '',
            quantidadeCotaKg: this.quotaInput,
            quantidadeEntregueKg: 0,
            valorCompraPorSaca: this.valorCompraInput
        });

        this.selectedProdutorId = null;
        this.quotaInput = null;
        this.valorCompraInput = null;
    }

    removeProdutor(produtorId: string): void {
        this.contrato.produtoresVinculados = this.contrato.produtoresVinculados.filter((p: any) => p.produtorId !== produtorId);
    }

    onSubmit(): void {
        if (!this.contrato.clienteId || !this.contrato.numeroContrato || this.contrato.quantidadeTotalKg <= 0) {
            alert('Preencha todos os campos obrigatórios corretamente.');
            return;
        }

        if (this.sumQuotas > this.contrato.quantidadeTotalKg) {
            alert('A soma das cotas dos produtores excede a cota total do contrato!');
            return;
        }

        this.submitting = true;

        // Como não criei os métodos de create/update contrato no ApiService ainda, vou adicioná-los depois ou fazer inline aqui se necessário.
        // Melhor adicionar no ApiService.
        const request = this.isEditing && this.contratoId
            ? this.apiService.updateContrato(this.contratoId, this.contrato)
            : this.apiService.createContrato(this.contrato);

        request.subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/app/contratos']);
            },
            error: (err) => {
                this.submitting = false;
                console.error(err);
            }
        });
    }
}
