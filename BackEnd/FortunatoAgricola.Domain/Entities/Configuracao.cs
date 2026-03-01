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
        
        // Novos campos financeiros globais
        public decimal ValorImpostoPorSaca { get; set; }
        public decimal ValorComissaoPorSaca { get; set; }
        public string? LogoBase64 { get; set; }
    }
}
