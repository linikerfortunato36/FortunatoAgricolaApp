using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Movimentacao : BaseEntity
    {
        public DateTime Data { get; set; }
        public Guid ContratoId { get; set; }
        public Contrato Contrato { get; set; }
        public Guid ProdutorOrigemId { get; set; }
        public Produtor ProdutorOrigem { get; set; }
        public decimal QuantidadeOrigemKg { get; set; }
        public decimal PesoLiquidofazenda { get; set; }
        public decimal QuantidadeSacas => QuantidadeOrigemKg / 60;
        public decimal PesoDescargaKg { get; set; }
        public decimal DiferencaPesoKg => QuantidadeOrigemKg - PesoDescargaKg;
        public decimal UmidadeKg { get; set; }
        public decimal UmidadePorcentagem { get; set; }
        public decimal ImpurezaKg { get; set; }
        public decimal ImpurezaPorcentagem { get; set; }
        public decimal CustoFretePorSaca { get; set; }
        public decimal ValorCompraPorSaca { get; set; }
        public decimal ValorTotalCompra => QuantidadeSacas * ValorCompraPorSaca;
        public decimal ValorTotalFrete => QuantidadeSacas * CustoFretePorSaca;
        public decimal ValorPorSacaArmazem { get; set; }
        public decimal ValorTotalArmazem => QuantidadeSacas * ValorPorSacaArmazem;
        public string QuemPagaArmazem { get; set; } = "Nos"; // Nos, Cliente
        public decimal ValorVendaPorSaca { get; set; }
        public decimal ValorTotalVenda => QuantidadeSacas * ValorVendaPorSaca;
        public string Nfe { get; set; } = string.Empty;
        public decimal ValorNfe { get; set; }
        public decimal TotalCompra => ValorTotalCompra + ValorTotalFrete + (QuemPagaArmazem == "Nos" ? ValorTotalArmazem : 0);
        public decimal GanhoBruto => ValorTotalVenda - TotalCompra;
        public decimal PorcentagemImposto { get; set; }
        public decimal Imposto => GanhoBruto * (PorcentagemImposto / 100);
        public decimal ComissaoLdPorSaca { get; set; }
        public decimal TotalComissaoLd => QuantidadeSacas * ComissaoLdPorSaca;
        public decimal GanhoLiquido => GanhoBruto - Imposto - TotalComissaoLd;
        public Guid VendedorId { get; set; }
        public Usuario Vendedor { get; set; }
        public string Observacao { get; set; } = string.Empty;
        public DateTime? DataPrevistaPagamento { get; set; }
        public DateTime? DataEntrega { get; set; }
        public string Motorista { get; set; } = string.Empty;
        public Guid TransportadoraId { get; set; }
        public Transportadora Transportadora { get; set; }
        public decimal PesoFinal => PesoDescargaKg - UmidadeKg - ImpurezaKg;
    }
}
