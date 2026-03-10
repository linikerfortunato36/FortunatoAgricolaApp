namespace FortunatoAgricola.Application.DTOs
{
    public class CreateContratoProdutorDto
    {
        public Guid ProdutorId { get; set; }
        public decimal QuantidadeCotaKg { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public DateTime? DataFinalEntrega { get; set; }
    }
}
