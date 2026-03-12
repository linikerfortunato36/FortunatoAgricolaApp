namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateContratoDto
    {
        public Guid Id { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? DataFinalEntrega { get; set; }
        public decimal ValorVendaPorSaca { get; set; }
        public bool IsActive { get; set; }
        public List<CreateContratoProdutorDto> ProdutoresVinculados { get; set; } = new List<CreateContratoProdutorDto>();
    }
}
