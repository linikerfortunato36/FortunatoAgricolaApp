namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateProdutorDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public string InscricaoEstadual { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
