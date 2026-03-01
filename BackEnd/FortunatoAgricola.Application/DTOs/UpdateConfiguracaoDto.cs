namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateConfiguracaoDto
    {
        public Guid Id { get; set; }
        public string RazaoSocial { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public decimal MargemLucro { get; set; }
        public decimal ToleranciaQuebraPeso { get; set; }
        public decimal ToleranciaUmidade { get; set; }
        
        // Novos campos
        public decimal ValorImpostoPorSaca { get; set; }
        public decimal ValorComissaoPorSaca { get; set; }
    }
}
