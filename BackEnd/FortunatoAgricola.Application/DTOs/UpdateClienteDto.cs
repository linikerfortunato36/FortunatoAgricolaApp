namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateClienteDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string? InscricaoEstadual { get; set; }
        public string? Email { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public bool IsActive { get; set; }
    }
}
