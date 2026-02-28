using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Configuracao : BaseEntity
    {
        public decimal ValorBaseComissaoVendaPorSaca { get; set; }
        public decimal PorcentagemImposto { get; set; }
    }
}
