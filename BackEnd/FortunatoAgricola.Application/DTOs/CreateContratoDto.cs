namespace FortunatoAgricola.Application.DTOs
{
    public class CreateContratoDto
    {
        public Guid ClienteId { get; set; }
        public string NumeroContrato { get; set; } = string.Empty;
        public decimal QuantidadeTotalKg { get; set; }
    }
}
