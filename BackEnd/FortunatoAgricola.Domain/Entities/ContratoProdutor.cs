using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class ContratoProdutor : BaseEntity
    {
        public Guid ContratoId { get; set; }
        public virtual Contrato Contrato { get; set; }

        public Guid ProdutorId { get; set; }
        public virtual Produtor Produtor { get; set; }

        public decimal QuantidadeCotaKg { get; set; }
        public decimal QuantidadeEntregueKg { get; set; }
        public decimal QuantidadeRestanteKg => QuantidadeCotaKg - QuantidadeEntregueKg;
        public decimal ValorCompraPorSaca { get; set; }
        public decimal ValorFreteCotado { get; set; }
        public DateTime? DataFinalEntrega { get; set; }
    }
}
