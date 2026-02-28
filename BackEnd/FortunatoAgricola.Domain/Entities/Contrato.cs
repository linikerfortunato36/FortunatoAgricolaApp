using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Contrato : BaseEntity
    {
        public Guid ClienteId { get; set; }
        public Cliente Cliente { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public string Status { get; set; } = "Aberto"; // Em Andamento, Aberto, Finalizado
        public decimal QuantidadeTotalKg { get; set; }
        public decimal QuantidadeEntregueKg { get; set; }
        public decimal QuantidadeRestanteKg => QuantidadeTotalKg - QuantidadeEntregueKg;
        public bool IsActive { get; set; } = true;
    }
}
