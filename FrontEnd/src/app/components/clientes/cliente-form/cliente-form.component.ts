import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  isEditing = false;
  clienteId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.clienteId;
  }
}
