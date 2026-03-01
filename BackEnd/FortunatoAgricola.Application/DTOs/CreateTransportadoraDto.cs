namespace FortunatoAgricola.Application.DTOs
{
    public class CreateTransportadoraDto
    {
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public string? InscricaoEstadual { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Estado { get; set; }
    }
}
