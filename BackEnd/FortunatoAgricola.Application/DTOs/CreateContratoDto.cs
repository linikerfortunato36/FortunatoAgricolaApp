namespace FortunatoAgricola.Application.DTOs
{
    public class CreateContratoDto
    {
        public Guid ClienteId { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
        public decimal ValorVendaPorSaca { get; set; }
        public List<CreateContratoProdutorDto> ProdutoresVinculados { get; set; } = new List<CreateContratoProdutorDto>();
    }
}
