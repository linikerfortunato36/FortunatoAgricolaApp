namespace FortunatoAgricola.Application.DTOs
{
    public class ConfiguracaoDto
    {
        public Guid Id { get; set; }
        public string RazaoSocial { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public decimal MargemLucro { get; set; }
        public decimal ToleranciaQuebraPeso { get; set; }
        public decimal ToleranciaUmidade { get; set; }
        public decimal ValorImpostoPorSaca { get; set; }
        public decimal ValorComissaoPorSaca { get; set; }
        public string? LogoBase64 { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedByName { get; set; }
    }
}
