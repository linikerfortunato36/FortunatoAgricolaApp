namespace FortunatoAgricola.Application.DTOs
{
    public class ProdutorDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public string InscricaoEstadual { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedByName { get; set; }
    }
}
