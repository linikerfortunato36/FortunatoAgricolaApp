namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateContratoDto
    {
        public Guid Id { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
