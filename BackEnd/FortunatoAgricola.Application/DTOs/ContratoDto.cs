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
}
