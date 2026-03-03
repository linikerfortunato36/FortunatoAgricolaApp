namespace FortunatoAgricola.Application.DTOs
{
    public class ContratoProdutorDto
    {
        public Guid ContratoId { get; set; }
        public Guid ProdutorId { get; set; }
        public string ProdutorNome { get; set; } = string.Empty;
        public decimal QuantidadeCotaKg { get; set; }
        public decimal QuantidadeEntregueKg { get; set; }
        public decimal QuantidadeRestanteKg { get; set; }
    }
}
