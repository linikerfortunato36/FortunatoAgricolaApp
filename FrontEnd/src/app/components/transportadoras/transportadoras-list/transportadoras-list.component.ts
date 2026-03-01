import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Transportadora } from '../../../services/api.service';

@Component({
  selector: 'app-transportadoras-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transportadoras-list.component.html',
  styleUrl: './transportadoras-list.component.css'
})
export class TransportadorasListComponent implements OnInit {
  transportadoras: Transportadora[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTransportadoras();
  }

  loadTransportadoras(): void {
    this.apiService.getTransportadoras().subscribe(data => {
      this.transportadoras = data;
    });
  }
}
