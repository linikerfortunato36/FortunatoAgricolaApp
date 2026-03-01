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
        public int QuantidadeEntregas { get; set; }
        public decimal ValorTotalNfe { get; set; }
        public decimal PercentualEntregue => QuantidadeTotalKg > 0 ? (QuantidadeEntregueKg / QuantidadeTotalKg) * 100 : 0;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedByName { get; set; }
    }
}
