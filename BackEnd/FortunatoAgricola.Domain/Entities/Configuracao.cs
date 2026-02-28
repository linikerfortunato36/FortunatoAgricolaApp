using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Configuracao : BaseEntity
    {
        public string RazaoSocial { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public decimal MargemLucro { get; set; }
        public decimal ToleranciaQuebraPeso { get; set; }
        public decimal ToleranciaUmidade { get; set; }
        public decimal ValorBaseComissaoVendaPorSaca { get; set; }
        public decimal PorcentagemImposto { get; set; }
    }
}
