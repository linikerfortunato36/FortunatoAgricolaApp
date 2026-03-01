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
        
        // Novos campos financeiros
        public decimal CustoFretePorSaca { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public decimal ValorPorSacaArmazem { get; set; }
        public string QuemPagaArmazem { get; set; } = "Nos"; // Nos, Cliente
        public decimal ValorVendaPorSaca { get; set; }
        public string Nfe { get; set; } = string.Empty;
        public decimal ValorNfe { get; set; }
        
        public string Observacao { get; set; } = string.Empty;
        public DateTime? DataPrevistaPagamento { get; set; }
        public DateTime? DataEntrega { get; set; }
        
        // Campos de configuração passados para persistência no ato
        public decimal ValorImpostoPorSaca { get; set; }
        public decimal ComissaoLdPorSaca { get; set; }
    }
}
