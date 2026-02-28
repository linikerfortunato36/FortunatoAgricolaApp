namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateClienteDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
