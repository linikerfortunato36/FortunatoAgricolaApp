namespace FortunatoAgricola.Application.DTOs
{
    public class CreateMovimentacaoDto
    {
        public DateTime Data { get; set; }
        public Guid ContratoId { get; set; }
        public Guid ProdutorOrigemId { get; set; }
        public decimal QuantidadeOrigemKg { get; set; }
        public decimal PesoLiquidofazenda { get; set; }
        public decimal PesoDescargaKg { get; set; }
        public decimal UmidadeKg { get; set; }
        public decimal ImpurezaKg { get; set; }
        public decimal UmidadePorcentagem { get; set; }
        public decimal ImpurezaPorcentagem { get; set; }
        public string Motorista { get; set; } = string.Empty;
        public Guid TransportadoraId { get; set; }
        public Guid VendedorId { get; set; }
    }
}
