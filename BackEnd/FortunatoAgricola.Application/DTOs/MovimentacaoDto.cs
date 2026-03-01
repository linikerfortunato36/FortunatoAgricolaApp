namespace FortunatoAgricola.Application.DTOs
{
    public class MovimentacaoDto
    {
        public Guid Id { get; set; }
        public DateTime Data { get; set; }
        public Guid ContratoId { get; set; }
        public string ContratoNumero { get; set; } = string.Empty;
        public string ClienteNome { get; set; } = string.Empty;
        public Guid ProdutorOrigemId { get; set; }
        public string ProdutorOrigemNome { get; set; } = string.Empty;
        public decimal QuantidadeOrigemKg { get; set; }
        public decimal QuantidadeSacas { get; set; }
        public decimal PesoDescargaKg { get; set; }
        public decimal DiferencaPesoKg { get; set; }
        public decimal UmidadeKg { get; set; }
        public decimal UmidadePorcentagem { get; set; }
        public decimal ImpurezaKg { get; set; }
        public decimal ImpurezaPorcentagem { get; set; }
        public decimal PesoFinal { get; set; }
        public decimal PesoLiquidofazenda { get; set; }
        public string Motorista { get; set; } = string.Empty;
        public Guid TransportadoraId { get; set; }
        public string TransportadoraNome { get; set; } = string.Empty;
        public Guid VendedorId { get; set; }
        public string VendedorNome { get; set; } = string.Empty;
        
        // Dados Financeiros
        public decimal CustoFretePorSaca { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public decimal ValorTotalCompra { get; set; }
        public decimal ValorTotalFrete { get; set; }
        public decimal ValorPorSacaArmazem { get; set; }
        public decimal ValorTotalArmazem { get; set; }
        public string QuemPagaArmazem { get; set; } = "Nos";
        public decimal ValorVendaPorSaca { get; set; }
        public decimal ValorTotalVenda { get; set; }
        public string Nfe { get; set; } = string.Empty;
        public decimal ValorNfe { get; set; }
        public decimal TotalCompra { get; set; }
        public decimal GanhoBruto { get; set; }
        public decimal ValorImpostoPorSaca { get; set; }
        public decimal Imposto { get; set; }
        public decimal ComissaoLdPorSaca { get; set; }
        public decimal TotalComissaoLd { get; set; }
        public decimal GanhoLiquido { get; set; }
        
        public string Observacao { get; set; } = string.Empty;
        public DateTime? DataPrevistaPagamento { get; set; }
        public DateTime? DataEntrega { get; set; }
    }
}
