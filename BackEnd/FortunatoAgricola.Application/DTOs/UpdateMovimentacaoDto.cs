namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateMovimentacaoDto
    {
        public Guid Id { get; set; }
        public decimal PesoDescargaKg { get; set; }
        public decimal UmidadeKg { get; set; }
        public decimal ImpurezaKg { get; set; }
        public decimal UmidadePorcentagem { get; set; }
        public decimal ImpurezaPorcentagem { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public decimal CustoFretePorSaca { get; set; }
        public decimal ValorVendaPorSaca { get; set; }
    }
}
