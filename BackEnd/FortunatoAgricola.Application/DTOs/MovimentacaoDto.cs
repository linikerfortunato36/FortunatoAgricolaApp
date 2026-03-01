namespace FortunatoAgricola.Application.DTOs
{
    public class MovimentacaoDto
    {
        public Guid Id { get; set; }
        public DateTime Data { get; set; }
        public Guid ContratoId { get; set; }
        public string ContratoNumero { get; set; } = string.Empty;
        public Guid ProdutorOrigemId { get; set; }
        public string ProdutorOrigemNome { get; set; } = string.Empty;
        public decimal QuantidadeOrigemKg { get; set; }
        public decimal PesoDescargaKg { get; set; }
        public decimal UmidadeKg { get; set; }
        public decimal ImpurezaKg { get; set; }
        public decimal UmidadePorcentagem { get; set; }
        public decimal ImpurezaPorcentagem { get; set; }
        public decimal PesoFinal { get; set; }
        public decimal PesoLiquidofazenda { get; set; }
        public string Motorista { get; set; } = string.Empty;
        public Guid TransportadoraId { get; set; }
        public string TransportadoraNome { get; set; } = string.Empty;
        
        // Dados Financeiros Básicos
        public decimal CustoFretePorSaca { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public decimal ValorVendaPorSaca { get; set; }
        public decimal GanhoLiquido { get; set; }
    }
}
