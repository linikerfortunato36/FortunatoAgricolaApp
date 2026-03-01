import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService, Cliente } from '../../../services/api.service';

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

    contrato: any = {
        clienteId: null,
        numeroContrato: '',
        quantidadeTotalKg: 0,
        status: 'Aberto',
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
        this.carregarClientes();
        this.contratoId = this.route.snapshot.paramMap.get('id');
        this.isEditing = !!this.contratoId;

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

    onSubmit(): void {
        if (!this.contrato.clienteId || !this.contrato.numeroContrato || this.contrato.quantidadeTotalKg <= 0) {
            alert('Preencha todos os campos obrigatórios corretamente.');
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
