using System;

namespace FortunatoAgricola.Application.DTOs
{
    public class ContratoDto
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public string ClienteNome { get; set; } = string.Empty;
        public string NumeroContrato { get; set; } = string.Empty;
        public string Status { get; set; } = "Aberto";
        public decimal QuantidadeTotalKg { get; set; }
        public decimal QuantidadeEntregueKg { get; set; }
        public decimal QuantidadeRestanteKg { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateContratoDto
    {
        public Guid ClienteId { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
    }

    public class UpdateContratoDto
    {
        public Guid Id { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
