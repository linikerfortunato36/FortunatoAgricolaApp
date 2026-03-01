namespace FortunatoAgricola.Application.DTOs
{
    public class TransportadoraDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public string? InscricaoEstadual { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Estado { get; set; }
        public bool IsActive { get; set; }
        public int TotalViagens { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedByName { get; set; }
    }
}
